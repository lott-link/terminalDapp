import React, { useState, useEffect } from "react";
import { walletconnect, injected } from "../Wallet/connectors";
import { useWeb3React } from "@web3-react/core";
import { contractABI, contractAddress } from "../Contract/ContractInfo";
import { useHistory } from "react-router";
const Sidebar = () => {
  const {activate,account,chainId,active,connector,library,deactivate} = useWeb3React()
  const [loadingProfile,setLoadingProfile] = useState(false)
  const [balance,setBalance] = useState()
  const [userName,setUserName] = useState()
  const history = useHistory()
  const walletConnect = async ()=>{
    await activate(walletconnect)
  }
  const metamask = async ()=>{
    await activate(injected)
  }
  const userToAddress = ()=>{
    const web3 = library;
    const contract = new web3.eth.Contract(contractABI,contractAddress)
    contract.methods.userToAddr().call()
    .then(res=>{})
  }
  
  const addressToUser = (address)=>{
    setLoadingProfile(true)
    const web3 = library;
    const contract = new web3.eth.Contract(contractABI,contractAddress)
    window.contract = contract;
    contract.methods.addrToUser(address).call()
    .then(res=>setUserName(res))
    .finally(()=>setLoadingProfile(false))
  }
  useEffect(()=>{
    if(active){
      addressToUser(account)
      const web3 = library;
      web3.eth.getBalance(account)
      .then(res=>setBalance(res))
      .catch(err=>setBalance("cant' get balance"))
    }
  },[active,account])
  return (
    <div className="w-100 h-100 mt-5">
      {!active && <div className="w-100 text-center">
        <button onClick={metamask} className="mx-auto my-2">
          metamask
        </button>
      </div>}
      {!active && <div className="w-100 text-center">
        <button onClick={walletConnect} className="mx-auto my-2">
          walletconnect
        </button>
      </div>}
      {active && <div className="w-100 text-center">
        <button onClick={deactivate} className="mx-auto">
          disconecct
        </button>
      </div>}
      <div className="text-center">
        {account && <div>{account.slice(0,4)+ "..." + account.slice(-4)}</div>}
        {chainId && <div>{chainId}</div>}
        {active && (userName && userName.username ? <div>username:{userName.username}</div> : loadingProfile ? <div>loading...</div> : <div>you are not signed in <div><button onClick={()=>history.push('/contract')}>Sign in</button></div></div>)}
        {active && balance && <div>balance:{balance}</div>}
      </div>
    </div>
  );
};

export default Sidebar;
