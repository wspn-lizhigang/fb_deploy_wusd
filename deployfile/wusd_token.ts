export type WusdToken = {
  "version": "1.0.0",
  "name": "wusd_token",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "管理员账户"
          ]
        },
        {
          "name": "minter",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "铸币者账户"
          ]
        },
        {
          "name": "pauser",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "暂停者账户"
          ]
        },
        {
          "name": "authorityState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "权限管理账户"
          ]
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "代币铸币账户 - 使用已存在的账户"
          ]
        },
        {
          "name": "mintState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "铸币状态账户 - 极简化约束条件"
          ]
        },
        {
          "name": "pauseState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "暂停状态账户 - 极简化约束条件"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "decimals",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeFreezeState",
      "docs": [
        "初始化冻结状态账户"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "freezeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "transferAdmin",
      "docs": [
        "转移管理员权限"
      ],
      "accounts": [
        {
          "name": "currentAdmin",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "当前管理员，必须签名"
          ]
        },
        {
          "name": "authorityState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "权限管理状态账户"
          ]
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setRole",
      "docs": [
        "设置角色 (支持添加/移除)"
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "当前管理员，必须签名"
          ]
        },
        {
          "name": "authorityState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "权限管理状态账户"
          ]
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "roleType",
          "type": {
            "defined": "RoleType"
          }
        },
        {
          "name": "newRole",
          "type": "publicKey"
        },
        {
          "name": "isAdd",
          "type": "bool"
        }
      ]
    },
    {
      "name": "removeSelfRole",
      "docs": [
        "用户自行移除角色"
      ],
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "当前用户，必须签名"
          ]
        },
        {
          "name": "authorityState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "权限管理状态账户"
          ]
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "roleType",
          "type": {
            "defined": "RoleType"
          }
        }
      ]
    },
    {
      "name": "mint",
      "docs": [
        "铸造WUSD代币"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "freezeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "approve",
      "docs": [
        "处理代表津贴请求，允许代币持有者授权其他账户使用其代币"
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "delegate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "permitState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "expiryTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "transfer",
      "docs": [
        "转账WUSD代币"
      ],
      "accounts": [
        {
          "name": "from",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "to",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromFreezeState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "toFreezeState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferFrom",
      "docs": [
        "使用授权额度转账WUSD代币"
      ],
      "accounts": [
        {
          "name": "spender",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "permit",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromFreezeState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "toFreezeState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pause",
      "docs": [
        "暂停合约"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unpause",
      "docs": [
        "恢复合约"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "burn",
      "docs": [
        "销毁WUSD代币"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "freezeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "freezeAccount",
      "docs": [
        "冻结账户"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "freezeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unfreezeAccount",
      "docs": [
        "解冻账户"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "freezeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "allowanceState",
      "docs": [
        "授权额度状态账户，存储代币授权信息"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "docs": [
              "代币所有者地址"
            ],
            "type": "publicKey"
          },
          {
            "name": "spender",
            "docs": [
              "被授权者地址"
            ],
            "type": "publicKey"
          },
          {
            "name": "amount",
            "docs": [
              "授权额度"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "permitState",
      "docs": [
        "签名许可状态账户，用于EIP-2612兼容的签名授权"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "docs": [
              "所有者地址"
            ],
            "type": "publicKey"
          },
          {
            "name": "spender",
            "docs": [
              "被授权者地址"
            ],
            "type": "publicKey"
          },
          {
            "name": "nonce",
            "docs": [
              "随机数，用于防止重放攻击"
            ],
            "type": "u64"
          },
          {
            "name": "amount",
            "docs": [
              "授权额度"
            ],
            "type": "u64"
          },
          {
            "name": "expiration",
            "docs": [
              "过期时间"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "authorityState",
      "docs": [
        "权限管理状态账户，存储合约的权限配置"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "管理员地址"
            ],
            "type": "publicKey"
          },
          {
            "name": "minterRoles",
            "docs": [
              "铸币角色地址列表"
            ],
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "burnerRoles",
            "docs": [
              "销毁角色地址列表"
            ],
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "pauserRoles",
            "docs": [
              "暂停角色地址列表"
            ],
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "freezerRoles",
            "docs": [
              "冻结角色地址列表"
            ],
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "mintState",
      "docs": [
        "铸币状态账户，存储代币铸造相关信息"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "代币铸币账户地址"
            ],
            "type": "publicKey"
          },
          {
            "name": "decimals",
            "docs": [
              "代币精度"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "pauseState",
      "docs": [
        "暂停状态账户，用于控制合约的暂停/恢复"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paused",
            "docs": [
              "合约是否暂停"
            ],
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "freezeState",
      "docs": [
        "账户冻结状态，用于控制账户的冻结/解冻"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isFrozen",
            "docs": [
              "账户是否被冻结"
            ],
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "FreezeOperation",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Freeze"
          },
          {
            "name": "Unfreeze"
          }
        ]
      }
    },
    {
      "name": "RoleType",
      "docs": [
        "角色类型枚举"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Minter"
          },
          {
            "name": "Burner"
          },
          {
            "name": "Pauser"
          },
          {
            "name": "Freezer"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "BurnEvent",
      "fields": [
        {
          "name": "burner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "FreezeAccountEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "UnfreezeAccountEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "MintEvent",
      "fields": [
        {
          "name": "minter",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipient",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ContractPausedEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ContractUnpausedEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ApproveSetEvent",
      "fields": [
        {
          "name": "delegator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "delegate",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "authorityType",
          "type": "u8",
          "index": false
        }
      ]
    },
    {
      "name": "AdminTransferredEvent",
      "fields": [
        {
          "name": "previousAdmin",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "newAdmin",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "MinterRoleChangedEvent",
      "fields": [
        {
          "name": "minter",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "isAdd",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "PauserRoleChangedEvent",
      "fields": [
        {
          "name": "pauser",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "isAdd",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "FreezerRoleChangedEvent",
      "fields": [
        {
          "name": "freezer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "isAdd",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "BurnerRoleChangedEvent",
      "fields": [
        {
          "name": "burner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "isAdd",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "TransferEvent",
      "fields": [
        {
          "name": "from",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "to",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "fee",
          "type": "u64",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "hasMemo",
          "type": "bool",
          "index": false
        },
        {
          "name": "spender",
          "type": {
            "option": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "InitializeEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "decimals",
          "type": "u8",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ContractPaused",
      "msg": "Contract is paused"
    },
    {
      "code": 6001,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6002,
      "name": "PermitExpired",
      "msg": "Permit expired"
    },
    {
      "code": 6003,
      "name": "InvalidNonce",
      "msg": "Invalid nonce"
    },
    {
      "code": 6004,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    },
    {
      "code": 6005,
      "name": "NotPauser",
      "msg": "Not a pauser"
    },
    {
      "code": 6006,
      "name": "InsufficientBalance",
      "msg": "Insufficient balance"
    },
    {
      "code": 6007,
      "name": "TooManyOperators",
      "msg": "Too many operators"
    },
    {
      "code": 6008,
      "name": "OperatorNotFound",
      "msg": "Operator not found"
    },
    {
      "code": 6009,
      "name": "AccessDenied",
      "msg": "Access denied"
    },
    {
      "code": 6010,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6011,
      "name": "AccessRegistryNotInitialized",
      "msg": "Access registry not initialized"
    },
    {
      "code": 6012,
      "name": "InvalidOwner",
      "msg": "Invalid owner"
    },
    {
      "code": 6013,
      "name": "InsufficientAllowance",
      "msg": "Insufficient allowance"
    },
    {
      "code": 6014,
      "name": "AccountFrozen",
      "msg": "Account is frozen"
    },
    {
      "code": 6015,
      "name": "AccountAlreadyFrozen",
      "msg": "Account is already frozen"
    },
    {
      "code": 6016,
      "name": "AccountNotFrozen",
      "msg": "Account is not frozen"
    },
    {
      "code": 6017,
      "name": "InvalidTransferFrom",
      "msg": "Invalid transfer from operation"
    },
    {
      "code": 6018,
      "name": "InvalidMint",
      "msg": "Invalid mint address"
    },
    {
      "code": 6019,
      "name": "ExpiredPermit",
      "msg": "Expired permit"
    },
    {
      "code": 6020,
      "name": "InvalidAddress",
      "msg": "Invalid address"
    },
    {
      "code": 6021,
      "name": "InvalidPermit",
      "msg": "Invalid permit"
    },
    {
      "code": 6022,
      "name": "InvalidSignature",
      "msg": "Invalid signature"
    }
  ]
};

export const IDL: WusdToken = {
  "version": "1.0.0",
  "name": "wusd_token",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "管理员账户"
          ]
        },
        {
          "name": "minter",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "铸币者账户"
          ]
        },
        {
          "name": "pauser",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "暂停者账户"
          ]
        },
        {
          "name": "authorityState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "权限管理账户"
          ]
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "代币铸币账户 - 使用已存在的账户"
          ]
        },
        {
          "name": "mintState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "铸币状态账户 - 极简化约束条件"
          ]
        },
        {
          "name": "pauseState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "暂停状态账户 - 极简化约束条件"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "decimals",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeFreezeState",
      "docs": [
        "初始化冻结状态账户"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "freezeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "transferAdmin",
      "docs": [
        "转移管理员权限"
      ],
      "accounts": [
        {
          "name": "currentAdmin",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "当前管理员，必须签名"
          ]
        },
        {
          "name": "authorityState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "权限管理状态账户"
          ]
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setRole",
      "docs": [
        "设置角色 (支持添加/移除)"
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "当前管理员，必须签名"
          ]
        },
        {
          "name": "authorityState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "权限管理状态账户"
          ]
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "roleType",
          "type": {
            "defined": "RoleType"
          }
        },
        {
          "name": "newRole",
          "type": "publicKey"
        },
        {
          "name": "isAdd",
          "type": "bool"
        }
      ]
    },
    {
      "name": "removeSelfRole",
      "docs": [
        "用户自行移除角色"
      ],
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "当前用户，必须签名"
          ]
        },
        {
          "name": "authorityState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "权限管理状态账户"
          ]
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "roleType",
          "type": {
            "defined": "RoleType"
          }
        }
      ]
    },
    {
      "name": "mint",
      "docs": [
        "铸造WUSD代币"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "freezeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "approve",
      "docs": [
        "处理代表津贴请求，允许代币持有者授权其他账户使用其代币"
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "delegate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "permitState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "expiryTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "transfer",
      "docs": [
        "转账WUSD代币"
      ],
      "accounts": [
        {
          "name": "from",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "to",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromFreezeState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "toFreezeState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferFrom",
      "docs": [
        "使用授权额度转账WUSD代币"
      ],
      "accounts": [
        {
          "name": "spender",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "permit",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromFreezeState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "toFreezeState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pause",
      "docs": [
        "暂停合约"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unpause",
      "docs": [
        "恢复合约"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "burn",
      "docs": [
        "销毁WUSD代币"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "freezeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "freezeAccount",
      "docs": [
        "冻结账户"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "freezeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unfreezeAccount",
      "docs": [
        "解冻账户"
      ],
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "freezeState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authorityState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pauseState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "allowanceState",
      "docs": [
        "授权额度状态账户，存储代币授权信息"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "docs": [
              "代币所有者地址"
            ],
            "type": "publicKey"
          },
          {
            "name": "spender",
            "docs": [
              "被授权者地址"
            ],
            "type": "publicKey"
          },
          {
            "name": "amount",
            "docs": [
              "授权额度"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "permitState",
      "docs": [
        "签名许可状态账户，用于EIP-2612兼容的签名授权"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "docs": [
              "所有者地址"
            ],
            "type": "publicKey"
          },
          {
            "name": "spender",
            "docs": [
              "被授权者地址"
            ],
            "type": "publicKey"
          },
          {
            "name": "nonce",
            "docs": [
              "随机数，用于防止重放攻击"
            ],
            "type": "u64"
          },
          {
            "name": "amount",
            "docs": [
              "授权额度"
            ],
            "type": "u64"
          },
          {
            "name": "expiration",
            "docs": [
              "过期时间"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "authorityState",
      "docs": [
        "权限管理状态账户，存储合约的权限配置"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "管理员地址"
            ],
            "type": "publicKey"
          },
          {
            "name": "minterRoles",
            "docs": [
              "铸币角色地址列表"
            ],
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "burnerRoles",
            "docs": [
              "销毁角色地址列表"
            ],
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "pauserRoles",
            "docs": [
              "暂停角色地址列表"
            ],
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "freezerRoles",
            "docs": [
              "冻结角色地址列表"
            ],
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "mintState",
      "docs": [
        "铸币状态账户，存储代币铸造相关信息"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "代币铸币账户地址"
            ],
            "type": "publicKey"
          },
          {
            "name": "decimals",
            "docs": [
              "代币精度"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "pauseState",
      "docs": [
        "暂停状态账户，用于控制合约的暂停/恢复"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paused",
            "docs": [
              "合约是否暂停"
            ],
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "freezeState",
      "docs": [
        "账户冻结状态，用于控制账户的冻结/解冻"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isFrozen",
            "docs": [
              "账户是否被冻结"
            ],
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "FreezeOperation",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Freeze"
          },
          {
            "name": "Unfreeze"
          }
        ]
      }
    },
    {
      "name": "RoleType",
      "docs": [
        "角色类型枚举"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Minter"
          },
          {
            "name": "Burner"
          },
          {
            "name": "Pauser"
          },
          {
            "name": "Freezer"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "BurnEvent",
      "fields": [
        {
          "name": "burner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "FreezeAccountEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "UnfreezeAccountEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "MintEvent",
      "fields": [
        {
          "name": "minter",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "recipient",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ContractPausedEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ContractUnpausedEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ApproveSetEvent",
      "fields": [
        {
          "name": "delegator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "delegate",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "authorityType",
          "type": "u8",
          "index": false
        }
      ]
    },
    {
      "name": "AdminTransferredEvent",
      "fields": [
        {
          "name": "previousAdmin",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "newAdmin",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "MinterRoleChangedEvent",
      "fields": [
        {
          "name": "minter",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "isAdd",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "PauserRoleChangedEvent",
      "fields": [
        {
          "name": "pauser",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "isAdd",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "FreezerRoleChangedEvent",
      "fields": [
        {
          "name": "freezer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "isAdd",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "BurnerRoleChangedEvent",
      "fields": [
        {
          "name": "burner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "isAdd",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "TransferEvent",
      "fields": [
        {
          "name": "from",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "to",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "fee",
          "type": "u64",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "hasMemo",
          "type": "bool",
          "index": false
        },
        {
          "name": "spender",
          "type": {
            "option": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "InitializeEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "decimals",
          "type": "u8",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ContractPaused",
      "msg": "Contract is paused"
    },
    {
      "code": 6001,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6002,
      "name": "PermitExpired",
      "msg": "Permit expired"
    },
    {
      "code": 6003,
      "name": "InvalidNonce",
      "msg": "Invalid nonce"
    },
    {
      "code": 6004,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    },
    {
      "code": 6005,
      "name": "NotPauser",
      "msg": "Not a pauser"
    },
    {
      "code": 6006,
      "name": "InsufficientBalance",
      "msg": "Insufficient balance"
    },
    {
      "code": 6007,
      "name": "TooManyOperators",
      "msg": "Too many operators"
    },
    {
      "code": 6008,
      "name": "OperatorNotFound",
      "msg": "Operator not found"
    },
    {
      "code": 6009,
      "name": "AccessDenied",
      "msg": "Access denied"
    },
    {
      "code": 6010,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6011,
      "name": "AccessRegistryNotInitialized",
      "msg": "Access registry not initialized"
    },
    {
      "code": 6012,
      "name": "InvalidOwner",
      "msg": "Invalid owner"
    },
    {
      "code": 6013,
      "name": "InsufficientAllowance",
      "msg": "Insufficient allowance"
    },
    {
      "code": 6014,
      "name": "AccountFrozen",
      "msg": "Account is frozen"
    },
    {
      "code": 6015,
      "name": "AccountAlreadyFrozen",
      "msg": "Account is already frozen"
    },
    {
      "code": 6016,
      "name": "AccountNotFrozen",
      "msg": "Account is not frozen"
    },
    {
      "code": 6017,
      "name": "InvalidTransferFrom",
      "msg": "Invalid transfer from operation"
    },
    {
      "code": 6018,
      "name": "InvalidMint",
      "msg": "Invalid mint address"
    },
    {
      "code": 6019,
      "name": "ExpiredPermit",
      "msg": "Expired permit"
    },
    {
      "code": 6020,
      "name": "InvalidAddress",
      "msg": "Invalid address"
    },
    {
      "code": 6021,
      "name": "InvalidPermit",
      "msg": "Invalid permit"
    },
    {
      "code": 6022,
      "name": "InvalidSignature",
      "msg": "Invalid signature"
    }
  ]
};
