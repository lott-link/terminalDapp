import React, { useState, useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import Table from 'react-bootstrap/Table'
import { useHistory } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { useLocation } from "react-router-dom";

import { context } from "../App";
import Button from '../Components/styled/Button'

const Inbox = ()=>{
    return (
    <>
    <Route path="/inbox" exact={true} component={InboxPage} />
    <Route path="/inbox/message" component={Message} />
    </>
    );
}
export default Inbox



const InboxPage = () => {
	const { library, account, active } = useWeb3React();
    const history = useHistory();
    const [logs,setLogs] = useState([])
    const [allMsgs,setAllMsgs] = useState([])
    const [publicMessages,setPublicMessages] = useState([])
    const [privateMessages,setPrivateMessages] = useState([])
    const [sentMessages,setSentMessages] = useState([])
    const [selectedBtn,setSelectedBtn] = useState(0)
	const data = useContext(context);
	const getLogs = async () => {
		if (!data.network) return;
       
        const res = await axios
            .get(data.addresses[data.network].logAPI + data.addresses[data.network].messenger)
            .then((res) => res);
        console.log(res);
        const tempLogs = [];
        const tempPublic = [];
        const tempPrivate = [];
        const tempSentMessages = [];

        res.data.result.forEach((item) => {
            try {
                const result = library.eth.abi.decodeLog(typesArr, item.data);
                console.log(result)
                const tempMessage = JSON.parse(result.message.replaceAll("\'","\"")); 
                result.isHashed = tempMessage.isHashed;
                result.msg = tempMessage.msg;
                if(result.to === account){
                    tempLogs.push(result);
                    !result.isHashed && tempPublic.push(result)
                    result.isHashed && tempPrivate.push(result)
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
        setPublicMessages(tempPublic)
        setPrivateMessages(tempPrivate)
        setSentMessages(tempSentMessages)
        
	};
    const decryptFunc = async (encryptedData,obj)=>{
        //decrypting
        try{
            const decryptedMsg = await window.ethereum.request({
              method: 'eth_decrypt',
              params: [encryptedData, account],
            });
            console.log(decryptedMsg)
            obj.msg = decryptedMsg;
            setLogs([...logs])
        }
        catch(err) {
            console.log(err)
        }
    }
	useEffect(() => {
		getLogs();
	}, [data.network]);
    if(!active)
        return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">please connect your wallet</h2>)
    else if(!data.pageSupported) 
        return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">Chain not supported</h2>)
    else
	return (
    <div className="h-100">{console.log(logs)}
    <div className="text-center mt-3">
        <Button secondary={selectedBtn === 0} primary={selectedBtn !== 0} className="mx-2" onClick={()=>{setLogs(allMsgs);setSelectedBtn(0)}}>all messages</Button>
        <Button secondary={selectedBtn === 1} primary={selectedBtn !== 1} className="mx-2" onClick={()=>{setLogs(privateMessages);setSelectedBtn(1)}}>private mssages</Button>
        <Button secondary={selectedBtn === 2} primary={selectedBtn !== 2} className="mx-2" onClick={()=>{setLogs(publicMessages);setSelectedBtn(2)}}>public messages</Button>
        <Button secondary={selectedBtn === 3} primary={selectedBtn !== 3} className="mx-2" onClick={()=>{setLogs(sentMessages);setSelectedBtn(3)}}>sent messages</Button>
    </div>
    <div className="d-flex justify-content-center container" style={{overflowY:'auto',height:'85%'}}>
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>from</th>
                    <th>subject</th>
                    <th>msg</th>
                    <th>action</th>
                </tr>
            </thead>
            <tbody>
                {
                logs.map((message,index)=>(
                <tr key={index} style={{cursor:'pointer'}} onClick={()=>history.push({pathname:"/inbox/message",state:message})}>
                    <td><strong>{message.to.slice(0,5)+"..."+message.to.slice(-5)}</strong></td>
                    <td>{message.subject}</td>
                    <td>{message.msg && message.msg.length > 30 ? message.msg.slice(0,30) : message.msg }</td>
                    {message.isHashed && <td><button onClick={()=>decryptFunc(message.msg,message)}>decrypt message</button></td>}
                </tr> 
                ))
                }
            </tbody>
        </Table>
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
        <div className="w-50 position-relative" style={{border:"7px double white",minHeight:'50%'}}>
            <div className="d-flex py-2 container" style={{borderBottom:'1px solid white'}}>
                <div>subject:</div>
                <div>{location.state.subject}</div>
            </div>
            <div className="d-flex py-2 container" style={{borderBottom:'1px solid white'}}>
                <div>from:</div>
                <div>{location.state.from}</div>
            </div>
            <div className="py-2 container mb-5" >
                <div>message:</div>
                <div style={{wordBreak:"break-word"}}>{msgToShow}</div>
            </div>
            {location.state.isHashed &&
            <div className="position-absolute" style={{left:'45%',bottom:'2%'}} >
                <button onClick={()=>decryptFunc(location.state.msg,location.state)}>decrypt</button>
            </div>
            }
        </div>
    </div>
    );
};