import { PublicKey, Transaction, VersionedTransaction, TransactionMessage, clusterApiUrl } from '@solana/web3.js'
import {
  Liquidity,
  LiquidityPoolKeys,
  jsonInfo2PoolKeys,
  LiquidityPoolJsonInfo,
  TokenAccount,
  Token,
  TokenAmount,
  TOKEN_PROGRAM_ID,
  Percent,
  SPL_ACCOUNT_LAYOUT,
} from '@raydium-io/raydium-sdk'
import { FireblocksConnectionAdapter } from '../../src'
import fs from 'fs';
import path from 'path';
require("dotenv").config();


/**
 * Class representing a Raydium Swap operation.
 */
class RaydiumSwap {

  allPoolKeysJson: LiquidityPoolJsonInfo[]
  connection: FireblocksConnectionAdapter
  publicKey: PublicKey

  private constructor(connection: FireblocksConnectionAdapter) {
    this.connection = connection;
    this.publicKey = new PublicKey(this.connection.getAccount());
  }

  static async create(RPC_URL?: string) {
    const connection = await FireblocksConnectionAdapter.create(
      RPC_URL || clusterApiUrl("mainnet-beta"),
      {
        apiKey: process.env.FIREBLOCKS_API_KEY,
        apiSecretPath: process.env.FIREBLOCKS_SECRET_KEY_PATH,
        vaultAccountId: process.env.FIREBLOCKS_VAULT_ACCOUNT_ID,
      }
    );
    return new RaydiumSwap(connection);
  }

  /**
  * Loads all the pool keys available from a JSON configuration file.
  * @async
  * @returns {Promise<void>}
  */
  async loadPoolKeys(liquidityFile: string) {
    let liquidityJson;
    if (liquidityFile.startsWith('http')) {
      const liquidityJsonResp = await fetch(liquidityFile);
      if (!liquidityJsonResp.ok) return;
      liquidityJson = await liquidityJsonResp.json();
    } else {
      liquidityJson = JSON.parse(fs.readFileSync(path.join(__dirname, liquidityFile), 'utf-8'));
    }
    const allPoolKeysJson = [...(liquidityJson?.official ?? []), ...(liquidityJson?.unOfficial ?? [])]

    this.allPoolKeysJson = allPoolKeysJson
  }

  /**
 * Finds pool information for the given token pair.
 * @param {string} mintA - The mint address of the first token.
 * @param {string} mintB - The mint address of the second token.
 * @returns {LiquidityPoolKeys | null} The liquidity pool keys if found, otherwise null.
 */
  findPoolInfoForTokens(mintA: string, mintB: string) {
    const poolData = this.allPoolKeysJson.find(
      (i) => (i.baseMint === mintA && i.quoteMint === mintB) || (i.baseMint === mintB && i.quoteMint === mintA)
    )

    if (!poolData) return null

    return jsonInfo2PoolKeys(poolData) as LiquidityPoolKeys
  }

  /**
 * Retrieves token accounts owned by the wallet.
 * @async
 * @returns {Promise<TokenAccount[]>} An array of token accounts.
 */
  async getOwnerTokenAccounts() {
    const walletTokenAccount = await this.connection.getTokenAccountsByOwner(this.publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })

