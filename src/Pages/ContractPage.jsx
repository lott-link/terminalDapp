import React, { useState, useEffect } from 'react'
import { useWeb3React } from "@web3-react/core";
import { contractABI, contractAddress } from '../Contract/ContractInfo'
import { ProgressBar } from 'react-bootstrap';
const ContractPage = () => {
    const {activate,account,chainId,active,connector,library,deactivate} = useWeb3React()
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [sendInfoDisabled,setSendInfoDisabled] = useState(false)
    const [sendInfoLoading,setSendInfoLoading] = useState(false)
    const [userName,setUserName] = useState()
    const [loadingProfile,setLoadingProfile] = useState(false)
    const [input,setInput] = useState()
    const [infoFields,setInfoFields] = useState([])
    const [userInfo,setUserInfo] = useState()
    const [now,setNow] = useState(0)
    const [mode, setMode] = useState(0)
    const [error,setError] = useState()
    const estimatedTime = 15;
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
        const keys = values.map(item => item.key)
        if(!keys.includes(option)) {
            values.push({key:option,value:''})
            setInfoFields(values)
        }
    }
    const getInfoFieldsData = ()=>{
        const data = {}
        infoFields.forEach(item=>data[item.key] = item.value)
        return data;
    }
    //****** Contract Read methods start********/
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
      const getUserInfo = ()=>{
        const contract = new library.eth.Contract(contractABI,contractAddress)
        contract.methods.userInfo(account).call()
        .then(res=>{
            setUserInfo(res.info.trim())
            parseUserInfo(res.info)
            setButtonDisabled(false)
        })
        .catch(err=>setError("couldn't get user info"))
      }
    //****** Contract Read methods end ********/

    //****** Contract Write methods start ********/
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
    //****** Contract Write methods end********/
    useEffect(()=>{
        setInfoFields([])
        if(active){
          addressToUser(account)
        }
      },[active,account,chainId])
      useEffect(()=>{
        const interval = setInterval(()=>{
            let state;
            setNow(prev => state=prev)
            if(state+100/estimatedTime>=100){
                setNow(100)
                clearInterval(interval)
            }
            else
                setNow(prevState => Math.floor(prevState+100/estimatedTime))
        },1000)
      },[])
    return (
        <div className="w-100 h-100" style={{position:'relative'}}>
            <div className="px-4 d-flex align-items-center justify-content-between" style={{height:'5%',borderBottom:'2px solid white'}}>
                <div><span>&lt;</span> back</div>
                <div>Sign In</div>
                <div className="d-flex">
                    <div className="circle mx-1"></div>
                    <div className="circle"></div>
                </div>
            </div>
            <div style={{height:'80%'}} className="px-4 text-center">
                {active && userName && !userName.username && <div>
                    <button onClick={()=>setMode(0)} className="select-button" style={{backgroundColor:mode === 0 ? "#1919b8":"#020227",transition:'0.2s'}}>User</button>
                    <button onClick={()=>setMode(1)} className="select-button" style={{backgroundColor:mode === 1 ? "#1919b8":"#020227",transition:'0.2s'}}>Collector</button>
                </div>}
                {active && (userName && userName.username ? 
                    <div className="my-2">username:{userName.username}</div> : loadingProfile ? 
                        <div>loading...</div> : 
                            <div className="my-2">
                                {mode===0 &&<button style={{width:'4rem',border:'7px white double',padding:'5px'}}>__</button>}
                                <input style={{width:mode===0? '20rem' : '24rem'}} className="input text-center" placeholder="Enter username" type="text" onChange={e=>setInput(e.target.value)} value={input} />
                                <div><button style={{width:'24rem'}} className="m-2 contract-button" onClick={signIn} disabled={sendInfoDisabled} >
                                    sign in and setInfo
                                </button></div>
                                {sendInfoLoading && <span>loading...</span>}
                            </div>)}            
                <div className="my-2">{infoOptions.map((option,index)=><button className="mx-1" disabled={buttonDisabled} onClick={()=>addOptionInput(option)} key={index}>{option}</button>)}</div>
                {active && (!userInfo && <div>there is no info</div>)}
                <div className="container">
                    {infoFields.map((item,index)=>{
                        return (
                            <div key={index} className="row my-3">
                                <div className="col-2"></div>
                                <div className="col-2 d-flex justify-content-end align-items-center">{item.key}:</div>
                                <input placeholder={optionPlaceholder[item.key]} className="input col-4"  onChange={event=>handleInputChange(index,event)} name="value" value={item.value} type="text" />
                                <button className="col-1 mx-2" onClick={()=>handleRempveField(index)}>remove</button>
                            </div>
                        )
                    })}
                    {infoFields.length !== 0 && userName && userName.username && <div><button style={{width:'21rem'}} className="contract-button" disabled={sendInfoDisabled} onClick={sendInfo}>send info</button>{sendInfoLoading && <span>loading...</span>}</div>}
                    {error && 
                        <div>
                            <div>{error}</div>
                            <div><button>try again</button></div>
                        </div>
                    }
                </div>
                { (sendInfoLoading || loadingProfile) &&<div className="bg-primary w-100 h-100 d-flex jutfiy-content-center align-items-center" style={{position:'absolute',top:'0',left:'0', opacity:'50%'}}>
                    <h3 className="w-100 text-center">loading...</h3>
                </div>}
                {/* <div className="w-25" style={{background:'white'}}>
                    <div style={{width:now+"%",color:'white',backgroundColor:'lightgray',transition:'0.2s',fontSize:'smaller' }}>
                        <span className="d-flex justify-content-center">{`${now}%`}</span>
                    </div>
                </div> */}
            </div>
            <div className="p-3" style={{height:'15%',borderTop:'2px solid white'}}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam rem a incidunt tempore possimus, sapiente eos illo repudiandae non eveniet aperiam delectus minima itaque quod at rerum blanditiis! Dolorem, optio?
            </div>
        </div>
    )
}

export default ContractPage
