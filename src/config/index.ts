export const config = {
  myriad: {
    baseUrls: {
      mainnet: "https://api-v1.myriad.markets",
      testnet: "https://api-v1.staging.myriad.markets",
    },
  },
  polkamarket: {
    baseUrls: {
      mainnet: "https://api-v1.polkamarket.com",
      testnet: "https://api-v1.staging.polkamarket.com",
    },
  },
  contracts: {
    mainnet: {
      tokens: {
        "USDC.e": "0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1",
        PENGU: "0x9eBe3A824Ca958e4b3Da772D2065518F009CBa62",
        PTS: "0xf19609e96187cdaa34cffb96473fac567e547302",
      },
      predictionMarket: "0x4f4988a910f8ae9b3214149a8ea1f2e4e3cd93cc",
      predictionMarketQuerier: "0x710F30AbDADB86A33faE984d6678d4Ed31517B18",
    },
    testnet: {
      tokens: {
        USDC: "0x8820c84FD53663C2e2EA26e7a4c2b79dCc479765",
        PENGU: "0x6ccDDCf494182a3A237ac3f33A303a57961FaF55",
        PTS: "0x58c8b28089a8cc0A9Ad4d79342C5E432452614C0",
      },
      predictionMarket: "0x7accb94c8dd59c8e308e83053ee6cdd770714f37",
      predictionMarketQuerier: "0x05e1ff194c9bb3f04a0ddb7551f4f9e1c441f235",
    },
  },
};
