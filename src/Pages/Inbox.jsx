import React, { useState, useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import Table from 'react-bootstrap/Table'

import { context } from "../App";

const Inbox = () => {
	const { library, account } = useWeb3React();
    const [logs,setLogs] = useState([])
    const [allMsgs,setAllMsgs] = useState([])
    const [publicMessages,setPublicMessages] = useState([])
    const [privateMessages,setPrivateMessages] = useState([])
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
		res.data.result.map((item) => {
			try {
				console.log(item.data);
				const result = library.eth.abi.decodeLog(typesArr, item.data);
                const tempMessage = JSON.parse(result.message.replaceAll("\'","\"")); 
                result.isHashed = tempMessage.isHashed;
                result.msg = tempMessage.msg;
                if(result.to === account){
				    tempLogs.push(result);
                    !result.isHashed && tempPublic.push(result)
                    result.isHashed && tempPrivate.push(result)
                }
			} catch (err) {
				console.log(err);
			}
		});
		console.log(tempLogs);
        setLogs(tempLogs)
        setAllMsgs(tempLogs)
        setPublicMessages(tempPublic)
        setPrivateMessages(tempPrivate)
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
	return (
    <div>{console.log(logs)}
    <div className="text-center mt-3">
        <button className="mx-2" onClick={()=>setLogs(allMsgs)}>all messages</button>
        <button className="mx-2" onClick={()=>setLogs(privateMessages)}>private mssages</button>
        <button className="mx-2" onClick={()=>setLogs(publicMessages)}>public messages</button>
    </div>
    <div className="d-flex justify-content-center container">
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
                <tr>
                    <td><strong>{message.to.slice(0,5)+"..."+message.to.slice(-5)}</strong></td>
                    <td>{message.subject}</td>
                    <td>{message.msg.length > 30 ? message.msg.slice(0,30) : message.msg }</td>
                    {message.isHashed && <button className="text-white" onClick={()=>decryptFunc(message.msg,message)}>decrypt message</button>}
                </tr> 
                ))
                }
            </tbody>
        </Table>
    </div>
    </div>
    );
};

export default Inbox;

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