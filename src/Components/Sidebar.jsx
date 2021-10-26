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
  const [userInfo,setUserInfo] = useState()
  const [error,setError] = useState()
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
    .catch(err=>setError(err))
    .finally(()=>setLoadingProfile(false))
  }
  const getUserInfo = ()=>{
    const contract = new library.eth.Contract(contractABI,contractAddress)
    contract.methods.userInfo(account).call()
    .then(res=>{
        setUserInfo(parseUserInfo(res.info))
    })
  }
  const parseUserInfo = (info)=>{
    if(info){
        let data = info.replaceAll("\'","\"")
        data = JSON.parse(data.slice(1,data.length-1))
        const fields = []
        for(const key in data){
                fields.push({key,value:data[key]})
        }
        return fields;
    }
  }
  useEffect(()=>{
    if(active){
      addressToUser(account)
      const web3 = library;
      web3.eth.getBalance(account)
      .then(res=>setBalance(res))
      .catch(err=>setBalance("cant' get balance"))
      getUserInfo()
    }else{
      setUserInfo('')
    }
  },[active,account,chainId])
  return (
    <div className="w-100 h-100">
      <div style={{height:'40%',position:'relative'}}>
        <div style={{width:'90%',margin:'0.5rem auto',fontSize:'1.3rem'}}>{active ? "Wallet" : "Connect Wallet"}</div>
        {!active && <div className="w-100 text-center">
          <button onClick={metamask} className="wallet-button p-0">
            <div className="d-flex h-100">
              <div className="wallet-button-logo d-flex justify-content-center align-items-center" style={{width:'15%'}}><div className="circle"></div></div>
              <div className="wallet-button-text d-flex align-items-center" style={{width:'85%'}}>metamask</div>
            </div>
          </button>
        </div>}
        {!active && <div className="w-100 text-center">
          <button onClick={walletConnect} className="wallet-button mt-2 p-0">
            <div className="d-flex h-100">
              <div className="wallet-button-logo d-flex justify-content-center align-items-center" style={{width:'15%'}}><div className="circle"></div></div>
              <div className="wallet-button-text d-flex align-items-center" style={{width:'85%'}}>walletconnect</div>
            </div>
          </button>
        </div>}
        
        <div className="" style={{margin:'0.75rem'}}>
          {account && <div>
              <div>Wallet Address:</div>
              <div>{account.slice(0,8)+ "..." + account.slice(-8)}</div>
            </div>}
          {active && balance && 
          <div>
            <div>balance:</div>
            <div className="d-flex align-items-center">
              <div className="circle"></div>
              <div className="mx-1">{balance}</div>
            </div> 
          </div>}
          {chainId && (chainId === 137 ? <div>{chainId}</div> : <div>please change your network to polygon</div>)}
          {active && 
            <div className="w-100">
              <button style={{position:'absolute',bottom:'0',right:'5%'}} onClick={deactivate} className="my-2 wallet-button">
                disconecct
              </button>
            </div>
        }
        </div>
      </div>
      {!loadingProfile ? <div className="w-100 p-3" style={{borderTop:'2px solid white',height:'60%',position:'relative'}}>
        {active && userName && userName.username && <div className="d-flex">
          <div style={{width:'50px',height:'50px',borderRadius:'50%',backgroundColor:'gray'}}></div>
          <div className="mx-3">
            <div>{userName.username}</div>
            <div style={{color:'yellow'}}>Edit Profile</div>
          </div>
        </div>}
        {/* {active && (userName && userName.username ? <div>username:{userName.username}</div> : loadingProfile ? <div>loading...</div> : <div>you are not signed in <div className="w-100 text-center"><button className="wallet-button" onClick={()=>history.push('/contract')}>Sign in</button></div></div>)} */}
        {userInfo && 
          <div className="my-2">
            {userInfo.map((item,index)=>{
              return <div key={index} className="d-flex align-items-center">
                <div className="circle"></div>
                <div className="mx-1">{item.key}:{item.value}</div>
              </div>
            })}
          </div>
        }
        {userInfo && <div className="w-100" style={{position:'absolute',bottom:'5%'}}>
          <button className="wallet-button">more</button>
        </div>
        }
        {error && <div>{error}</div>}
        {active && userName && !userName.username && <div className="w-100 text-center" style={{position:'absolute',bottom:'5%',right:'0'}}><button onClick={()=>history.push('/contract')} className="secondary-button">Sign in</button></div>}
      </div> : <div>loading...</div>}
      </div>
  );
};

export default Sidebar;