    return walletTokenAccount.value.map((i) => ({
      pubkey: i.pubkey,
      programId: i.account.owner,
      accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
    }))
  }

  /**
 * Builds a swap transaction.
 * @async
 * @param {string} toToken - The mint address of the token to receive.
 * @param {number} amount - The amount of the token to swap.
 * @param {LiquidityPoolKeys} poolKeys - The liquidity pool keys.
 * @param {number} [maxLamports=100000] - The maximum lamports to use for transaction fees.
 * @param {boolean} [useVersionedTransaction=true] - Whether to use a versioned transaction.
 * @param {'in' | 'out'} [fixedSide='in'] - The fixed side of the swap ('in' or 'out').
 * @returns {Promise<Transaction | VersionedTransaction>} The constructed swap transaction.
 */
  async getSwapTransaction(
    toToken: string,
    amount: number,
    poolKeys: LiquidityPoolKeys,
    maxLamports: number = 100000,
    useVersionedTransaction = false,
    fixedSide: 'in' | 'out' = 'in'
  ): Promise<Transaction | VersionedTransaction> {
    const directionIn = poolKeys.quoteMint.toString() == toToken
    const { minAmountOut, amountIn } = await this.calcAmountOut(poolKeys, amount, directionIn)

    // Use the original TokenAmount objects, not the stringified versions
    const userTokenAccounts = await this.getOwnerTokenAccounts()

    console.log("Creating swap transaction with the following user token accounts: ", userTokenAccounts)
    const swapTransaction = await Liquidity.makeSwapInstructionSimple({
      connection: this.connection,
      makeTxVersion: useVersionedTransaction ? 0 : 1,
      poolKeys: {
        ...poolKeys,
      },
      userKeys: {
        tokenAccounts: userTokenAccounts,
        owner: this.publicKey,
      },
      amountIn: amountIn,
      amountOut: minAmountOut,
      fixedSide: fixedSide,
      config: {
        bypassAssociatedCheck: false,
      },
      computeBudgetConfig: {
        microLamports: maxLamports,
      },
    })

    const recentBlockhashForSwap = await this.connection.getLatestBlockhash()
    const instructions = swapTransaction.innerTransactions[0].instructions.filter(Boolean)

    if (useVersionedTransaction) {
      const versionedTransaction = new VersionedTransaction(
        new TransactionMessage({
          payerKey: new PublicKey(this.publicKey),
          recentBlockhash: recentBlockhashForSwap.blockhash,
          instructions: instructions,
        }).compileToV0Message()
      )

      return versionedTransaction;
    }

    const legacyTransaction = new Transaction({
      blockhash: recentBlockhashForSwap.blockhash,
      lastValidBlockHeight: recentBlockhashForSwap.lastValidBlockHeight,
      feePayer: this.publicKey,
    })

    legacyTransaction.add(...instructions)

    return legacyTransaction
  }

  /**
 * Sends a legacy transaction.
 * @async
 * @param {Transaction} tx - The transaction to send.
 * @returns {Promise<string>} The transaction ID.
 */
  async sendLegacyTransaction(tx: Transaction, maxRetries?: number) {
    const txid = await this.connection.sendTransaction(tx, [], {
      skipPreflight: true,
      maxRetries: maxRetries,
    })

    return txid
  }

  /**
 * Sends a versioned transaction.
 * @async
 * @param {VersionedTransaction} tx - The versioned transaction to send.
 * @returns {Promise<string>} The transaction ID.
 */
  async sendVersionedTransaction(tx: VersionedTransaction, maxRetries?: number) {
    const txid = await this.connection.sendTransaction(tx, {
      skipPreflight: true,
      maxRetries: maxRetries,
    })

    return txid
  }

  //  /**
  //    * Simulates a versioned transaction.
  //    * @async
  //    * @param {VersionedTransaction} tx - The versioned transaction to simulate.
  //    * @returns {Promise<any>} The simulation result.
  //    */
  //   async simulateLegacyTransaction(tx: Transaction) {
  //     const txid = await this.connection.simulateTransaction(tx, [this.wallet.payer])

  //     return txid
  //   }

  //     /**
  //    * Simulates a versioned transaction.
  //    * @async
  //    * @param {VersionedTransaction} tx - The versioned transaction to simulate.
  //    * @returns {Promise<any>} The simulation result.
  //    */
  //   async simulateVersionedTransaction(tx: VersionedTransaction) {
  //     const txid = await this.connection.simulateTransaction(tx)

  //     return txid
  //   }

  /**
 * Gets a token account by owner and mint address.
 * @param {PublicKey} mint - The mint address of the token.
 * @returns {TokenAccount} The token account.
 */
  getTokenAccountByOwnerAndMint(mint: PublicKey) {
    return {
      programId: TOKEN_PROGRAM_ID,
      pubkey: PublicKey.default,
      accountInfo: {
        mint: mint,
        amount: 0,
      },
    } as unknown as TokenAccount
  }

  /**
 * Calculates the amount out for a swap.
 * @async
 * @param {LiquidityPoolKeys} poolKeys - The liquidity pool keys.
 * @param {number} rawAmountIn - The raw amount of the input token.
 * @param {boolean} swapInDirection - The direction of the swap (true for in, false for out).
 * @returns {Promise<Object>} The swap calculation result.
 */
  async calcAmountOut(poolKeys: LiquidityPoolKeys, rawAmountIn: number, swapInDirection: boolean) {
    const poolInfo = await Liquidity.fetchInfo({ connection: this.connection, poolKeys })

    let currencyInMint = poolKeys.baseMint
    let currencyInDecimals = poolInfo.baseDecimals
    let currencyOutMint = poolKeys.quoteMint
    let currencyOutDecimals = poolInfo.quoteDecimals

    if (!swapInDirection) {
      currencyInMint = poolKeys.quoteMint
      currencyInDecimals = poolInfo.quoteDecimals
      currencyOutMint = poolKeys.baseMint
      currencyOutDecimals = poolInfo.baseDecimals
    }

    const currencyIn = new Token(TOKEN_PROGRAM_ID, currencyInMint, currencyInDecimals)
    const amountIn = new TokenAmount(currencyIn, rawAmountIn, false)
    const currencyOut = new Token(TOKEN_PROGRAM_ID, currencyOutMint, currencyOutDecimals)
    const slippage = new Percent(5, 100) // 5% slippage

    const { amountOut, minAmountOut, currentPrice, executionPrice, priceImpact, fee } = Liquidity.computeAmountOut({
      poolKeys,
      poolInfo,
      amountIn,
      currencyOut,
      slippage,
    })

    return {
      amountIn,
      amountOut,
      minAmountOut,
      currentPrice,
      executionPrice,
      priceImpact,
      fee,
    }
  }
}

export default RaydiumSwap
