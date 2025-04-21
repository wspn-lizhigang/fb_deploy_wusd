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

require("dotenv").config();

const InitContract = async () => {
  console.log("Starting contract initialization...");
  // 设置程序ID
  const programId = new PublicKey(process.env.WUSD_PROGRAM_ID || "");

  // 配置Fireblocks连接
  const fireblocksConnectionConfig: FireblocksConnectionAdapterConfig = {
    apiKey: process.env.FIREBLOCKS_API_KEY || "",
    apiSecretPath: process.env.FIREBLOCKS_SECRET_KEY_PATH || "",
    vaultAccountId: process.env.ADMIN_VAULT_ACCOUNT_ID || "",
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
  const minterPublicKey = new PublicKey(process.env.WUSD_MINTER_ADDRESS || "");
  const pauserPublicKey = new PublicKey(process.env.WUSD_PAUSER_ADDRESS || "");
  console.log("Minter account:", minterPublicKey.toBase58());
  console.log("Pauser account:", pauserPublicKey.toBase58());

  // 创建代币铸造密钥对
  // 从环境变量或文件中加载tokenMint的密钥对
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
  const authorityState = PublicKey.findProgramAddressSync(
    [Buffer.from("authority"), tokenMint.toBuffer()],
    programId
  )[0];

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
    [Buffer.from("freeze_state"), tokenMint.toBuffer()],
    programId
  )[0];

  console.log("Authority state:", authorityState.toBase58());
  console.log("Mint state:", mintState.toBase58());
  console.log("Pause state:", pauseState.toBase58());
  console.log("Freeze state:", freezeState.toBase58());

  // 设置代币小数位数
  const decimals = 6;

  // 创建初始化指令
  const initializeIx = new TransactionInstruction({
    keys: [
      { pubkey: admin, isSigner: true, isWritable: true },
      { pubkey: minterPublicKey, isSigner: false, isWritable: false },
      { pubkey: pauserPublicKey, isSigner: false, isWritable: false },
      { pubkey: tokenMint, isSigner: true, isWritable: true },
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

  // 部分签名（由tokenMint密钥对签名）
  transaction.partialSign(tokenMintKeypair);

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
    
    // 初始化freezeState账户
    console.log("Initializing freeze state...");
    
    // 创建一个假的recipientTokenAccount，因为在示例代码中需要这个账户
    // 在实际使用中，这应该是一个真实的代币账户
    const recipientTokenAccount = Keypair.generate().publicKey;
    
    // 创建初始化freezeState的指令
    const initializeFreezeStateIx = new TransactionInstruction({
      keys: [
        { pubkey: admin, isSigner: true, isWritable: true },
        { pubkey: authorityState, isSigner: false, isWritable: false },
        { pubkey: tokenMint, isSigner: false, isWritable: false },
        { pubkey: freezeState, isSigner: false, isWritable: true },
        { pubkey: recipientTokenAccount, isSigner: false, isWritable: false },
        { pubkey: admin, isSigner: true, isWritable: true }, // payer
        { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: programId,
      data: Buffer.from(Uint8Array.of(1)) // 1表示initializeFreezeState指令
    });
    
    // 创建新的交易
    const freezeTransaction = new Transaction();
    freezeTransaction.add(initializeFreezeStateIx);
    freezeTransaction.feePayer = admin;
    freezeTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    
    // 发送并确认交易
    console.log("Sending initializeFreezeState transaction...");
    const freezeSignature = await sendAndConfirmTransaction(
      connection,
      freezeTransaction,
      [] // Fireblocks已经处理admin的签名，不需要额外的签名者
    );
    
    console.log("Freeze state initialized successfully!");
    console.log(
      `Transaction: https://explorer.solana.com/tx/${freezeSignature}?cluster=devnet`
    );
    
    return signature;
  } catch (error) {
    console.error("Error initializing contract:", error);
    throw error;
  }
};

InitContract();
