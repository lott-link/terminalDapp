export const addresses = {
    polygon:{
       factory:"",
      //  register:"",
       NFT:"0x6517077303340e0E826d6DaCD64813cb6A9E3195",
       erc721API:"https://api.polygonscan.com/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&apikey=GFYDP8PCVIJA4JCTYPNSQETUAWQHKAD16Y&address=",            
       //  crossChain:"0xfB7f3939A0074C5155e1afEBAf148E9b4723D642"
      },
    mumbai:{
       factory:"0xe88f4Ba9F8fe1701F3463A6244dcd7d3538a3b3F",
       register:"0x92c3f3b2122b61a50b218df446e2799535fcb519",
       NFT:"0x4316773d8a9f366f3Ae53419000188b3979360C2",
       erc721API:"https://api-testnet.polygonscan.com/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&address=",
       crossChain:"0xfd23d6C7083D116394aA203552eB23F486554e69"                
    },
    rinkeby:{
      NFT:"0xFE7FC1F36fBF10328F2E898b9487F9BD4ddA4287",
      erc721API:"https://api-rinkeby.etherscan.io/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&apikey=WPZTIVDHXFF48WJ7UDAIE893S7WAVG6DSU&address=",
      crossChain:"0x64DfA1B8A8392E3c93f6Df96b5EbB01A1bB13e94"
    },
    fuji:{
      NFT:"0xc1A9ee55b5E915E72BfED9DBEcc27d0834d2f2b6",
      crossChain:"0x16539214c06b69b3bc4c2613cFE8a6BCf6d2A4aC",
      erc721API:"https://api-testnet.snowtrace.io/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&address="
    }
}
export const chains = {
   mumbai:{
      chainIdDecimal:80001,
      chainIdHex:"0x13881",
      icon:'/polygon/Preview.png',
      params:[
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
       ]
   },
   polygon:{
      chainIdDecimal:137,
      chainIdHex:"0x89",
      icon:'/polygon/Preview.png',
      params:[
         {
           chainId: "0x89",
           chainName: "Polygon",
           nativeCurrency: {
             name: "MATIC",
             symbol: "MATIC",
             decimals: 18,
           },
           rpcUrls: ["https://rpc-mainnet.matic.network"],
           blockExplorerUrls: ["https://polygonscan.com/"],
         },
       ]
   },
   rinkeby:{
      chainIdDecimal:4,
      chainIdHex:"0x4",
      icon:'/eth/Preview.png',
      params:[
         {
           chainId: "0x4",
           chainName: "rinkeby",
           nativeCurrency: {
             name: "Rinkeby Test Network",
             symbol: "ETH",
             decimals: 18,
           },
           rpcUrls: ["https://rinkeby.infura.io/v3/f0362c1f5aea42abb1d875f7a0f8692d"],
           blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
         },
       ]
   }, 
   fuji:{
    chainIdDecimal:4313,
    chainIdHex:"0xa869",
    icon:'/avalanche.svg',
    params:[
      {
        chainId: '0xa869',
        chainName: "Fuji Testnet",
        nativeCurrency: {
        name: "AVAX",
        symbol: "AVAX",
        decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],     
    blockExplorerUrls: ['https://testnet.snowtrace.io/']
    }]
   },
   ethereum:{
      chainIdDecimal:1,
      chainIdHex:"0x1",
      icon:'/eth/Preview.png'
   }
}
export const converChainIDToName = (chainID)=>{
  if(["0x1",1].includes(chainID))
    return "ethereum"
  else if(["0x4",4].includes(chainID))
    return "rinkeby"
  else if(["0x89",137].includes(chainID))
    return "polygon" 
  else if(["0x13881",80001].includes(chainID))
    return "mumbai"
  else if(["0xa869",4313].includes(chainID))
    return "fuji"
  // switch(chainID){
  //   case "0x1":
  //     return "ethereum"
  //   case "0x4":
  //     return "rinkeby"
  //   case "0x89":
  //     return "polygon" 
  //   case "0x13881":
  //     return "mumbai"
  //   case "0xa869":
  //     return "fuji"
  // }
}