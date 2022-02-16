import React, { useState, useEffect, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { encrypt } from 'eth-sig-util'
import { OverlayTrigger, Tooltip} from 'react-bootstrap'

import Input from '../Components/styled/input';
import Button from '../Components/styled/Button';
import { messengerABI } from '../Contracts/ContractsABI';
import { context } from '../App'
import LoadingBalls from '../Components/LoadingBalls'

const ContactUs = () => {
  const { library, account, active, chainId } = useWeb3React()
  const data = useContext(context)
  const [msg,setMsg] = useState("")
  const [to,setTo] = useState("")
  const [subject,setSubject] = useState()
  const [disablePrivateMsg,setDisablePrivateMsg] = useState(false)
  const [ownPublicKey,setOwnPublicKey] = useState()
  const [receiverPublicKey,setReceiverPublicKey] = useState()
  const [senderPublicKey,setSenderPublicKey] = useState()
  const [show,setShow] = useState(false)
  const [stages,setStages] = useState({loading:false,approving:false,confirming:false,confirmed:false})
  const [publicKeyLoading,setPublicKeyLoading] = useState({button:false,metakeyAprove:false,setKeyAprove:false,confirming:false})
  const [mode,setMode] = useState()
  const reqPublicKey = async ()=>{
    setPublicKeyLoading({button:false,metakeyAprove:true,setKeyAprove:false,confirming:false})
    // requesting for public key
    const publicEncryptionKey = await window.ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [account],
    })
    setPublicKeyLoading({button:false,metakeyAprove:false,setKeyAprove:false,confirming:false})
    // setShow(false)
    setSenderPublicKey(publicEncryptionKey)
    setPublicKey(publicEncryptionKey)
    console.log("this is public key:",publicEncryptionKey)
  }
  const encryptFunc = (msg,publicEncryptionKey)=>{
    const encryptedMsgPlain = encrypt( publicEncryptionKey, 
      { data: msg },'x25519-xsalsa20-poly1305')
    const encryptedMsgHex = library.utils.toHex(encryptedMsgPlain)
    // console.log("plain",encryptedMsgPlain)
    console.log("hex",encryptedMsgHex)
    return encryptedMsgHex
  }

  const getPublicKey = async (address)=>{
      if(!active || !data.network) return;
      try {
        console.log("getting public key...")
        const contract = new library.eth.Contract(messengerABI,data.addresses[data.network].messenger)
        const publicKey = await contract.methods.publicKey(address).call().then(res=>res)
        console.log("public key",publicKey,publicKey.lenght)
        return publicKey;
      }
      catch(err){
          console.log(err)
      }
  }
  const setPublicKey = async (publicKey)=>{
    if(!active) return;
    console.log("publicKey in setpublickey",publicKey)
    setPublicKeyLoading({button:false,metakeyAprove:false,setKeyAprove:true,confirming:false})
    try {
        const contract = new library.eth.Contract(messengerABI,data.addresses[data.network]['messenger'])
        contract.methods.setPublicKey(publicKey).send({from:account}) 
        .on("transactionHash",transactionHash=>{
          setPublicKeyLoading({button:false,metakeyAprove:false,setKeyAprove:false,confirming:true})
        })
        .on("receipt",receipt=>{
          sendMessage(mode)
          setShow(false)
        })
        .on("error",error=>{
          setPublicKeyLoading({button:false,metakeyAprove:false,setKeyAprove:false,confirming:false})
          setShow(false)
        })
    }
    catch(err) {
        console.log(err)
    }
  }
  const sendMessage = async (method)=>{
    if(!active) return;
    setStages({...stages,loading:true,approving:true})
    try {
        let msgToSend = {}
        console.log("mode is",method)
        if(method === 'private'){
            msgToSend.isHashed = true;
            msgToSend.msg = await encryptFunc(msg,receiverPublicKey)

        }else if(method === 'public'){
            msgToSend.isHashed = false;
            msgToSend.msg = msg
        }
        console.log("sending params:",to,subject,msgToSend)
        const contract = new library.eth.Contract(messengerABI,data.addresses[data.network]['messenger'])
        contract.methods.sendMessage(to,subject,JSON.stringify(msgToSend).replaceAll("\"","\'")).send({from:account}) 
        .on("transactionHash",transactionHash=>{
          setStages({loading:true,approving:false,confirming:true,confirmed:false})
        })
        .on("receipt",receipt=>{
          setStages({loading:true,approving:false,confirming:false,confirmed:true})
          setTimeout(()=>{
            setStages({loading:false,approving:false,confirming:false,confirmed:false})
          },2000)
        })
        .on("error",error=>{
          setStages({loading:false,approving:false,confirming:false,confirmed:false})
        })
    }
    catch(err) {
        console.log(err)
    }  
  }
  const handleChangeAddress = async (e)=>{
      if(e.target.value.length === 42){
        const publicKey = await getPublicKey(e.target.value)
        if(publicKey === false) setDisablePrivateMsg(true)
        else {
            setReceiverPublicKey(publicKey)
        }
        console.log("getting public key in input",publicKey)
      }
      setTo(e.target.value)
  }
  useEffect(()=>{
    (async()=>{
      const publicKey = await getPublicKey(account)
      console.log("puclic key in useEffect", publicKey)
      if(publicKey) {
        setOwnPublicKey(true)
        return publicKey
      } 
      else {
        setOwnPublicKey(false)
        return false
      } 
    })()
  },[active,chainId,data.network])
 
  const handleSendMessage = async(method)=>{
    if( ownPublicKey === false ) {
      setShow(true)
      setPublicKeyLoading({button:true,metakeyAprove:false,setKeyAprove:false,confirming:false})
      setMode(method)
    }else{
      sendMessage(method)
    }

  }
  return (
  <div className='d-flex flex-column justify-content-center align-items-center position-relative w-100 h-100'>
    {/* <div><Input title="To" onChange={handleChangeAddress}/></div> */}
    <select name="" id="" onChange={handleChangeAddress} className="text-center py-1 position-relative"
    style={{width:'17rem', background:"#020227",color:'white',border:'7px double white',right:'1.2rem'}}>
      <option value="">Select a section</option>
      <option value="0x8C97769D2Fc3e18967375B9E6e4214f1A393A862">Dapp</option>
      <option value="">Solidity</option>
      <option value="0xfe6754537CfE0aD4Eb9F3996Ae9c36A717CBaaFb">Strategy</option>
    </select>
    <div className='d-flex'>
      <Input title="Subject" onChange={(e)=>setSubject(e.target.value)} />
      <OverlayTrigger key={"bottom"} placement={"bottom"}
                overlay={
                <Tooltip >
               this part doesn't encrypt. It helps you and the receiver read something about the private message. Be careful everybody can read this part. 
                </Tooltip>}>
              <img className='mx-2 m-1' src="/info.svg" alt="" />
        </OverlayTrigger>
    </div>
    <div style={{position:'relative'}}>
        <label htmlFor="" className='px-3' onChange={(e)=>setMsg(e.target.value)}
        style={{position:'absolute',background:'#020227',top:'-10px',left:"20px"}}>
            Message
            <OverlayTrigger key={"bottom"} placement={"bottom"}
                overlay={
                <Tooltip >
               this part can encrypt and send in private mode. Be careful in the private mode; you can't read your sent message anymore. 
                </Tooltip>}>
              <img className='mx-2 m-1' src="/info.svg" alt="" />
          </OverlayTrigger>        
        </label>
        <textarea name="" id="" cols="30" rows="10" className='p-2' 
        onChange={(e)=>setMsg(e.target.value)}
        style={{background:'#020227',border:'7px double white',color:'white'}}>
        </textarea>
    </div>
    <div>
        <Button disabled={disablePrivateMsg} onClick={()=>{handleSendMessage('private')}}>
          Send Private Message
          <OverlayTrigger key={"bottom"} placement={"bottom"}
                overlay={
                <Tooltip >
               the message will encrypt whit the receiver's Public key, and only the receiver can read the message. 
                </Tooltip>}>
              <img className='mx-2 m-1' src="/info.svg" alt="" />
          </OverlayTrigger>   
        </Button>
        <Button onClick={()=>{handleSendMessage('public')}}>
          Send Public Message
          <OverlayTrigger key={"bottom"} placement={"bottom"}
                overlay={
                <Tooltip >
               your message will not encrypt, and everybody can read it.  
                </Tooltip>}>
              <img className='mx-2 m-1' src="/info.svg" alt="" />
          </OverlayTrigger>  
        </Button>
    </div>
    {(show) &&
    <div className='position-absolute w-100 h-100 d-flex justify-content-center align-items-center' style={{backgroundColor:"rgba(13,110,253,0.5)"}}>
      <div className='w-50 h-50 p-3' style={{background:'#020227',border:'7px double white',color:'white'}}>
        {publicKeyLoading.button &&
        <>
        <div>
          <h5>
            Enable your private messaging
            <OverlayTrigger key={"bottom"} placement={"bottom"}
                overlay={
                <Tooltip >
                By clicking this, allow other people to send you messages in private mode. It means anyone can't read messages sent to you. 
                </Tooltip>}>
              <img className='mx-2 m-1' src="/info.svg" alt="" />
            </OverlayTrigger>
          </h5>
        </div>
        <div className='d-flex justify-content-center position-relative' style={{top:'25%'}}>
          <Button secondary onClick={()=>reqPublicKey()}>Enable Public Key</Button>
          <Button onClick={()=>{setShow(false);sendMessage(mode)}}>close</Button>
        </div>
        </>
        }
        {publicKeyLoading.metakeyAprove &&
          <div className='d-flex flex-column justify-content-center position-relative' style={{top:'40%'}}>
            <div className='text-center'><h5>getting private key</h5></div>
            <div><LoadingBalls /></div>
          </div>
        }
        {publicKeyLoading.setKeyAprove &&
          <div className='d-flex flex-column justify-content-center position-relative' style={{top:'40%'}}>
            <div className='text-center'><h5>setting private key</h5></div>
            <div><LoadingBalls /></div>
          </div>
        }
        {publicKeyLoading.confirming &&
          <div className='d-flex flex-column justify-content-center position-relative' style={{top:'40%'}}>
            <div className='text-center'><h5>wating to confirm private key</h5></div>
            <div><LoadingBalls /></div>
          </div>
        }
      </div>
    </div>
    }
    {stages.loading &&
      <div className='position-absolute w-100 h-100 d-flex justify-content-center align-items-center' style={{backgroundColor:"rgba(13,110,253,0.5)"}}>
        <div className='w-50 h-50 p-3' style={{background:'#020227',border:'7px double white',color:'white'}}>
          <div className='d-flex justify-content-center position-relative' style={{top:'30%'}}>
            {stages.approving && <h4>waiting to approve</h4>}
            {stages.confirming && <h4>waiting to confirm</h4>}
            {stages.confirmed && 
            <div className='d-flex flex-column'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>  
              <h4>Message Sent</h4>
            </div>
            }
          </div>
          {!stages.confirmed && <div className='d-flex justify-content-center position-relative' style={{top:'40%'}}><LoadingBalls /></div>}
        </div>
      </div>
    }
  </div>
  );
};

export default ContactUs;
