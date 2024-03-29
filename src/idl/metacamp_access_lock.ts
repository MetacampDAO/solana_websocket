export type MetacampAccessLock = {
  "version": "0.1.0",
  "name": "metacamp_access_lock",
  "instructions": [
    {
      "name": "initializeTrigger",
      "accounts": [
        {
          "name": "trigger",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lock",
          "isMut": true,
          "isSigner": true
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
      "name": "initializeWhitelist",
      "accounts": [
        {
          "name": "whitelistedAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pass",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAddress",
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
      "name": "updateWhitelistAmount",
      "accounts": [
        {
          "name": "whitelistedAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pass",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAddress",
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
      "name": "openDoor",
      "accounts": [
        {
          "name": "trigger",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lock",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistedAccount",
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
      "name": "removeWhitelist",
      "accounts": [
        {
          "name": "whitelistedAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pass",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAddress",
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
      "name": "trigger",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "latestMint",
            "type": "publicKey"
          },
          {
            "name": "count",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "whitelistedAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintAddress",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InsufficientToken",
      "msg": "Insufficient token amount"
    }
  ]
};

export const IDL: MetacampAccessLock = {
  "version": "0.1.0",
  "name": "metacamp_access_lock",
  "instructions": [
    {
      "name": "initializeTrigger",
      "accounts": [
        {
          "name": "trigger",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lock",
          "isMut": true,
          "isSigner": true
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
      "name": "initializeWhitelist",
      "accounts": [
        {
          "name": "whitelistedAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pass",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAddress",
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
      "name": "updateWhitelistAmount",
      "accounts": [
        {
          "name": "whitelistedAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pass",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAddress",
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
      "name": "openDoor",
      "accounts": [
        {
          "name": "trigger",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lock",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "userTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistedAccount",
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
      "name": "removeWhitelist",
      "accounts": [
        {
          "name": "whitelistedAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pass",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAddress",
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
      "name": "trigger",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "latestMint",
            "type": "publicKey"
          },
          {
            "name": "count",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "whitelistedAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintAddress",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InsufficientToken",
      "msg": "Insufficient token amount"
    }
  ]
};
