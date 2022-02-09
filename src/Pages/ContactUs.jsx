import React, { useState, useEffect, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { encrypt } from 'eth-sig-util'

import Input from '../Components/styled/input';
import Button from '../Components/styled/Button';
import { messengerABI } from '../Contracts/ContractsABI';
import { context } from '../App'

const ContactUs = () => {
  const { library, account, active, chainId } = useWeb3React()
  const data = useContext(context)
//   const [encryptedData,setEncryptedData] = useState()
  const [msg,setMsg] = useState("")
  const [to,setTo] = useState("")
  const [subject,setSubject] = useState()
  const [disablePrivateMsg,setDisablePrivateMsg] = useState(false)
  const [ownPublicKey,setOwnPublicKey] = useState()
  const [receiverPublicKey,setReceiverPublicKey] = useState()
  const reqPublicKey = async ()=>{
    // requesting for public key
    const publicEncryptionKey = await window.ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [account],
    });
    console.log("this is public key:",publicEncryptionKey)
    setPublicKey(publicEncryptionKey)
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
        if(publicKey) {
            setOwnPublicKey(true)
            return publicKey
        } 
        else {
            setOwnPublicKey(false)
            return false
        } 
      }
      catch(err){
          console.log(err)
      }
  }
  const setPublicKey = async (publicKey)=>{
    if(!active) return;
    try {
        const contract = new library.eth.Contract(messengerABI,data.addresses[data.network]['messenger'])
        contract.methods.setPublicKey(publicKey).send({from:account}) 
    }
    catch(err) {
        console.log(err)
    }
  }
  const sendMessage = async (method)=>{
    if(!active) return;
    try {
        let msgToSend = {}
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
    getPublicKey()
  },[active,chainId,data.network])
  useEffect(()=>{
    if( ownPublicKey === false ) {
        //notification for enabling public address
        const ans = prompt("it seems your private message haven't activated yet.\nwanna enable private message?(yes/no)")
        console.log(ans)
        if(ans === "yes") reqPublicKey()
    }
  },[ownPublicKey])
  return (
  <div className='d-flex flex-column justify-content-center align-items-center'>
    <div><Input title="To" onChange={handleChangeAddress}/></div>
    <div><Input title="Subject" onChange={(e)=>setSubject(e.target.value)} /></div>
    <div style={{position:'relative'}}>
        <label htmlFor="" className='px-3' onChange={(e)=>setMsg(e.target.value)}
        style={{position:'absolute',background:'#020227',top:'-10px',left:"20px"}}>
            Message
        </label>
        <textarea name="" id="" cols="30" rows="10" className='p-2' onChange={(e)=>setMsg(e.target.value)}
        style={{background:'#020227',border:'7px double white',color:'white'}}>
        </textarea>
    </div>
    <div>
        <Button disabled={disablePrivateMsg} onClick={()=>sendMessage('private')}>Send Private Message</Button>
        <Button onClick={()=>sendMessage('public')}>Send Public Message</Button>
    </div>
  </div>
  );
};

export default ContactUs;
