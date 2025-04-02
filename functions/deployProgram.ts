import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

// LoaderV4 is now the standard program loader
const LOADER_V4_PROGRAM_ID = new PublicKey(
  "LoaderV411111111111111111111111111111111111"
);
import {
  FireblocksConnectionAdapter,
  FireblocksConnectionAdapterConfig,
  FeeLevel,
} from "../fireblocks/index";
import fs from "fs";

require("dotenv").config();

async function deployProgram() {
  console.log("Starting Solana program deployment...");
  console.log("apiKey:", process.env.FIREBLOCKS_API_KEY);
  console.log("apiSecretPath:", process.env.FIREBLOCKS_SECRET_KEY_PATH);
  console.log("vaultAccountId:", process.env.FIREBLOCKS_VAULT_ACCOUNT_ID);

  // Configure Fireblocks connection
  const fireblocksConnectionConfig: FireblocksConnectionAdapterConfig = {
    apiKey: process.env.FIREBLOCKS_API_KEY || "",
    apiSecretPath: process.env.FIREBLOCKS_SECRET_KEY_PATH || "",
    vaultAccountId: process.env.FIREBLOCKS_VAULT_ACCOUNT_ID || "",
    feeLevel: FeeLevel.HIGH, // Use high fee level for deployment transactions
    silent: false,
    devnet: true, // Set to true for devnet, false for mainnet
  };

  // Create connection to Solana devnet
  const connection = await FireblocksConnectionAdapter.create(
    clusterApiUrl("devnet"),
    fireblocksConnectionConfig
  );

  // Get the account public key from the Fireblocks vault
  const payerPublicKey = new PublicKey(connection.getAccount());
  console.log("Deployer account:", payerPublicKey.toBase58());

  // Create a new keypair for the program
  const programKeypair = new Keypair({
    publicKey: new PublicKey(process.env.PROGRAM_ID || "").toBytes(),
    secretKey: new Uint8Array(64), // 空的私钥，因为我们只需要公钥
  });
  console.log("Program ID:", programKeypair.publicKey.toBase58());

  // Path to the compiled program (replace with your actual program path)
  // Note: You need to compile your Solana program using the Solana CLI before running this script
  // Example: solana-test-validator
  // In another terminal: cargo build-bpf --manifest-path=./path/to/program/Cargo.toml
  const programPath = process.env.FIREBLOCKS_DEPLOY_FILE || "";

  // For this example, we'll check if the file exists
  if (!fs.existsSync(programPath)) {
    console.error(`Program file not found at ${programPath}`);
    console.error(
      "Please compile your Solana program before running this script"
    );
    console.error(
      "Example: cargo build-bpf --manifest-path=./path/to/program/Cargo.toml"
    );
    return;
  }

  // Read the program file
  const programData = fs.readFileSync(programPath);
  console.log(`Program size: ${programData.length} bytes`);

  // Set transaction note
  connection.setTxNote(
    "Deploying Solana program with Fireblocks Connection Adapter"
  );

  try {
    // Calculate minimum balance for rent exemption
    const minimumBalanceForRentExemption =
      await connection.getMinimumBalanceForRentExemption(programData.length);
    console.log(
      `Minimum balance for rent exemption: ${minimumBalanceForRentExemption / LAMPORTS_PER_SOL} SOL`
    );

    // Deploy the program
    console.log("Deploying program...");

    // Note: BpfLoader.load requires a signer that we can't provide with Fireblocks
    // Instead, we'll use a multi-step approach with individual transactions

    // 1. Create program account
    const createAccountTransaction = new Transaction();
    createAccountTransaction.feePayer = payerPublicKey;
    createAccountTransaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    createAccountTransaction.add(
      SystemProgram.createAccount({
        fromPubkey: payerPublicKey,
        newAccountPubkey: programKeypair.publicKey,
        lamports: minimumBalanceForRentExemption,
        space: programData.length,
        programId: LOADER_V4_PROGRAM_ID,
      })
    );

    // Sign and send the create account transaction
    // Note: We need to sign with both the payer and the program keypair
    // Since Fireblocks can only sign with the payer, we'll use partialSign for the program keypair
    createAccountTransaction.partialSign(programKeypair);

    // Serialize the transaction with verifySignatures set to false
    const serializedTx = createAccountTransaction.serialize({
      verifySignatures: false,
    });
    console.log("Serialized transaction:", serializedTx.toString("base64"));

    const createAccountTxHash = await sendAndConfirmTransaction(
      connection,
      createAccountTransaction,
      [] // Empty array since Fireblocks will handle the payer signature
    );
    console.log(
      `Program account created: https://explorer.solana.com/tx/${createAccountTxHash}?cluster=devnet`
    );

    // 2. Write program data in chunks
    console.log("Writing program data in chunks...");

    // 设置合适的分块大小以确保不超过交易大小限制
    const chunkSize = 800; // 设置为800字节，确保交易大小不超过1232字节限制
    const totalChunks = Math.ceil(programData.length / chunkSize);

    console.log(`Total chunks needed: ${totalChunks}`);
    let chunkTxHash = ""; // Declare variable outside loop

    for (let i = 0; i < totalChunks; i++) {
      const offset = i * chunkSize;
      const chunk = programData.slice(offset, offset + chunkSize);

      console.log(
        `Writing chunk ${i + 1}/${totalChunks} (${chunk.length} bytes) at offset ${offset}...`
      );

      const chunkTransaction = new Transaction();
      chunkTransaction.feePayer = payerPublicKey;
      chunkTransaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      // 优化指令数据结构
      const instructionData = Buffer.concat([
        Buffer.from([0]), // Instruction (0 = Load)
        Buffer.from(new Uint32Array([offset]).buffer), // Write offset as 4 bytes
        chunk, // Chunk data
      ]);

      // 验证交易大小
      const estimatedSize = instructionData.length + 100; // 100字节作为交易元数据的预估值
      if (estimatedSize > 1232) {
        throw new Error(`Transaction size too large: ${estimatedSize} > 1232`);
      }

      chunkTransaction.add(
        new TransactionInstruction({
          programId: LOADER_V4_PROGRAM_ID,
          keys: [
            {
              pubkey: programKeypair.publicKey,
              isSigner: true,
              isWritable: true,
            },
          ],
          data: instructionData,
        })
      );

      try {
        console.log("Signing chunk transaction...");
        chunkTransaction.partialSign(programKeypair);

        const chunkTxHash = await sendAndConfirmTransaction(
          connection,
          chunkTransaction,
          [] // Empty array since Fireblocks will handle the payer signature
        );

        console.log(
          `Chunk ${i + 1}/${totalChunks} written: https://explorer.solana.com/tx/${chunkTxHash}?cluster=devnet`
        );
      } catch (chunkError) {
        console.error(`Error writing chunk ${i + 1}:`, chunkError);
        throw chunkError;
      }
    }

    const writeTxHash = chunkTxHash; // Use last chunk's hash as the writeTxHash
    console.log(
      `Wrote entire program data: https://explorer.solana.com/tx/${writeTxHash}?cluster=devnet`
    );

    // 3. Finalize the program
    const finalizeTransaction = new Transaction();
    finalizeTransaction.feePayer = payerPublicKey;
    finalizeTransaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    // BpfLoader.finalize 方法不存在，需要创建自定义指令
    const finalizeData = Buffer.alloc(4);
    finalizeData.writeUInt32LE(1, 0); // 写入指令 (1 = Finalize)

    finalizeTransaction.add(
      new TransactionInstruction({
        keys: [
          {
            pubkey: programKeypair.publicKey,
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: new PublicKey(
              "SysvarRent111111111111111111111111111111111"
            ),
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: LOADER_V4_PROGRAM_ID,
        data: finalizeData,
      })
    );

    // Sign with program keypair since it's a required signer
    let finalizeTxHash;
    try {
      console.log("Signing finalize transaction...");
      finalizeTransaction.partialSign(programKeypair);
      console.log("Finalize transaction signed successfully");

      finalizeTxHash = await sendAndConfirmTransaction(
        connection,
        finalizeTransaction,
        [] // Empty array since Fireblocks will handle the payer signature
      );
    } catch (finalizeSignError) {
      console.error("Error signing finalize transaction:", finalizeSignError);
      throw finalizeSignError;
    }

    console.log(
      `Program finalized: https://explorer.solana.com/tx/${finalizeTxHash}?cluster=devnet`
    );
    console.log("Program deployment completed successfully!");
    console.log(`Program ID: ${programKeypair.publicKey.toBase58()}`);
    console.log(
      `Verify your program at: https://explorer.solana.com/address/${programKeypair.publicKey.toBase58()}?cluster=devnet`
    );
  } catch (error) {
    console.error("Error deploying program:", error);
  }
}

deployProgram();
