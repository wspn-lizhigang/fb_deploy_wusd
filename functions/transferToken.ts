import {
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  clusterApiUrl,
  TransactionInstruction,
  Keypair,
} from "@solana/web3.js";
import {
  FireblocksConnectionAdapter,
  FireblocksConnectionAdapterConfig,
  FeeLevel,
} from "../fireblocks/index";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import BN from "bn.js";

require("dotenv").config();

const transferToken = async () => {
  const amount = new BN(1000000000); // 1000 WUSD (考虑到6位小数)
  console.log("开始代币转账流程...");

  // 设置程序ID
  const programId = new PublicKey(process.env.WUSD_PROGRAM_ID || "");

  // 配置Fireblocks连接
  const fireblocksConnectionConfig: FireblocksConnectionAdapterConfig = {
    apiKey: process.env.FIREBLOCKS_API_KEY || "",
    apiSecretPath: process.env.FIREBLOCKS_SECRET_KEY_PATH || "",
    vaultAccountId: process.env.RECIPIENT_VAULT_ACCOUNT_ID || "", // 使用管理员账户作为发送方
    feeLevel: FeeLevel.HIGH, // 使用高费用级别进行转账交易
    silent: false,
    devnet: true, // 设置为true表示devnet，false表示mainnet
  };

  // 创建到Solana devnet的连接
  const connection = await FireblocksConnectionAdapter.create(
    clusterApiUrl("devnet"),
    fireblocksConnectionConfig
  );

  // 获取发送方的公钥
  const from = new PublicKey(connection.getAccount());
  console.log("发送方账户:", from.toBase58());

  // 获取接收方的公钥
  const to = new PublicKey(process.env.WUSD_MINTER_ADDRESS || "");
  console.log("接收方账户:", to.toBase58());

  // 获取代币铸造账户
  let tokenMintKeypair;
  try {
    // 尝试从文件中加载密钥对
    const keypairFile = process.env.WUSD_TOKENMINT_KEYPAIR_PATH || "";
    if (keypairFile) {
      const keypairData = require("fs").readFileSync(keypairFile, "utf8");
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
  console.log("代币铸造账户:", tokenMint.toBase58()); 

  // 获取发送方的代币账户
  const fromToken = await getAssociatedTokenAddress(
    tokenMint, // 代币铸造账户
    from, // 所有者（发送方）
    true, // 允许所有者账户是PDA
    TOKEN_2022_PROGRAM_ID // 使用TOKEN_2022程序
  );
  console.log("发送方代币账户:", fromToken.toBase58());

  // 获取接收方的代币账户
  const toToken = await getAssociatedTokenAddress(
    tokenMint, // 代币铸造账户
    to, // 所有者（接收方）
    true, // 允许所有者账户是PDA
    TOKEN_2022_PROGRAM_ID // 使用TOKEN_2022程序
  );
  console.log("接收方代币账户:", toToken.toBase58());

  // 计算PDA地址
  const authorityState = PublicKey.findProgramAddressSync(
    [Buffer.from("authority"), tokenMint.toBuffer()],
    programId
  )[0];

  const pauseState = PublicKey.findProgramAddressSync(
    [Buffer.from("pause_state"), tokenMint.toBuffer()],
    programId
  )[0];

  // 计算fromFreezeState的PDA地址
  const fromFreezeState = PublicKey.findProgramAddressSync(
    [Buffer.from("freeze"), fromToken.toBuffer(), tokenMint.toBuffer()],
    programId
  )[0];

  // 计算toFreezeState的PDA地址
  const toFreezeState = PublicKey.findProgramAddressSync(
    [Buffer.from("freeze"), toToken.toBuffer(), tokenMint.toBuffer()],
    programId
  )[0];

  console.log("Authority state:", authorityState.toBase58());
  console.log("Pause state:", pauseState.toBase58());
  console.log("From Freeze state:", fromFreezeState.toBase58());
  console.log("To Freeze state:", toFreezeState.toBase58());

  // 设置代币小数位数
  const decimals = 6;

  // 显示转账金额
  console.log(
    "尝试转账",
    amount.div(new BN(10 ** decimals)).toString(),
    "WUSD"
  );

  // 创建转账指令
  const transferIx = new TransactionInstruction({
    keys: [
      { pubkey: from, isSigner: true, isWritable: false },
      { pubkey: to, isSigner: false, isWritable: false },
      { pubkey: fromToken, isSigner: false, isWritable: true },
      { pubkey: toToken, isSigner: false, isWritable: true },
      { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: tokenMint, isSigner: false, isWritable: false },
      { pubkey: authorityState, isSigner: false, isWritable: false },
      { pubkey: pauseState, isSigner: false, isWritable: false },
      { pubkey: fromFreezeState, isSigner: false, isWritable: false },
      { pubkey: toFreezeState, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data: Buffer.from([
      4, // 4表示transfer指令
      ...new BN(amount).toArray("le", 8), // 转账金额
    ]),
  });

  // 创建交易
  const transaction = new Transaction();
  transaction.add(transferIx);
  transaction.feePayer = from;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  try {
    // 发送并确认交易
    console.log("发送转账交易...");
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [] // Fireblocks已经处理发送方的签名，不需要额外的签名者
    );

    console.log("代币转账成功!");
    console.log(
      `交易: https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
    return signature;
  } catch (error) {
    console.error("转账代币时出错:", error);
    throw error;
  }
};

transferToken();
