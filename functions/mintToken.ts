import { 
  Keypair, 
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  clusterApiUrl,
  SystemProgram,
} from "@solana/web3.js";
import {
  FireblocksConnectionAdapter,
  FireblocksConnectionAdapterConfig,
  FeeLevel,
} from "../fireblocks/index";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";
import fs from "fs";

require("dotenv").config();

async function mintToken() {
  console.log("Starting Solana token minting process...");
  console.log("apiKey:", process.env.FIREBLOCKS_API_KEY);
  console.log("apiSecretPath:", process.env.FIREBLOCKS_SECRET_KEY_PATH);
  console.log("vaultAccountId:", process.env.FIREBLOCKS_VAULT_ACCOUNT_ID);

  // Configure Fireblocks connection
  const fireblocksConnectionConfig: FireblocksConnectionAdapterConfig = {
    apiKey: process.env.FIREBLOCKS_API_KEY || "",
    apiSecretPath: process.env.FIREBLOCKS_SECRET_KEY_PATH || "",
    vaultAccountId: process.env.FIREBLOCKS_VAULT_ACCOUNT_ID || "",
    feeLevel: FeeLevel.HIGH, // Use high fee level for minting transactions
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
  console.log("Payer account:", payerPublicKey.toBase58());

  // Set transaction note
  connection.setTxNote(
    "Minting Solana token with Fireblocks Connection Adapter"
  );

  try {
    // Create a new keypair for the mint account
    const mintKeypair = Keypair.generate();
    console.log("Mint account:", mintKeypair.publicKey.toBase58());

    // Calculate the rent for the mint account
    const mintRent = await getMinimumBalanceForRentExemptMint(
      connection
    );

    // Create a transaction to create the mint account
    const createMintAccountTransaction = new Transaction();
    createMintAccountTransaction.feePayer = payerPublicKey;
    createMintAccountTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    
    // Add instruction to create the mint account
    createMintAccountTransaction.add(
      SystemProgram.createAccount({
        fromPubkey: payerPublicKey,
        newAccountPubkey: mintKeypair.publicKey,
        lamports: mintRent,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      })
    );

    // Sign with the mint keypair
    createMintAccountTransaction.partialSign(mintKeypair);

    // Send and confirm the transaction
    const createMintAccountTxHash = await sendAndConfirmTransaction(
      connection,
      createMintAccountTransaction,
      [] // Empty array since Fireblocks will handle the payer signature
    );

    console.log(
      `Mint account created: https://explorer.solana.com/tx/${createMintAccountTxHash}?cluster=devnet`
    );

    // Initialize the mint
    const decimals = 9; // Standard for most tokens

    // Create a transaction to initialize the mint
    const initializeMintTransaction = new Transaction();
    initializeMintTransaction.feePayer = payerPublicKey;
    initializeMintTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    // Add instruction to initialize the mint
    const initMintInstruction = await createMint(
      connection,
      null, // We'll sign with Fireblocks
      mintKeypair.publicKey,
      payerPublicKey, // Mint authority
      null, // Freeze authority (optional) - null instead of PublicKey
      decimals,
      mintKeypair, // Provide the keypair
      { commitment: 'confirmed' }
    );

    console.log(
      `Mint initialized: https://explorer.solana.com/address/${mintKeypair.publicKey.toBase58()}?cluster=devnet`
    );

    // Create a token account for the payer
    console.log("Creating token account for the payer...");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      null, // We'll sign with Fireblocks
      mintKeypair.publicKey,
      payerPublicKey,
      false,
      'confirmed'
    );

    console.log(
      `Token account created: https://explorer.solana.com/address/${tokenAccount.address.toBase58()}?cluster=devnet`
    );

    // Mint tokens to the payer's token account
    const tokenAmount = 1000000000; // 1 billion tokens (with decimals)
    console.log(`Minting ${tokenAmount / Math.pow(10, decimals)} tokens to ${tokenAccount.address.toBase58()}...`);

    // Create a transaction to mint tokens
    const mintTransaction = new Transaction();
    mintTransaction.feePayer = payerPublicKey;
    mintTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    // Add instruction to mint tokens
    await mintTo(
      connection,
      null, // We'll sign with Fireblocks
      mintKeypair.publicKey,
      tokenAccount.address,
      payerPublicKey, // Mint authority
      tokenAmount,
      [],
      { commitment: 'confirmed' }
    );

    console.log("Token minting completed successfully!");
    console.log(`Mint address: ${mintKeypair.publicKey.toBase58()}`);
    console.log(`Token account: ${tokenAccount.address.toBase58()}`);
    console.log(
      `View on Solana Explorer: https://explorer.solana.com/address/${mintKeypair.publicKey.toBase58()}?cluster=devnet`
    );

    // Save mint keypair to file for future use
    const keypairFile = {
      publicKey: mintKeypair.publicKey.toBase58(),
      secretKey: Array.from(mintKeypair.secretKey),
    };

    const outputDir = "./deployfile";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      `${outputDir}/mint-keypair.json`,
      JSON.stringify(keypairFile)
    );
    console.log(`Mint keypair saved to ${outputDir}/mint-keypair.json`);

  } catch (error) {
    console.error("Error minting token:", error);
  }
}

mintToken();