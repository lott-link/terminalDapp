import React, { useState, useEffect, useContext } from "react";
import { walletconnect, injected } from "../Wallet/connectors";
import { useWeb3React } from "@web3-react/core";
import { registerContractABI} from '../Contracts/ContractsABI'
import { useHistory } from "react-router";
import Button from '../Components/styled/Button'
import metamaskIcon from '../Assetes/icons/metamask/medium.png'
import walletConnectIcon from '../Assetes/icons/walletconnect/medium.png'
import { useEagerConnect, useInactiveListener } from '../Hooks/hooks'
import { context } from '../App' 
import styles from './sidebar.styles.module.css'
import Select from "./Select";
import { OverlayTrigger, Tooltip} from 'react-bootstrap'
const Sidebar = () => {
  const {activate,account,chainId,active,connector,library,deactivate} = useWeb3React()
  const [loadingProfile,setLoadingProfile] = useState(false)
  const [balance,setBalance] = useState()
  const [userName,setUserName] = useState()
  const [userInfo,setUserInfo] = useState()
  const [error,setError] = useState()
  const [signedIn,setSignedIn] = useState(false)
  const history = useHistory()
  const data = useContext(context)
  const walletConnect = async ()=>{
    await activate(walletconnect)
  }
  const metamask = async ()=>{
    await activate(injected)
  }
  const addressToUser = async (address)=>{
    if(!data.network || account) return
    setLoadingProfile(true)
    const registerContract = new library.eth.Contract(registerContractABI,data.addresses[data.network]['register'])
    const registered = await registerContract.methods.registered(account).call(res=>res)
    if(registered){
      registerContract.methods.addressToUsername(address).call()
        .then(res=>{
          setSignedIn(true)
          setUserName(res)
        })
        .catch(err=>setError(err))
        .finally(()=>setLoadingProfile(false))
    }else{
      setError("you are not signed in")
      setSignedIn(false)
      setLoadingProfile(false)
    }
  }
  const getUserInfo = async ()=>{
    if(!data.network || account) return
    const registerContract = new library.eth.Contract(registerContractABI,data.addresses[data.network]['register'])
    const registered = await registerContract.methods.registered(account).call(res=>res)
    if(registered){
      registerContract.methods.addressToProfile(account).call()
        .then(res=>{
            setUserInfo(parseUserInfo(res.info))
        })
    }
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
      library.eth.getBalance(account)
      .then(res=>setBalance(res))
    }
    if(active && chainId === 80001){
      addressToUser(account)
      .catch(err=>setBalance("cant' get balance"))
        getUserInfo()
    }else{
      setUserInfo('')
    }
  },[active,account,chainId,data.network])

  useEffect(()=>{
    if(chainId){
      if(chainId===1)
        data.setNetwork('ethereum')
      else if(chainId===137)
        data.setNetwork('polygon')
      else if(chainId===80001)
        data.setNetwork('mumbai')
      else if(chainId===4)
        data.setNetwork('rinkeby')
      else if(chainId===43113)
        data.setNetwork('fuji')
    }
  },[chainId])
  useEffect(()=>{
    if(window.ethereum){
      window.ethereum.on('accountsChanged', ()=>window.location.reload())
    }
  },[])

   // handle logic to recognize the connector currently being activated
   const [activatingConnector, setActivatingConnector] = React.useState()
   React.useEffect(() => {
     if (activatingConnector && activatingConnector === connector) {
       setActivatingConnector(undefined)
     }
   }, [activatingConnector, connector])
 
   // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
   const triedEager = useEagerConnect()
 
   // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
   useInactiveListener(!triedEager || !!activatingConnector)

  return (
    <div className="w-100 d-flex flex-column" style={{minHeight: "calc(100vh - 7.5rem)"}}>
      <div style={{height:'40%',position:'relative',minHeight:'15rem',flexGrow:"1"}} className="d-flex flex-column">
        <div style={{width:'90%',margin:'0.5rem auto',fontSize:'1.3rem'}}>{active ? "Wallet" : "Connect Wallet"}</div>
        {!active && <div className="w-100 text-center">
          <button onClick={metamask} className="wallet-button p-0">
            <div className="d-flex h-100">
              <div className="wallet-button-logo d-flex justify-content-center align-items-center" style={{width:'15%'}}><img style={{width:'40px',height:"40px"}} src={metamaskIcon} alt="metamask icon" /></div>
              <div className="wallet-button-text d-flex align-items-center" style={{width:'85%'}}>metamask</div>
            </div>
          </button>
        </div>}
        {!active && <div className="w-100 text-center">
          <button onClick={walletConnect} className="wallet-button mt-2 p-0">
            <div className="d-flex h-100">
              <div className="wallet-button-logo d-flex justify-content-center align-items-center" style={{width:'15%'}}><img style={{width:'40px',height:"40px"}} src={walletConnectIcon} alt="walletconnect icon" /></div>
              <div className="wallet-button-text d-flex align-items-center" style={{width:'85%'}}>walletconnect</div>
            </div>
          </button>
        </div>}
        <div className="" style={{margin:'0.75rem'}}>
          {account && <div>
              <div className="d-flex align-items-center">
                <div>Wallet Address:</div> 
                <OverlayTrigger  placement={"bottom"}  overlay={<Tooltip >explore block</Tooltip>}>
                  <div>
                    {data.network &&
                    <a href={data.chains[data.network].params[0].blockExplorerUrls[0]+"/"+"address"+"/"+account} 
                    target="_blank" rel="noreferrer" >
                      <img src="/info2.svg" className="mx-2" alt="explore-icon" />
                    </a>
                    }
                  </div>
                </OverlayTrigger>
              </div>
              <OverlayTrigger  placement={"bottom"}  overlay={<Tooltip >copy</Tooltip>}>
                <div style={{cursor:"pointer"}} className="wallet-address" onClick={()=>navigator.clipboard.writeText(account)}>
                  {account.slice(0,8)+ "..." + account.slice(-8)}
                </div>    
              </OverlayTrigger>
            </div>}
          {active && balance && 
          <div>
            <div>balance:</div>
            <div className="d-flex align-items-center">
              <div className="circle"></div>
              <OverlayTrigger  placement={"bottom"}  overlay={<Tooltip >{balance} wei</Tooltip>}>
                <div className="mx-1">{(balance/1E18).toFixed(4)}</div>
              </OverlayTrigger>
            </div> 
          </div>}
        </div>
          <div className="w-100" style={{position:'absolute',bottom:'15%',left:'0'}}>
            <div className='w-100 px-4'>
              <Select />
            </div>
          </div>
          {active && 
            <div className="w-100 px-4" style={{position:'absolute',bottom:'0',left:'0'}}>
              <button onClick={deactivate} className="my-2 w-100 wallet-button" style={{background:"#C4C4C4"}}>
                disconecct
              </button>
            </div>
        }
      </div>
      {!loadingProfile ? <div className="w-100 p-3" 
      style={{height:"60%",borderTop:'2px solid white',position:'relative',overflow:'auto',minHeight:'10rem',flexGrow:"1"}}>
        {active && signedIn && <div className="d-flex">
          <div style={{width:'50px',height:'50px',borderRadius:'50%',backgroundColor:'gray'}}></div>
          <div className="mx-3">
            <div>{userName}</div>
            <div style={{color:'yellow'}}>Edit Profile</div>
          </div>
        </div>}
        {/* {active && (userName && userName.username ? <div>username:{userName.username}</div> : loadingProfile ? <div>loading...</div> : <div>you are not signed in <div className="w-100 text-center"><button className="wallet-button" onClick={()=>history.push('/contract')}>Sign in</button></div></div>)} */}
        {userInfo && userInfo.length !== 0 ? 
          (<div className="my-2 h-75" style={{overflowY:"auto"}}>
            {userInfo.map((item,index)=>{
              return <div key={index} className="d-flex align-items-center">
                <div className="circle"></div>
                <div className="mx-1" style={{wordBreak:"break-word"}}>{item.key}:{item.value}</div>
              </div>
            })}
          </div>)
          : <div>there is no info</div>
        } 
        {userInfo && 
        <div className="w-100" style={{position:'absolute',bottom:'0',left:'0'}}>
          <Button primary style={{width:'90%'}}>more</Button>
        </div>
        }
        {error && <div>{error}</div>}
        {active && !signedIn && <div className="w-100 text-center" style={{position:'absolute',bottom:'5%',right:'0'}}><button onClick={()=>history.push('/contract/signin')} className="secondary-button">Sign in</button></div>}
      </div> : <div>loading...</div>}
      </div>
  );
};

export default Sidebar;
