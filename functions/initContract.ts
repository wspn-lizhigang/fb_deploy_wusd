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
import {
  FireblocksConnectionAdapter,
  FireblocksConnectionAdapterConfig,
  FeeLevel,
} from "../fireblocks/index";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import * as fs from "fs";

require("dotenv").config();

const InitContract = async () => {
  console.log("Starting contract initialization...");

  // 设置程序ID
  const programId = new PublicKey(
    "DcwqLAaLEzgRvpQB62XSr9e4pWvvnBJQjeBenBGNVHPP"
  );

  // 配置Fireblocks连接
  const fireblocksConnectionConfig: FireblocksConnectionAdapterConfig = {
    apiKey: process.env.FIREBLOCKS_API_KEY || "",
    apiSecretPath: process.env.FIREBLOCKS_SECRET_KEY_PATH || "",
    vaultAccountId: process.env.FIREBLOCKS_VAULT_ACCOUNT_ID || "",
    feeLevel: FeeLevel.HIGH, // 使用高费用级别进行部署交易
    silent: false,
    devnet: true, // 设置为true表示devnet，false表示mainnet
  };

  // 创建到Solana devnet的连接
  const connection = await FireblocksConnectionAdapter.create(
    clusterApiUrl("devnet"),
    fireblocksConnectionConfig
  );

  // 获取Fireblocks钱包的公钥作为管理员
  const admin = new PublicKey(connection.getAccount());
  console.log("Admin account:", admin.toBase58());

  // 创建铸币者和暂停者的密钥对
  const minter = "412raCGpo1GHe9YK9qdHgAC6Pktj7DtYMhrCrSry4MrU";
  const pauser = "7R8xfz2YiYBdwwjyEF166jZUU4fXj1D9BoqoPwDSiUtu";
  const minterPublicKey = new PublicKey(minter);
  const pauserPublicKey = new PublicKey(pauser);
  console.log("Minter account:", minterPublicKey.toBase58());
  console.log("Pauser account:", pauserPublicKey.toBase58());

  // 创建代币铸造密钥对
  const tokenMint = Keypair.generate();
  console.log("Token mint:", tokenMint.publicKey.toBase58());

  // 计算PDA地址
  const authorityState = PublicKey.findProgramAddressSync(
    [Buffer.from("authority"), admin.toBuffer()],
    programId
  )[0];

  const mintState = PublicKey.findProgramAddressSync(
    [Buffer.from("mint_state"), tokenMint.publicKey.toBuffer()],
    programId
  )[0];

  const pauseState = PublicKey.findProgramAddressSync(
    [Buffer.from("pause_state"), pauserPublicKey.toBuffer()],
    programId
  )[0];

  console.log("Authority state:", authorityState.toBase58());
  console.log("Mint state:", mintState.toBase58());
  console.log("Pause state:", pauseState.toBase58());

  // 设置代币小数位数
  const decimals = 6;

  // 创建初始化指令
  const initializeIx = new TransactionInstruction({
    keys: [
      { pubkey: admin, isSigner: true, isWritable: true },
      { pubkey: minterPublicKey, isSigner: false, isWritable: false },
      { pubkey: pauserPublicKey, isSigner: false, isWritable: false },
      { pubkey: tokenMint.publicKey, isSigner: true, isWritable: true },
      { pubkey: authorityState, isSigner: false, isWritable: true },
      { pubkey: mintState, isSigner: false, isWritable: true },
      { pubkey: pauseState, isSigner: false, isWritable: true },
      { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      {
        pubkey: new PublicKey("SysvarRent111111111111111111111111111111111"),
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: programId,
    data: Buffer.from(
      Uint8Array.of(0, ...new Uint8Array(new Uint32Array([decimals]).buffer))
    ), // 0表示initialize指令，后面跟着decimals参数
  });

  // 创建交易
  const transaction = new Transaction();
  transaction.add(initializeIx);
  transaction.feePayer = admin;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  // 部分签名（由tokenMint签名）
  transaction.partialSign(tokenMint);

  try {
    // 发送并确认交易
    console.log("Sending initialize transaction...");
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [] // Fireblocks已经处理admin的签名，不需要额外的签名者
    );

    console.log("Contract initialized successfully!");
    console.log(
      `Transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
    return signature;
  } catch (error) {
    console.error("Error initializing contract:", error);
    throw error;
  }
};

InitContract();
