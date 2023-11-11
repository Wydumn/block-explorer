export const blockMapping = {
  index: "blocks",
  settings: {
    index: {
      number_of_shards: 2,
      refresh_interval: -1,
      number_of_replicas: 0,
      sort: {
        field: "number",
        order: "desc"
      },
      codec: "best_compression"
    }
  },
  mappings: {
    properties: {
      baseFeePerGas: {
        type: "keyword"
      },
      difficulty: {
        type: "keyword"
      },
      extraData: {
        type: "text"
      },
      gasLimit: {
        type: "keyword"
      },
      gasUsed: {
        type: "keyword"
      },
      hash: {
        type: "keyword"
      },
      logsBloom: {
        type: "text"
      },
      miner: {
        type: "keyword"
      },
      nonce: {
        type: "keyword"
      },
      number: {
        type: "long"
      },
      parentHash: {
        type: "keyword"
      },
      receiptsRoot: {
        type: "keyword"
      },
      sha3Uncles: {
        type: "keyword"
      },
      size: {
        type: "keyword"
      },
      stateRoot: {
        type: "keyword"
      },
      timestamp: {
        type: "date"
      },
      totalDifficulty: {
        type: "keyword"
      },
      transactionsRoot: {
        type: "keyword"
      },
      transactions: {
        type: "keyword"
      },
      uncles: {
        type: "keyword"
      }
    }
  }
}