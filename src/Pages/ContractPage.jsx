import React, { useState, useEffect } from 'react'
import { useWeb3React } from "@web3-react/core";
import { contractABI, contractAddress } from '../Contracts/ContractInfo'
import Button from '../Components/styled/Button'
import Input from '../Components/styled/input';
import play from '../Assetes/play.svg'
const ContractPage = () => {
    const {activate,account,chainId,active,connector,library,deactivate} = useWeb3React()
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [sendInfoDisabled,setSendInfoDisabled] = useState(false)
    const [sendInfoLoading,setSendInfoLoading] = useState(false)
    const [userName,setUserName] = useState()
    const [loadingProfile,setLoadingProfile] = useState(false)
    const [input,setInput] = useState("")
    const [infoFields,setInfoFields] = useState([])
    const [userInfo,setUserInfo] = useState()
    const [now,setNow] = useState(0)
    const [mode, setMode] = useState(0)
    const [error,setError] = useState()
    const [signedIn,setSignedIn] = useState(false)
    const [payableAmount,setPayableAmount] = useState(0)
    const [presenter,setPresenter] = useState()
    const [loadingMsg,setLoadingMsg] = useState()
    const [estimatedTime,setEstimatedTime] = useState()
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
    const addressToUser = async (address)=>{
        setLoadingProfile(true)
        const web3 = library;
        const contract = new web3.eth.Contract(contractABI,contractAddress)
        const registered = await contract.methods.registered(account).call(res=>res)
        const getPayableAmount = await contract.methods.pureNameFee().call(res=>res)
        setPayableAmount(getPayableAmount)
        if(registered){
            contract.methods.addressToUsername(address).call()
            .then(res=>{
                setUserName(res)
                setSignedIn(true)
                setButtonDisabled(false)
                getUserInfo()
            })
            .catch(err=>console.log(err,"error in Address to user contractpage"))
            .finally(()=>setLoadingProfile(false))
        }else{
            setError("you are not signed in")
            setLoadingProfile(false)
            setSignedIn(false)
            setButtonDisabled(false)
        }
      }
      const getUserInfo = async ()=>{
        const contract = new library.eth.Contract(contractABI,contractAddress)
        const registered = await contract.methods.registered(account).call(res=>res)
        if(registered){
            contract.methods.addressToProfile(account).call()
            .then(res=>{
                setUserInfo(res.info.trim())
                parseUserInfo(res.info)
                setButtonDisabled(false)
                setError()
            })
            .catch(err=>console.log(err))
        }else{
            setError("you are not signed in")
            setButtonDisabled(false)
        }
      }
    //****** Contract Read methods end ********/

    //****** Contract Write methods start ********/
      const signIn = async ()=>{
        let date1,date2;
        setSendInfoLoading(true)
        setSendInfoDisabled(true)
        setLoadingMsg("Wating to approve")
        const contract = new library.eth.Contract(contractABI,contractAddress)
        const findUser = await contract.methods.userToAddr(input).call().then(res=>res)
        console.log(findUser)
        console.log(library.utils.hexToNumberString(findUser))
        if(library.utils.hexToNumberString(findUser)!== "0" ){
            setError("user already exists!")
            setSendInfoLoading(false)
            setSendInfoDisabled(false)
            setLoadingMsg()
        }else{
            let data = getInfoFieldsData()
            data = JSON.stringify(data).replaceAll("\"","\'")
            const value = mode === 0 ? 0 : payableAmount;
            console.log(input,JSON.stringify(data),presenter,value)
            contract.methods.signIn(input,JSON.stringify(data),presenter).send({from:account,value})
            .on("transactionHash",transactionHash=>{
                date1 = new Date().getTime()
                setLoadingMsg('Wating to comfirm')
                progress()
            })
            .on("receipt",receipt=>{
                date2 = new Date().getTime()
                setNow(0)
                setLoadingMsg()
                setSendInfoDisabled(false)
                setSendInfoLoading(false)
                postWaitingTime(date2-date1)
                getUserInfo()
                addressToUser(account)
            })
            .on("error",error=>{
                setLoadingMsg()
                setSendInfoDisabled(false)
                setSendInfoLoading(false)
                console.log("error in sending info",error)
            })
        }
      }
    const sendInfo = ()=>{
        let date1,date2;
        setSendInfoDisabled(true)
        setSendInfoLoading(true)
        setLoadingMsg("Wating to approve")
        let data = getInfoFieldsData()
        data = JSON.stringify(data).replaceAll("\"","\'")
        const contract = new library.eth.Contract(contractABI,contractAddress)
        contract.methods.setInfo(JSON.stringify(data)).send({from:account})
        .on("transactionHash",transactionHash=>{
            date1 = new Date().getTime()
            setLoadingMsg('Wating to comfirm')
            progress()
        })
        .on("receipt",receipt=>{
            date2 = new Date().getTime()
            setNow(0)
            setLoadingMsg()
            setSendInfoDisabled(false)
            setSendInfoLoading(false)
            postWaitingTime(date2-date1)
            addressToUser(account)
        })
        .on("error",error=>{
            setSendInfoDisabled(false)
            setSendInfoLoading(false)
            console.log("error in sending info",error)
        })
    }
    //****** Contract Write methods end********/
    const postWaitingTime = (time)=>{
        fetch('/estimatedtime',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({
                time:Math.floor(time/1000)
            })
        })
    }
    const getEstimatedTime = async ()=>{
        fetch('/estimatedtime')
        .then(res=>res.json())
        .then(data=>{
            setEstimatedTime(data.estimatedTime)
        })
    }
    const handleUserName = (e)=>{
        if(mode===0){
            if(e.target.value[0]!=='_')
                setInput("_"+e.target.value)
            else
                setInput(e.target.value)
        }
        else{
            setInput(e.target.value)
        }
    }
    useEffect(()=>{
        getEstimatedTime()
    },[])
    useEffect(()=>{
        setInput("")
    },[mode])
    useEffect(()=>{
        setInfoFields([])
        if(active){
          addressToUser(account)
        }
      },[active,account,chainId])
    const progress = ()=>{
        const interval = setInterval(()=>{
            let state;
            setNow(prev => state=prev)
            console.log(state)
            if(state+100/estimatedTime>=100){
                setNow(100)
                clearInterval(interval)
            }
            else
                setNow(prevState => Math.floor(prevState+100/estimatedTime))
        },1000)
    }
    if(!active)
        return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">please connect your wallet</h2>)
    else  
    return (
        <div className="w-100 h-100" style={{position:'relative'}}>
            <div className="px-4 d-flex align-items-center justify-content-between" style={{height:'5%',borderBottom:'2px solid white'}}>
                <div></div>
                <div>Sign In</div>
                <div className="d-flex">
                    <div className="circle mx-1"></div>
                    <div className="circle"></div>
                </div>
            </div>
            <div style={{height:'80%',overflowY:"auto"}} className="px-4 text-center">
                {active && !signedIn && <div>
                    <button onClick={()=>setMode(0)} className="select-button" style={{backgroundColor:mode === 0 ? "#1919b8":"#020227",transition:'0.2s'}}>_Regular</button>
                    <button onClick={()=>setMode(1)} className="select-button" style={{backgroundColor:mode === 1 ? "#1919b8":"#020227",transition:'0.2s'}}>Pure</button>
                </div>}
                {active && (signedIn ? 
                    <div className="my-2">username:{userName}</div> : loadingProfile ? 
                        <div>loading...</div> : 
                            <div className="my-2">
                                <div className="d-flex flex-column align-items-center">
                                        {/* <Input style={{width:'24rem'}} small={`enter a name${mode===0 ? ", it automatically start with _":""}`}
                                        value={input}  placeholder="Enter username" type="text" onChange={handleUserName} /> */}
                                        <Input style={{width:'24rem'}} small={`enter a name${mode===0 ? ", it automatically start with _":""}`}
                                        value={input}  title="Enter username" type="text" onChange={handleUserName} />
                                        <Input style={{width:"24rem"}} small="enter username of your presenter, as default Lott.Link" 
                                        title="presenter" type="text" onChange={e=>setPresenter(e.target.value)}/>
                                        <Input style={{width:"24rem"}} className="text-center my-1" type="text" disabled={true} value={`Payable Amount:${mode===0 ? "0":payableAmount}`} />
                                </div>
                                {sendInfoLoading && <span>loading...</span>}
                            </div>)
                }            
                <div className="my-2">{infoOptions.map((option,index)=><Button primary className="mx-1" disabled={buttonDisabled} onClick={()=>addOptionInput(option)} key={index}>{option}</Button>)}</div>
                
                {active && (infoFields.length===0 && <div>there is no info</div>)}
                <div className="container">
                    {infoFields.map((item,index)=>{
                        return (
                            <div key={index} className="d-flex justify-content-center my-3">
                                <div className=""></div>
                                <div style={{width:'13%'}} className=" d-flex justify-content-end align-items-center">{item.key}:</div>
                                <div>
                                    <Input style={{width:'24rem'}} title={optionPlaceholder[item.key]} className=""  onChange={event=>handleInputChange(index,event)} name="value" value={item.value} type="text" />
                                </div>
                                <div className="d-flex align-items-center"><Button primary  onClick={()=>handleRempveField(index)}>remove</Button></div>
                            </div>
                        )
                    })}
                    {/* button when user not signed in */}
                    { active && !signedIn && !loadingProfile &&
                        <div className="d-flex flex-column align-items-center">
                            <Button secondary style={{width:'24rem'}} className="" onClick={signIn} disabled={sendInfoDisabled} >
                            sign in and setInfo
                            </Button>
                        </div>
                    }
                    {/* button when user signed in and want to send info */}
                    {infoFields.length !== 0 && signedIn && <div><Button secondary style={{width:'272px'}} disabled={sendInfoDisabled} onClick={sendInfo}>send info</Button>{sendInfoLoading && <span>loading...</span>}</div>}
                    {error && 
                        <div>
                            <div className="text-danger">{error}</div>
                            {/* <div><button onClick={getUserInfo}>try again</button></div> */}
                        </div>
                    }
                </div>
                { (sendInfoLoading || loadingProfile) &&
                <div className="bg-primary w-100 h-100 d-flex flex-column justify-content-center align-items-center" style={{position:'absolute',top:'0',left:'0', opacity:'50%'}}>
                    {sendInfoLoading && loadingMsg==='Wating to comfirm' &&
                     <div className="w-25 my-2" style={{background:'white'}}>
                        <div style={{width:now+"%",color:"white",backgroundColor:'red',transition:'0.2s',fontSize:'smaller' }}>
                            <span className="d-flex ejustify-content-center">{`${now}%`}</span>{console.log(now)}
                        </div>
                    </div> }
                    <h3 className="w-100 text-center">{sendInfoLoading ? loadingMsg : "loading"}...</h3>
                </div>}
            </div>
            <div className="p-3" style={{height:'15%',borderTop:'2px solid white',overflow:'auto'}}>
            this contract mint a unique username on your wallet address to easily named you on other contract. you can set your contact info optionaly. other people can see your info. _reqular user name are free and pure user name are payble.
            </div>
        </div>
    )
}

export default ContractPage
