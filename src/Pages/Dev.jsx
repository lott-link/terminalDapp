import React, { useState, useEffect, useContext } from 'react'
import { useWeb3React } from "@web3-react/core";
import { context } from '../App';
import { registerContractABI } from '../Contracts/ContractsABI'
const Dev = () => {
  const { active, account, library, chainId } = useWeb3React()
  const data = useContext(context)
  const [hash,setHash] = useState("")
  const [error,setError] = useState({err:false,msg:""})
  const getURI = async ()=>{
    if(!active) return;
    if(!data.network) return;
    console.log("network",data.network)
    console.log("getting uri")
    try {
      const contract = new library.eth.Contract(registerContractABI,data.addresses[data.network]["register"])
      const tokenNumber = await contract.methods.tokenOf(account).call()
      const tokenURI = await contract.methods.tokenURI(tokenNumber).call()
      setHash(tokenURI.slice(tokenURI.lastIndexOf('/')+1,tokenURI.length))
      console.log(tokenNumber)
      console.log(tokenURI)
    }
    catch(err){
      console.log('something went wrong',err)
      setError({err:true,msg:err.message})
    }
  }
  useEffect(()=>{
    getURI()
  },[data.network])
  if(error.err) return (
    <div style={{wordBreak:'break-word'}}>{error.msg}</div>
  )
  return (
    <div className='w-100 h-100'>
        <iframe className='w-100 h-100' title='idCard'
        src={`https://ipfs.io/ipfs/bafybeidzqjl4ylls5lmx4iekdvx5eywh4cjqvlv3tyr56upobycfyqcg6y/build/?hash=${hash}`}
        frameBorder="0">
        </iframe>
    </div>
  )
}

export default Dev