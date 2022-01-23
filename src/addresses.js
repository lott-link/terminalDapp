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
       NFT:"0xd2Ad56D684A211b5Ee5a2aFb6e8E7a6e6F642d67",
       erc721API:"https://api-testnet.polygonscan.com/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&address=",
       crossChain:"0xF3C5A7b8D8eFa685E946B3e4Ba51Ff267a580E0b"                
    },
    rinkeby:{
       erc721API:"https://api-rinkeby.etherscan.io/api?module=account&action=tokennfttx&startblock=0&endblock=999999999&sort=asc&apikey=WPZTIVDHXFF48WJ7UDAIE893S7WAVG6DSU&address=",
       crossChain:"0x0cF0366e33F2225Cad6Bc3b61a4F699D6a85769D"
    },
    fuji:{
      crossChain:"0x9F67c2FB92fba15c98F741A13441604f9083dcE7",
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
  switch(chainID){
    case "0x1":
      return "ethereum"
    case "0x4":
      return "rinkeby"
    case "0x89":
      return "polygon" 
    case "0x13881":
      return "mumbai"
  }
}