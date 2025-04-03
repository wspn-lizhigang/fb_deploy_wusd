# Solana Web3.js Fireblocks Provider

一个与Fireblocks兼容的Solana Web3.js提供程序，支持代币铸造和程序部署等功能。

## 功能特点

- 与Fireblocks完全集成的Solana Web3.js提供程序
- 支持代币铸造和程序部署
- 高度可配置的连接适配器
- 内置的交易状态轮询和重试机制
- 支持devnet和mainnet环境

## 安装

```bash
npm install -g typescript ts-node
npm install
```

## 配置

在使用之前，需要设置以下环境变量：

```env
FIREBLOCKS_API_KEY=your_api_key
FIREBLOCKS_SECRET_KEY_PATH=path_to_your_secret_key
FIREBLOCKS_VAULT_ACCOUNT_ID=your_vault_account_id
```

## 使用示例

### 初始化连接

```typescript
import { FireblocksConnectionAdapter, FireblocksConnectionAdapterConfig, FeeLevel } from 'solana_fireblocks_web3_provider';
import { clusterApiUrl } from '@solana/web3.js';

const config: FireblocksConnectionAdapterConfig = {
  apiKey: process.env.FIREBLOCKS_API_KEY,
  apiSecretPath: process.env.FIREBLOCKS_SECRET_KEY_PATH,
  vaultAccountId: process.env.FIREBLOCKS_VAULT_ACCOUNT_ID,
  feeLevel: FeeLevel.HIGH,
  silent: false,
  devnet: true
};

const connection = await FireblocksConnectionAdapter.create(
  clusterApiUrl('devnet'),
  config
);
```
### 部署程序

可以使用以下命令部署Solana程序：

```bash
yarn deploy
```

### 铸造代币

项目提供了一个完整的代币铸造脚本，可以通过以下命令运行：

```bash
yarn mint
```

这将：
- 创建一个新的代币铸造账户
- 初始化代币铸造
- 创建代币账户
- 铸造指定数量的代币

## API参考

### FireblocksConnectionAdapter

主要的连接适配器类，提供以下配置选项：

- `apiKey`: Fireblocks API密钥
- `apiSecretPath`: Fireblocks密钥文件路径
- `vaultAccountId`: Fireblocks保管库账户ID
- `feeLevel`: 交易费用级别（LOW/MEDIUM/HIGH）
- `silent`: 是否禁用日志输出
- `devnet`: 是否使用devnet环境

### 辅助函数

- `waitForSignature`: 等待交易签名完成，包含自动重试机制

## 注意事项

- 确保Fireblocks API密钥具有足够的权限
- 在mainnet环境中使用时，建议先在devnet上进行测试
- 保管好密钥文件，不要将其提交到版本控制系统
