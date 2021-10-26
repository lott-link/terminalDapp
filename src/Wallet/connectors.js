import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

export const walletconnect = new WalletConnectConnector({
    // infuraId:'f0362c1f5aea42abb1d875f7a0f8692d',
    rpc:{
              137:"https://rpc-mainnet.maticvigil.com/"
            },
    chainId:137,
})
export const injected = new InjectedConnector({
    supportedChainIds:[1,3,4,5,137,80001]
})