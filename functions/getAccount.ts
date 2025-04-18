import {
  clusterApiUrl,
  PublicKey, 
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID, 
} from "@solana/spl-token";
import {
  FireblocksConnectionAdapter,
  FireblocksConnectionAdapterConfig,
  FeeLevel,
} from "../fireblocks/index";

require("dotenv").config();
const getAccount = async () => {
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
  const sourcePublicKey = new PublicKey(connection.getAccount());
  const tokenAccounts = await connection.getTokenAccountsByOwner(
    sourcePublicKey,
    { programId: TOKEN_PROGRAM_ID }
  );

  console.log(`Found ${tokenAccounts.value.length} token accounts`);
  for (let i = 0; i < tokenAccounts.value.length; i++) {
    const tokenAccount = tokenAccounts.value[i];
    const tokenAccountPubkey = tokenAccount.pubkey;
    console.log(
      `For token account ${i + 1}/${tokenAccounts.value.length}: ${tokenAccountPubkey.toString()}`
    );
  }
};
getAccount();
