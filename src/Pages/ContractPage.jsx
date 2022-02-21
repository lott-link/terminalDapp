import React, { useState, useEffect ,useRef, useContext } from 'react'
import domtoimage from 'dom-to-image';
import { useWeb3React } from "@web3-react/core";
import { factoryContractAddress } from '../Contracts/ContractAddress'
import { factoryContractABI, registerContractABI } from '../Contracts/ContractsABI'
import Button from '../Components/styled/Button'
import Input from '../Components/styled/input';
import { OverlayTrigger, Tooltip} from 'react-bootstrap'
import { context } from '../App';
import { create } from 'ipfs-http-client'
import QrCode from '../Components/QrCode';
import useWidth from '../Hooks/useWidth';

const client = create('https://ipfs.infura.io:5001/api/v0')
const ContractPage = () => {
    const {account,chainId,active,library} = useWeb3React()
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [sendInfoDisabled,setSendInfoDisabled] = useState(false)
    const [sendInfoLoading,setSendInfoLoading] = useState(false)
    const [userName,setUserName] = useState()
    const [loadingProfile,setLoadingProfile] = useState(false)
    const [input,setInput] = useState("")
    const [infoFields,setInfoFields] = useState([])
    const [now,setNow] = useState(0)
    const [error,setError] = useState()
    const [signedIn,setSignedIn] = useState(false)
    const [payableAmount,setPayableAmount] = useState(0)
    const [referral,setReferral] = useState("")
    const [loadingMsg,setLoadingMsg] = useState()
    const [userValid,setUserValid] = useState(false)
    const [showQr,setShowQr] = useState(false)
    const [availableChains,setAvailableChains] = useState([])
    const [label,setLabel] = useState("")
    const data = useContext(context)
    const width = useWidth()
    const estimatedTime = 15;
      const parseUserInfo = (info)=>{
        if(info){
            let data = info.replaceAll("\'","\"")
            data = JSON.parse(data.slice(1,data.length-1))
            const fields = []
            for(const key in data)
                fields.push({key,value:data[key]})
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
    const infoOptions = ['Telegram', 'Phone number', 'Email','Website','Facebook','Instagram']
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
    // const hanleOption = (option)=>{
    //     const index = infoFields.findIndex(item=>item.key.toLowerCase() === option.toLowerCase())
    //     addOptionInput(option)
    //     if(index!==-1) handleRempveField(index)
    // }
    //****** Contract Read methods start********/
    const addressToUser = async (address)=>{
        setLoadingProfile(true)
        const factoryContract = new library.eth.Contract(factoryContractABI,factoryContractAddress)
        const contractAddress = await factoryContract.methods.registerContract().call(res=>res)
        const registerContract = new library.eth.Contract(registerContractABI,contractAddress)
        const registered = await registerContract.methods.registered(account).call(res=>res)
        const getPayableAmount = await registerContract.methods.pureNameFee().call(res=>res)
        setPayableAmount(getPayableAmount)
        if(registered){
            registerContract.methods.addressToUsername(address).call()
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
        const factoryContract = new library.eth.Contract(factoryContractABI,factoryContractAddress)
        const contractAddress = await factoryContract.methods.registerContract().call(res=>res)
        const registerContract = new library.eth.Contract(registerContractABI,contractAddress)
        const registered = await registerContract.methods.registered(account).call(res=>res)
        if(registered){
            registerContract.methods.addressToProfile(account).call()
            .then(res=>{
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
        setSendInfoLoading(true)
        setSendInfoDisabled(true)
        setShowQr(true)
        const baseUrl = "https://ipfs.infura.io/ipfs/"
        console.log("creating and uploading qr image")
        setLoadingMsg("creating and uploading id card")
        //creating qr image
        const blob = await domtoimage.toBlob(qr.current)
        const qrImage = await client.add(blob)
        setShowQr(false)
        console.log("creating and uploading uri object")
        setLoadingMsg("creating and uploading uri object")
        //creating uri object
        const obj = {
            image:baseUrl + qrImage.path,
            name:input.split("@")[0],
            attributes:[{trait_type:"dapp",value:"tapp v1.0"},{trait_type:"time",value:new Date().getTime()}],
            interaction:interaction
        }
        const uri = await client.add(JSON.stringify(obj))

        console.log("creating and uploading info hash")
        //creating info hash
        let tempData = getInfoFieldsData()
        tempData = JSON.stringify(tempData).replaceAll("\"","\'")
        const infoHash = await client.add(JSON.stringify(tempData));
        

        setLoadingMsg("Wating to approve")
        const registerContract = new library.eth.Contract(registerContractABI,data.addresses[data.network]["register"])
        // const findUser = await registerContract.methods.userToAddr(input).call().then(res=>res)
        // if(library.utils.hexToNumberString(findUser)!== "0" ){
        //     setError("user already exists!")
        //     setSendInfoLoading(false)
        //     setSendInfoDisabled(false)
        //     setLoadingMsg()
        // }else{
            // let data = getInfoFieldsData()
            // data = JSON.stringify(data).replaceAll("\"","\'")
            registerContract.methods.signIn(input.split("@")[0],baseUrl+infoHash.path,referral,0,baseUrl+uri.path).send({from:account,value:payableAmount})
            .on("transactionHash",transactionHash=>{
                setLoadingMsg('Wating to comfirm')
                progress()
            })
            .on("receipt",receipt=>{
                setNow(0)
                setLoadingMsg()
                setSendInfoDisabled(false)
                setSendInfoLoading(false)
                // getUserInfo()
                // addressToUser(account)
            })
            .on("error",error=>{
                setLoadingMsg()
                setSendInfoDisabled(false)
                setSendInfoLoading(false)
                console.log("error in sending info",error)
            })
        // }
      }
    const sendInfo = async ()=>{
        setSendInfoDisabled(true)
        setSendInfoLoading(true)
        setLoadingMsg("Wating to approve")
        let data = getInfoFieldsData()
        data = JSON.stringify(data).replaceAll("\"","\'")
        const factoryContract = new library.eth.Contract(factoryContractABI,factoryContractAddress)
        const contractAddress = await factoryContract.methods.registerContract().call(res=>res)
        const registerContract = new library.eth.Contract(registerContractABI,contractAddress)
        registerContract.methods.setInfo(JSON.stringify(data)).send({from:account})
        .on("transactionHash",transactionHash=>{
            setLoadingMsg('Wating to comfirm')
            progress()
        })
        .on("receipt",receipt=>{
            setNow(0)
            setLoadingMsg()
            setSendInfoDisabled(false)
            setSendInfoLoading(false)
            // addressToUser(account)
        })
        .on("error",error=>{
            setSendInfoDisabled(false)
            setSendInfoLoading(false)
            console.log("error in sending info",error)
        })
    }
    //****** Contract Write methods end********/
    const handleUserName = async (e)=>{
        // setInput(e.target.value.split("@")[0] + "@" + data.converChainIDToName(chainId))
        setInput(e.target.value)
        const contract = new library.eth.Contract(registerContractABI,data.addresses[data.network]["register"])
        
        // contract.methods.usernamePrice(e.target.value.split("@")[0]).call().then(res=>{
        contract.methods.usernamePrice(e.target.value).call().then(res=>{
            setPayableAmount(res) 
            setUserValid(true)
        })
        .catch(err=>{
            console.log(err)
            setUserValid(false)
        })
    }
    useEffect(()=>{
        setInfoFields([])
        if(active){
        //   addressToUser(account)
        }
      },[active,account,chainId])
    const progress = ()=>{
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
    }
    useEffect(()=>{
        setLabel("@" + data.converChainIDToName(chainId))
    },[chainId])

    useEffect(()=>{
        const tempChains = []
        for(let key in data.addresses){
            if(data.addresses[key].register && data.addresses[key].register.length!==0)
                tempChains.push(key)
        }
        setAvailableChains(tempChains)
    },[])

    const qr = useRef(null)

    if(!active)
        return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">please connect your wallet</h2>)
    else if(!data.pageSupported) 
        return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">Chain not supported</h2>)
    else
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
</svg>
    return (
        <div className="w-100 h-100" style={{position:'relative'}}>
            <div className={`px-4 d-flex align-items-center justify-content-between`} style={{height:'5%',borderBottom:'2px solid white'}}>
                <div></div>
                <div>Sign In</div>
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
            <div style={{height:'70vh',overflowY:"auto"}} className={`${width > 600 && "px-4"} text-center`}>
                {active && (signedIn ? 
                    <div className="my-2">username:{userName}</div> : loadingProfile ? 
                        <div>loading...</div> : 
                            <div className="my-2">
                                <div className="d-flex flex-column align-items-center position-relative w-100">
                                    <Input style={{width:width>600 ?'24rem':"20rem",paddingRight:'7rem'}} small={`enter a name`} success={userValid ? "success" : "failure"}
                                    value={input}  title="Enter username" type="text" onChange={handleUserName} />
                                    {input.length !== 0 && <div className='position-relative' style={{top:'-3.2rem',left:"9rem"}}><label htmlFor="">{label}</label></div>}
                                    <Input style={{width:width>600 ?"24rem":"20rem"}} small="enter username of your referral, as default Lott.Link" 
                                    value={referral} title="referral" type="text" onChange={e=>setReferral(e.target.value)}/>
                                </div>
                                {sendInfoLoading && <span>loading...</span>}
                            </div>)
                }            
                {active && (infoFields.length===0 && <div>there is no info</div>)}
                <div className={`${width > 600 && "container"}`}>
                    {infoFields.map((item,index)=>{
                        return (
                            <div key={index} className="d-flex justify-content-center align-items-center">
                                <div>
                                    <Input style={{width:width>600 ?'16.5rem':"12.5rem"}} title={item.key.slice(0,1).toUpperCase()+item.key.slice(1,item.key.length)} className=""  onChange={event=>handleInputChange(index,event)} name="value" value={item.value} type="text" />
                                </div>
                                <div onClick={()=>handleRempveField(index)}>
                                    <Button>Remove</Button>
                                </div>
                            </div>
                        )
                    })}
                    {/* button when user not signed in */}
                     <div className="my-2 mx-auto" style={{width:width>600 ?'24rem':"20rem"}}>
                         {infoOptions.map((option,index)=><Button primary className="mx-1" disabled={buttonDisabled} onClick={()=>addOptionInput(option)} key={index}>{option}</Button>)}
                    </div>
                    { active && !signedIn && !loadingProfile &&
                    <div className="d-flex flex-column align-items-center mx-auto" style={{width:width>600 ?'26rem':"20rem"}}>
                        <div className="bg-white text-dark d-flex justify-content-around align-items-center w-100" style={{margin:"0 40px"}}>
                            <div className='d-flex '>
                                <OverlayTrigger  placement={"bottom"}  overlay={<Tooltip >{payableAmount} wei</Tooltip>}>
                                    <div className="mx-4">{(payableAmount/1e18).toFixed(4)}</div>
                                </OverlayTrigger>
                                <div>
                                    <img  style={{width:'25px',weight:'25px'}}
                                    src={data.network && data.chains[data.network].icon} alt="" />
                                </div>
                            </div>
                            <div>
                                <Button secondary style={{width:width>600 ?'16rem' :"12rem"}} className="" onClick={signIn} disabled={sendInfoDisabled} >
                                sign in and setInfo
                                </Button>
                            </div>
                        </div>
                    </div>
                    }
                    {/* button when user signed in and want to send info */}
                    {infoFields.length !== 0 && signedIn && 
                    <div className="d-flex flex-column align-items-center">  
                        <div>
                            <Button secondary style={{width:'222px'}} disabled={sendInfoDisabled} onClick={sendInfo}>
                            send info
                            </Button>
                        </div>{sendInfoLoading && <span>loading...</span>}
                    </div>
                    }
                    {error && 
                        <div>
                            <div className="text-danger">{error}</div>
                        </div>
                    }
                </div>
                { (sendInfoLoading  || loadingProfile) &&
                <   div className="w-100 h-100 d-flex flex-column " style={{position:'absolute',top:'0',left:'0', backgroundColor:"rgba(2,117,216,0.5)"}}>
                    {sendInfoLoading && loadingMsg==='Wating to comfirm' &&
                     <div className="w-25 my-2" style={{background:'white',position:'relative',top:'20%',left:'35%'}}>
                        <div style={{width:now+"%",color:"white",backgroundColor:'red',transition:'0.2s',fontSize:'smaller' }}>
                            <span className="d-flex ejustify-content-center">{`${now}%`}</span>
                        </div>
                    </div> 
                    }
                    <div className="w-100 text-center" style={{position:'relative',top:'20%'}}>
                        <h3>{sendInfoLoading ? loadingMsg : "loading"}...</h3>
                        <div className='d-flex justify-content-center mt-4'>
                    </div>
                    </div>
                </div>
                }
                <div className='d-flex justify-content-center mt-4' style={{position:"absolute",top:'30%',left:width > 600 ? '32%':"0",zIndex:showQr?1:-1}}>
                    {chainId === 43113 &&
                         <QrCode profile="/avalanche.svg" background="avalanche" qr={qr} text={input}
                        firstColor="#8E292F" secondColor="#F35C64"  data={"https://lott.link/"+ input + "/" }
                        rotation="90"/>
                    }
                    {chainId === 4 &&
                        <QrCode profile="/eth.svg" background="eth" qr={qr} text={input} 
                        firstColor="#7F7F7F" secondColor="#010101"  data={"https://lott.link/"+ input + "/" }
                        rotation="225"/>
                    }
                </div>
            </div>
            <div className="p-3" style={{borderTop:'2px solid white',overflow:'auto',position:'relative',bottom:'0'}}>
            this contract mint a unique username on your wallet address to easily 
            named you on other contract. you can set your contact info optionaly.
             other people can see your info. 
            _reqular user name are free and pure user name are payble.
            </div>
        </div>
    )
}

export default ContractPage


const interaction = {
    read:[
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "userId",
                    "type": "uint256"
                }
            ],
            "name": "balanceInWei",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        } 
    ],
    write:[
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
}
