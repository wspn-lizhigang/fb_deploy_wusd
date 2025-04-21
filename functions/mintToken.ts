import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  FireblocksConnectionAdapter,
  FireblocksConnectionAdapterConfig,
  FeeLevel,
} from "../fireblocks/index";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";

require("dotenv").config();

const mintToken = async () => {
  const amount = new BN(10000000000000); // 10000000 WUSD (考虑到6位小数)
  const recipientTokenAccount = new PublicKey(
    process.env.WUSD_RECIPIENT_ADDRESS || ""
  );
  console.log("Starting token minting process...");
  // 设置程序ID
  const programId = new PublicKey(process.env.WUSD_PROGRAM_ID || "");

  // 配置Fireblocks连接
  const fireblocksConnectionConfig: FireblocksConnectionAdapterConfig = {
    apiKey: process.env.FIREBLOCKS_API_KEY || "",
    apiSecretPath: process.env.FIREBLOCKS_SECRET_KEY_PATH || "",
    vaultAccountId: process.env.MINTER_VAULT_ACCOUNT_ID || "",
    feeLevel: FeeLevel.HIGH, // 使用高费用级别进行铸币交易
    silent: false,
    devnet: true, // 设置为true表示devnet，false表示mainnet
  };

  // 创建到Solana devnet的连接
  const connection = await FireblocksConnectionAdapter.create(
    clusterApiUrl("devnet"),
    fireblocksConnectionConfig
  );

  // 获取铸币者的公钥
  const minter = new PublicKey(connection.getAccount());
  console.log("Minter account:", minter.toBase58());
  console.log("Recipient token account:", recipientTokenAccount.toBase58());

  // 获取代币铸造账户
  // 注意：需要从文件中加载密钥对，而不是仅使用公钥
  let tokenMintKeypair;
  try {
    // 尝试从文件中加载密钥对
    const keypairFile = process.env.WUSD_TOKENMINT_KEYPAIR_PATH || "";
    if (keypairFile) {
      const keypairData = require('fs').readFileSync(keypairFile, 'utf8');
      tokenMintKeypair = Keypair.fromSecretKey(
        Buffer.from(JSON.parse(keypairData))
      );
    } else {
      throw new Error("No keypair file path provided");
    }
  } catch (error) {
    console.error("Failed to load tokenMint keypair:", error);
    throw error;
  }
  
  const tokenMint = tokenMintKeypair.publicKey; 
  console.log("Token mint:", tokenMint.toBase58());

  // 计算PDA地址
  const [authorityState, authorityBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("authority"), tokenMint.toBuffer()],
    programId
  );

  const mintState = PublicKey.findProgramAddressSync(
    [Buffer.from("mint_state"), tokenMint.toBuffer()],
    programId
  )[0];

  const pauseState = PublicKey.findProgramAddressSync(
    [Buffer.from("pause_state"), tokenMint.toBuffer()],
    programId
  )[0];

  // 计算freezeState的PDA地址
  const freezeState = PublicKey.findProgramAddressSync(
    [
      Buffer.from("freeze"),
      recipientTokenAccount.toBuffer(),
      tokenMint.toBuffer(),
    ],
    programId
  )[0];

  console.log("Authority state:", authorityState.toBase58());
  console.log("Mint state:", mintState.toBase58());
  console.log("Pause state:", pauseState.toBase58());
  console.log("Freeze state:", freezeState.toBase58());

  // 设置代币小数位数
  const decimals = 6;

  // 显示铸币金额
  console.log(
    "Attempting to mint",
    amount.div(new BN(10 ** decimals)).toString(),
    "WUSD"
  );

  // 创建铸币指令
  const mintIx = new TransactionInstruction({
    keys: [
      { pubkey: minter, isSigner: true, isWritable: true },
      { pubkey: tokenMint, isSigner: false, isWritable: true },
      { pubkey: recipientTokenAccount, isSigner: false, isWritable: true },
      { pubkey: authorityState, isSigner: false, isWritable: false },
      { pubkey: mintState, isSigner: false, isWritable: true },
      { pubkey: pauseState, isSigner: false, isWritable: false },
      { pubkey: freezeState, isSigner: false, isWritable: false },
      { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data: Buffer.from([
      2, // 2表示mint指令
      ...new BN(amount).toArray("le", 8), // 铸币金额
      authorityBump, // authority bump
    ]),
  });

  // 创建交易
  const transaction = new Transaction();
  transaction.add(mintIx);
  transaction.feePayer = minter;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  try {
    // 发送并确认交易
    console.log("Sending mint transaction...");
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [] // Fireblocks已经处理minter的签名，不需要额外的签名者
    );

    console.log("Tokens minted successfully!");
    console.log(
      `Transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );

    return signature;
  } catch (error) {
    console.error("Error minting tokens:", error);
    throw error;
  }
};

mintToken();
