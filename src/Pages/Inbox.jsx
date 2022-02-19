import React, { useState, useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { useHistory } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { useLocation } from "react-router-dom";
import { OverlayTrigger, Tooltip} from 'react-bootstrap'

import { context } from "../App";
import Button from '../Components/styled/Button'
import styles from './chanceRoomList.module.css'
import ContactUs from "./ContactUs";
import useWidth from "../Hooks/useWidth";

const Inbox = ()=>{
    return (
    <>
    <Route path="/inbox" exact={true} component={InboxPage} />
    <Route path="/inbox/message" component={Message} />
    <Route path="/inbox/newmessage" component={ContactUs} />
    </>
    );
}
export default Inbox


const InboxPage = () => {
	const { library, account, active } = useWeb3React();
    const history = useHistory();
    const [logs,setLogs] = useState([])
    const [allMsgs,setAllMsgs] = useState([])
    const [sentMessages,setSentMessages] = useState([])
    const [selectedBtn,setSelectedBtn] = useState(0)
    const [availableChains,setAvailableChains] = useState([])
    const [loadingTable,setLoadinTable] = useState(true)
	const data = useContext(context);
    const width = useWidth()
	const getLogs = async () => {
		if (!data.network) return;
       
        setLoadinTable(true)

        const res = await axios
            .get(data.addresses[data.network].logAPI + data.addresses[data.network].messenger)
            .then((res) => res);
        console.log(res);
        const tempLogs = [];
        const tempSentMessages = [];

        res.data.result.forEach((item) => {
            try {
                const result = library.eth.abi.decodeLog(typesArr, item.data);

                result.timeStamp = library.utils.hexToNumber(item.timeStamp) * 1000

                const tempMessage = JSON.parse(result.message.replaceAll("\'","\"")); 
                result.isHashed = tempMessage.isHashed;
                result.msg = tempMessage.msg;
                if(result.to === account){
                    tempLogs.push(result);
                }
                if(result.from === account){
                    tempSentMessages.push(result)
                }
            }
            catch(err) {
                console.log(err)
            }
        });
        console.log(tempLogs);
        setLogs(tempLogs)
        setAllMsgs(tempLogs)
        setSentMessages(tempSentMessages)

        setLoadinTable(false)
        
	};
	useEffect(() => {
		getLogs();
	}, [data.network]);
    useEffect(()=>{
        const tempChains = []
        for(let key in data.addresses){
            if(data.addresses[key].messenger && data.addresses[key].messenger.length!==0)
                tempChains.push(key)
        }
        setAvailableChains(tempChains)
    },[])
    const getDate = (timeStamp)=>{
        const date = new Date(timeStamp)
        if(width > 600) 
            return date.getFullYear() + '/' + (+date.getMonth()+1) + '/' + date.getDate()
        else
            return (+date.getMonth()+1) + '/' + date.getDate()
    }
    const getTime = (timeStamp)=>{
        const date = new Date(timeStamp)
        return date.getHours() + ':' + date.getMinutes()
    }
    if(!active)
        return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">please connect your wallet</h2>)
    else if(!data.pageSupported) 
        return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">Chain not supported</h2>)
    else
	return (
    <div className="w-100" style={{ height: "calc(100vh - 7.5rem)" }}>{console.log(logs)}

        <div className='d-flex justify-content-between py-2' style={{borderBottom:"1px solid white"}}>
            <div style={{cursor:"pointer"}} className='mx-4 my-auto'>{/*don't delete this div */}</div>
            <div className='my-auto'>Messenger</div>
            <div className='d-flex' style={{paddingRight:'10px'}}>
            {
            availableChains.map((chain,index)=> (
                <OverlayTrigger key={index} placement={"bottom"}  overlay={<Tooltip >{chain}</Tooltip>}>
                <div className="mx-1">
                    <a href={data.chains[chain].params[0].blockExplorerUrls[0]+"address"+"/"+data.addresses[chain].messenger}
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

    <div className="text-center mt-3">
        <Button secondary={selectedBtn === 0} primary={selectedBtn !== 0} className="mx-2" onClick={()=>{setLogs(allMsgs);setSelectedBtn(0)}}>received messages</Button>
        <Button secondary={selectedBtn === 1} primary={selectedBtn !== 1} className="mx-2" onClick={()=>{setLogs(sentMessages);setSelectedBtn(1)}}>sent messages</Button>
    </div>
    <div className={`w-100 d-flex justify-content-center ${width > 600 && "container"}`} style={{overflowY:'auto',maxHeight:'70%'}}>
        <table className="w-100">
            <thead>
                <tr className={`${styles.tr} ${styles.head}`}>
                    <th>#</th>
                    <th>from</th>
                    <th>subject</th>
                    <th>msg</th>
                    <th>time</th>
                    <th>action</th>
                </tr>
            </thead>
            <tbody>
                {
                logs.map((message,index)=>(
                <tr key={index} className={styles.tr} style={{cursor:'pointer'}} 
                onClick={()=>history.push({pathname:"/inbox/message",state:message})} >
                    <td>{index+1}</td>
                    <td><strong>{width > 600 ? message.to.slice(0,5)+"..."+message.to.slice(-5):message.to.slice(0,2)+"."+message.to.slice(-2)}</strong></td>
                    <td>{message.subject}</td>
                    <td>{width > 600 ? (message.msg && message.msg.length > 30 ? message.msg.slice(0,30) : message.msg) : (message.msg && message.msg.length > 5 ? message.msg.slice(0,5) : message.msg) }</td>
                    <td>
                        <OverlayTrigger placement={"bottom"}  overlay={<Tooltip >{getTime(message.timeStamp)}</Tooltip>}>
                            <div>{getDate(message.timeStamp)}</div>
                        </OverlayTrigger>
                    </td>
                    <td>
                        <button onClick={()=>history.push({pathname:"/inbox/message",state:message})}>open</button>
                        <button onClick={(e)=>{e.stopPropagation();history.push({pathname:'/inbox/newmessage',state:{type:'reply',to:message.from}})}}>reply</button>
                    </td>
                </tr> 
                ))
                }
                {loadingTable ? <tr className={`${styles.tr}`} ><td  colSpan={6}>table is loading...</td></tr> :
                                (logs.length === 0 && <tr className={`${styles.tr}`} ><td  colSpan={6}>you don't have any message</td></tr>)}
            </tbody>
        </table>
    </div>
    <div className="position-relative">
        <Button primary className="mx-2" onClick={()=>history.push({pathname:'/inbox/newmessage',state:{type:'fromInbox'}})}>new message</Button>
    </div>
    </div>
    );
};

// export default Inbox;

const typesArr = [
	{
		indexed: false,
		internalType: "address",
		name: "from",
		type: "address",
	},
	{ 
        indexed: false, 
        internalType: "address", 
        name: "to",
         type: "address" 
    },
	{
		indexed: false,
		internalType: "string",
		name: "subject",
		type: "string",
	},
	{
		indexed: false,
		internalType: "string",
		name: "message",
		type: "string",
	},
];


const Message = () => {
    const location = useLocation()
    const { account } = useWeb3React()
    const history = useHistory()
    const [msgToShow,setMsgToShow] = useState(location.state.msg)
    console.log(location)
    const width = useWidth()
    const decryptFunc = async (encryptedData,obj)=>{
        //decrypting
        try{
            const decryptedMsg = await window.ethereum.request({
              method: 'eth_decrypt',
              params: [encryptedData, account],
            });
            console.log(decryptedMsg)
            obj.msg = decryptedMsg;
            setMsgToShow(decryptedMsg)
            // setLogs([...logs])
        }
        catch(err) {
            console.log(err)
        }
    }
    if(!location.state)
    return (
        <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
            <h1>There is no message</h1>
        </div>
    )
    return (
    <div className='w-100 h-100 d-flex flex-column justify-content-center align-items-center position-relative'>
        <div className='position-absolute top-0 p-2 w-100' onClick={()=>history.push('/inbox')}
            style={{left:0,cursor:'pointer',borderBottom:'1px solid white'}}>back</div>
        <div>
            <h1>Message</h1>
        </div>
        <div className={`w-50 position-relative ${width < 992 ? "w-100" : "w-50"}`} style={{border:"7px double white",minHeight:'50%'}}>
            <div className="d-flex py-2 container" style={{borderBottom:'1px solid white'}}>
                <div>subject:</div>
                <div>{location.state.subject}</div>
            </div>
            <div className="d-flex py-2 container" style={{borderBottom:'1px solid white'}}>
                <div>from:</div>
                <div style={{wordBreak:"break-word"}}>{location.state.from}</div>
            </div>
            <div className="py-2 container mb-5" >
                <div>message:</div>
                <div style={{wordBreak:"break-word"}}>{msgToShow}</div>
            </div>
            {location.state.isHashed &&
            <div className="position-absolute" style={{left:'37%',bottom:'2%'}} >
                <button onClick={()=>decryptFunc(location.state.msg,location.state)}>decrypt</button>
                <button className="mx-2" onClick={()=>history.push({pathname:'/inbox/newmessage',state:{type:'reply',to:location.state.from}})}>reply</button>
            </div>
            }
        </div>
    </div>
    );
};