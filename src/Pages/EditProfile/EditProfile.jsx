import React, { useEffect, useContext, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import { OverlayTrigger, Tooltip} from 'react-bootstrap'
import { create } from 'ipfs-http-client'

import { signinABI } from './EditProfileABI'
import { context } from '../../App'
import { checkLink } from '../../addresses'
import Button from '../../Components/styled/Button'
import Input from '../../Components/styled/input'
import useWidth from '../../Hooks/useWidth';
import LoadingBalls from '../../Components/LoadingBalls'

const client = create('https://ipfs.infura.io:5001/api/v0')

const EditProfile = () => {
  const { active, account, library } = useWeb3React()
  const data = useContext(context)
  const width = useWidth()  
  const [registered,setRegistered] = useState(true)
  const [metadata,setMetadata] = useState(null)
  const [availableChains,setAvailableChains] = useState([])
  const [loading,setLoading] = useState(true)
  const [username,setUsername] = useState("")
  const [tokenID,setTokenID] = useState("")
  const [txLoading,setTxLoading] = useState(false)
  const [infoOptions,setInfoOptions] = useState(['Telegram', 'Phone number', 'Email',
  'Website','Facebook','Instagram','Linkedin','Discord'])
  const [infoFields,setInfoFields] = useState([])
  const addOptionInput = (option,value="")=>{
    const values = [...infoFields]
    const keys = values.map(item => item.key)
    if(!keys.includes(option)) {
        // values.push({key:option,value})
        setInfoFields(prev=> [...prev,{key:option,value}])
        setInfoOptions(prev => prev.filter(item=>item !== option))
    }
  }
  const handleRemoveField = (index,item) =>{
    console.log(item)
    const values = [...infoFields]
    values.splice(index,1)
    setInfoFields(values)
    setInfoOptions(prev=>[...prev,item.key])
  }
  const getInfoFieldsData = ()=>{
    const data = {}
    infoFields.forEach(item=>data[item.key] = item.value)
    return data;
  }
  const handleInputChange = (index,event)=>{
    const values = [...infoFields]
    if(event.target.name === 'key')
        values[index].key = event.target.value;
    else 
        values[index].value = event.target.value;
    setInfoFields(values)
  }
  const updateInfo = async ()=>{
    if(!active || !data.network) return;
    try{
      setTxLoading(true)
      const profile = getInfoFieldsData()
      console.log("metadata",metadata)
      const baseUrl = "ipfs://"
      const tempMetadata = {...metadata,profile}
      const hash = await client.add(JSON.stringify(tempMetadata))
      const contract = new library.eth.Contract(signinABI,data.addresses[data.network]["register"])
      contract.methods.setTokenURI(tokenID,baseUrl + hash.path).send({from:account})
      .on("receipt",receipt=>{
        setTxLoading(false)
      })
      .on("error",error=>{
        setTxLoading(false)
      })
    }
    catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    (async()=>{
      if(!active || !data.network) return;
      try {
        const contract = new library.eth.Contract(signinABI,data.addresses[data.network]["register"])
        const userID = await contract.methods.primaryToken(account).call()
        console.log(userID)
        if(userID === "0") {
          setRegistered(false)
          setLoading(false)
          return
        }
        setTokenID(userID)
        const tokenURI = await contract.methods.tokenURI(userID).call()
        console.log(tokenURI)
        const username = await contract.methods.username(userID).call()
        setUsername(username)
        console.log("username",username)
        const metadata = await (await axios.get(checkLink(tokenURI))).data
        console.log(metadata)
        setMetadata(metadata)
        Object.entries(metadata.profile).forEach(item=>{
          addOptionInput(item[0],item[1])
        })
        setLoading(false)
      }
      catch(err){
        console.log(err)
      }
    })()
  },[data.network])
  useEffect(()=>{
    const tempChains = []
    for(let key in data.addresses){
        if(data.addresses[key].register && data.addresses[key].register.length!==0)
            tempChains.push(key)
    }
    setAvailableChains(tempChains)
  },[])
  if(loading)
    return (
      <div className='w-100 h-100'>
        <LoadingBalls style={{position:'absolute',top:'50%',left:'60%'}}/>
      </div>
    )
  if(!registered)
    return (
      <div className="w-100 h-100 d-flex justify-content-center align-items-center">
        <h1>You Are Not Registered</h1>
      </div>
    )
  return (
    <div className='w-100 h-100 justify-content-center' style={{position:'relative'}}>{console.log("infoFields",infoFields)}
      <div className={`px-4 d-flex align-items-center justify-content-between`} style={{height:'5%',borderBottom:'2px solid white'}}>
          <div></div>
          <div>Edit Profile</div>
          <div className="d-flex">
          {
          availableChains.map((chain,index)=> (
              <OverlayTrigger key={index} placement={"bottom"}  overlay={<Tooltip >{chain}</Tooltip>}>
              <div className="mx-1">
                  <a href={data.chains[chain].params[0].blockExplorerUrls[0]+"/"+"address"+"/"+data.addresses[chain].register}
                      target="_blank" rel="noreferrer"
                  >
                      <img style={{width:'20px',height:'20px'}} src={data.chains[chain].icon} alt={chain+"icon"} />  
                  </a>
              </div>
              </OverlayTrigger>
              )
          )
          }
          </div>
      </div>
      <div className='w-100 d-flex justify-content-center my-3'>username:{username}</div>
      <div className='flex mt-4 flex-wrap justify-contetn-center align-items-center mx-auto w-75'>
        {infoFields.map((item,index)=>{
            return (
                <div key={index} className="d-flex justify-content-center align-items-center">
                    <div>
                        <Input style={{width:width>600 ?'16.5rem':"12.5rem"}} title={item.key.slice(0,1).toUpperCase()+item.key.slice(1,item.key.length)} className=""  onChange={event=>handleInputChange(index,event)} name="value" value={item.value} type="text" />
                    </div>
                    <div onClick={()=>handleRemoveField(index,item)}>
                        <Button>Remove</Button>
                    </div>
                </div>
            )
        })}
      </div>
      <div className='flex flex-wrap justify-contetn-center align-items-center mx-auto w-75'>
        {
          infoOptions.map((option,key)=>(
            <Button onClick={()=>addOptionInput(option)} secondary key={key}>{option}</Button>
          ))
        }
      </div>
      {txLoading &&
      <div className="d-flex flex-column w-100 h-100" style={{position:'absolute',top:'0',backgroundColor:"rgba(2,117,216,0.5)"}}>
        <LoadingBalls style={{position:'absolute',top:'50%',left:'45%'}} />
      </div>
      }
      <div className='d-flex justify-content-center'>
        <Button secondary style={{width:'14rem'}} onClick={updateInfo}>Update</Button>
      </div>
    </div>
  )
}

export default EditProfile