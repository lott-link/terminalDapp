export const addresses = {
  rinkeby: {
    NFT: "0xFE7FC1F36fBF10328F2E898b9487F9BD4ddA4287",
    erc721API:
      "https://api-rinkeby.etherscan.io/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&apikey=WPZTIVDHXFF48WJ7UDAIE893S7WAVG6DSU&address=",
    crossChain: "0x64DfA1B8A8392E3c93f6Df96b5EbB01A1bB13e94",
    register: "0x13356777Ef8547d9e2F94a3C0ED2020c1Cd04e65",
    messenger: "0x0d682f0593e7d242fF35Eed6EFea5FE9805D6E21",
    logAPI:
      "https://api-rinkeby.etherscan.io/api?module=logs&action=getLogs&fromBlock=9433622&toBlock=latest&apikey=WPZTIVDHXFF48WJ7UDAIE893S7WAVG6DSU&address=",
  },
  polygon: {
    factory: "",
    NFT: "0x6517077303340e0E826d6DaCD64813cb6A9E3195",
    erc721API:
      "https://api.polygonscan.com/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&apikey=GFYDP8PCVIJA4JCTYPNSQETUAWQHKAD16Y&address=",
    messenger: "0x632B7c1bb31c79D8dE85B2c8122C70EAF33D6783",
    logAPI:
      "https://api.polygonscan.com/api?module=logs&action=getLogs&fromBlock=5000000&toBlock=999999999&apikey=GFYDP8PCVIJA4JCTYPNSQETUAWQHKAD16Y&address=",
    lottWhiteList: "0x2E85b497c28DEC383cA9641B1BA78a2ff37B0726",
    lottIo: "0xB6f5ae1bfdb02E8EbD45d476FA70683aFD453ab7",
    lottToken: "0x773ADb3F75c4754aE1A56FfF3ad199056817bEA",
  },
  mumbai: {
    factory: "0xe88f4Ba9F8fe1701F3463A6244dcd7d3538a3b3F",
    NFT: "0x4316773d8a9f366f3Ae53419000188b3979360C2",
    messenger: "0xEF414978d98FE34AaCe34E2a1c06E42CDa05Cbe2",
    erc721API:
      "https://api-testnet.polygonscan.com/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&address=",
    crossChain: "0xfd23d6C7083D116394aA203552eB23F486554e69",
    logAPI:
      "https://api-testnet.polygonscan.com//api?module=logs&action=getLogs&fromBlock=34318444&toBlock=999999999&apikey=GFYDP8PCVIJA4JCTYPNSQETUAWQHKAD16Y&address=",
  },
  fuji: {
    NFT: "0xc1A9ee55b5E915E72BfED9DBEcc27d0834d2f2b6",
    crossChain: "0x16539214c06b69b3bc4c2613cFE8a6BCf6d2A4aC",
    erc721API:
      "https://api-testnet.snowtrace.io/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&address=",
    register: "0x42e8F2bD950303137F7Bc71f414E0DabD7f72aAf",
    logAPI: "",
  },
  ethereum: {
    logAPI:
      "https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=379224&toBlock=latest&apikey=WPZTIVDHXFF48WJ7UDAIE893S7WAVG6DSU&address=",
    erc721API:
      "https://api.etherscan.io/api?module=account&action=tokennfttx&startblock=0&endblock=latest&apikey=WPZTIVDHXFF48WJ7UDAIE893S7WAVG6DSU&address=",
    // lottWhiteList: "0x2E85b497c28DEC383cA9641B1BA78a2ff37B0726",
    lottIo: "0x70c02Bc8bc8BcEEEbc3Cc7750E5A8fF67AadDa7f",
    lottToken: "0xc86CAA33EcaFDD65951F9F809CBaf3D67eeB64bd",
  },
};
export const chains = {
  mumbai: {
    chainIdDecimal: 80001,
    chainIdHex: "0x13881",
    icon: "/polygon/Preview.png",
    params: [
      {
        chainId: "0x13881",
        chainName: "Mumbai Testnet",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
      },
    ],
  },
  polygon: {
    chainIdDecimal: 137,
    chainIdHex: "0x89",
    icon: "/polygon/Preview.png",
    params: [
      {
        chainId: "0x89",
        chainName: "Polygon",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"],
      },
    ],
  },
  rinkeby: {
    chainIdDecimal: 4,
    chainIdHex: "0x4",
    icon: "/eth/Preview.png",
    params: [
      {
        chainId: "0x4",
        chainName: "rinkeby",
        nativeCurrency: {
          name: "Rinkeby Test Network",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: [
          "https://rinkeby.infura.io/v3/f0362c1f5aea42abb1d875f7a0f8692d",
        ],
        blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
      },
    ],
  },
  fuji: {
    chainIdDecimal: 4313,
    chainIdHex: "0xa869",
    icon: "/avalanche.svg",
    params: [
      {
        chainId: "0xa869",
        chainName: "Fuji Testnet",
        nativeCurrency: {
          name: "AVAX",
          symbol: "AVAX",
          decimals: 18,
        },
        rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://testnet.snowtrace.io/"],
      },
    ],
  },
  ethereum: {
    chainIdDecimal: 1,
    chainIdHex: "0x1",
    icon: "/eth/Preview.png",
    params: [
      {
        chainId: "0x1",
        chainName: "Ethereum Mainnet",
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: [""],
        blockExplorerUrls: ["https://etherscan.io/"],
      },
    ],
  },
  binance: {
    chainIdDecimal: 56,
    chainIdHex: "0x38",
    icon: "/eth/Preview.png",
    params: [
      {
        chainId: "0x38",
        chainName: "Smart Chain",
        nativeCurrency: {
          name: "BNB",
          symbol: "BNB",
          decimals: 18,
        },
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        blockExplorerUrls: ["https://bscscan.com"],
      },
    ],
  },
  "binance-testnet": {
    chainIdDecimal: 97,
    chainIdHex: "0x61",
    icon: "/eth/Preview.png",
    params: [
      {
        chainId: "0x61",
        chainName: "Smart Chain - Testnet",
        nativeCurrency: {
          name: "BNB",
          symbol: "BNB",
          decimals: 18,
        },
        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
        blockExplorerUrls: ["https://testnet.bscscan.com"],
      },
    ],
  },
};
export const converChainIDToName = (chainID) => {
  if (["0x1", 1].includes(chainID)) return "ethereum";
  else if (["0x4", 4].includes(chainID)) return "rinkeby";
  else if (["0x89", 137].includes(chainID)) return "polygon";
  else if (["0x13881", 80001].includes(chainID)) return "mumbai";
  else if (["0xa869", 43113].includes(chainID)) return "fuji";
  else if (["0x38", 56].includes(chainID)) return "binance";
};
export const checkLink = (link) => {
  if (!link) return;
  const protocol = link.split("://")[0];
  if (protocol.toLowerCase().includes(["http", "https"])) return link;
  else if (protocol.toLowerCase().includes(["ipfs"]))
    return "https://ipfs.io/ipfs/" + link.split("://")[1];
  else return link;
};
