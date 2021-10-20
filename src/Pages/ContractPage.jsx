import React, { useState, useEffect } from 'react'
import { useWeb3React } from "@web3-react/core";
import { contractABI, contractAddress } from '../Contract/ContractInfo'
import { useHistory } from 'react-router';
const ContractPage = () => {
    const {activate,account,chainId,active,connector,library,deactivate} = useWeb3React()
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [sendInfoDisabled,setSendInfoDisabled] = useState(false)
    const [sendInfoLoading,setSendInfoLoading] = useState(false)
    const [userName,setUserName] = useState()
    const [loadingProfile,setLoadingProfile] = useState(false)
    const [input,setInput] = useState()
    const [infoFields,setInfoFields] = useState([])
    const signIn = ()=>{
        setSendInfoLoading(true)
        setSendInfoDisabled(true)
        let data = getInfoFieldsData()
        data = JSON.stringify(data).replaceAll("\"","\'")
        window.contract.methods.signIn(input,JSON.stringify(data)).send({from:account})
        .then(res => console.log(res))
        .catch(err=> console.log(err,"err in signIn"))
        .finally(()=>{
            setSendInfoLoading(false)
            setSendInfoDisabled(false)
        })
      }
      const [userInfo,setUserInfo] = useState()
      const getUserInfo = ()=>{
        const contract = new library.eth.Contract(contractABI,contractAddress)
        contract.methods.userInfo(account).call()
        .then(res=>{
            setUserInfo(res.info.trim())
            parseUserInfo(res.info)
            setButtonDisabled(false)
        })
      }
      const parseUserInfo = (info)=>{
        if(info){
            let data = info.replaceAll("\'","\"")
            data = JSON.parse(data.slice(1,data.length-1))
            const fields = []
            for(const key in data){
                if (infoOptions.includes(key)){
                    fields.push({key,value:data[key]})
                }
            }
            setInfoFields(fields)
        }
      }
    const handleInputChange = (index,event)=>{
        const values = [...infoFields]
        if(event.target.name === 'key')
            values[index].key = event.target.value;
        else 
            values[index].value = event.target.value;
        setInfoFields(values)
    }
    const handleAddField = ()=>{
        const values = [...infoFields]
        values.push({key:'',value:''})
        setInfoFields(values)
    }
    const handleRempveField = index =>{
        const values = [...infoFields]
        values.splice(index,1)
        setInfoFields(values)
    }
    const infoOptions = ['telegram', 'phone number', 'email']
    const optionPlaceholder = {
        telegram:"Enter telegram id",
        'phone number':"Enter phone number",
        email:'Enter email address'
    }
    const addOptionInput = (option)=>{
        const values = [...infoFields]
        values.push({key:option,value:''})
        setInfoFields(values)
    }
    const getInfoFieldsData = ()=>{
        const data = {}
        infoFields.forEach(item=>data[item.key] = item.value)
        return data;
    }
    
    const addressToUser = (address)=>{
        setLoadingProfile(true)
        const web3 = library;
        const contract = new web3.eth.Contract(contractABI,contractAddress)
        contract.methods.addrToUser(address).call()
        .then(res=>{
            setUserName(res)
            setButtonDisabled(false)
            getUserInfo()
        })
        .catch(err=>console.log(err,"error in Address to user contractpage"))
        .finally(()=>setLoadingProfile(false))
      }
    useEffect(()=>{
        if(active){
          addressToUser(account)
        }
      },[active,account,chainId])
    const sendInfo = ()=>{
        setSendInfoDisabled(true)
        setSendInfoLoading(true)
        let data = getInfoFieldsData()
        data = JSON.stringify(data).replaceAll("\"","\'")
        const contract = new library.eth.Contract(contractABI,contractAddress)
        contract.methods.setInfo(JSON.stringify(data)).send({from:account})
        .then(res=>console.log(res))
        .catch(err => console.log(err,"err in sending info"))
        .finally(()=>{
            setSendInfoDisabled(false)
            setSendInfoLoading(false)
        })
    }
    return (
        <div className="w-100 h-100 p-4">
            {active && (userName && userName.username ? <div>username:{userName.username}</div> : loadingProfile ? <div>loading...</div> : <div className="my-2"><input className="input" placeholder="Enter username" type="text" onChange={e=>setInput(e.target.value)} /><button className="mx-2" onClick={signIn} disabled={sendInfoDisabled} >sign in and setInfo</button>{sendInfoLoading && <span>loading...</span>}</div>)}            
             {/* <input className="input" placeholder="Enter username" type="text" onChange={e=>setInput(e.target.value)} /> */}
            {/* <button className="mx-2" onClick={signIn} >sign in</button> */}
            <div>{infoOptions.map((option,index)=><button className="mx-1" disabled={buttonDisabled} onClick={()=>addOptionInput(option)} key={index}>{option}</button>)}</div>
            {active && (userInfo ? <div>{userInfo}</div> : <div>there is no info</div>)}
            <div>
                {infoFields.map((item,index)=>{
                    return (
                        <div key={index} className="row my-3">
                            {/* <input onChange={event=>handleInputChange(index,event)} name="key" value={item.key} type="text" /> */}
                            <div className="col-2 ">{item.key}:</div>
                            <input placeholder={optionPlaceholder[item.key]} className="input col-4"  onChange={event=>handleInputChange(index,event)} name="value" value={item.value} type="text" />
                            {/* <button onClick={()=>handleAddField()}>+</button> */}
                            <button className="col-1 mx-2" onClick={()=>handleRempveField(index)}>-</button>
                        </div>
                    )
                })}
                {infoFields.length !== 0 && userName && userName.username && <div><button disabled={sendInfoDisabled} onClick={sendInfo}>send info</button>{sendInfoLoading && <span>loading...</span>}</div>}
            </div>
            <pre>
                {infoFields.length !== 0 && JSON.stringify(infoFields,null,2)}
            </pre>
        </div>
    )
}

export default ContractPage
