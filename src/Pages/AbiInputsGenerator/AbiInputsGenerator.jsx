import React, { useState, useEffect } from "react";
import Web3 from "web3";

const AbiInputsGenerator = () => {
    const [contract,setContract] = useState(null)
    const [account,setAccount] = useState(null)
    const [data,setData] = useState({})
    const [result,setResult] = useState({})
    const [loading,setLoading] = useState({})

    const handleChange = (e, item) => {
        item.param =  e.target.value ;
    };

    const handleLoad = async (item)=>{
        const res = await contract.methods[item.name]().call()
        setData(prev =>{return{...prev,[item.name]:res}})
    }

    const call = (item) => {
        const args = paramOrder(item);
        setLoading(prev=>{return{...prev,[item.name]:true}})
        try{
            contract.methods[item.name](...args)
              .call()
              .then(res=>{
                  setResult(prev=>{return{...prev,[item.name]:res}})
                  setLoading(prev=>{return{...prev,[item.name]:false}})
              })
              .catch(err=>{
                setResult(prev=>{return{...prev,[item.name]:err.message}})
                setLoading(prev=>{return{...prev,[item.name]:false}})
              })
        }
        catch(err){
            console.log(err)
            setLoading(prev=>{return{...prev,[item.name]:false}})
        }
    };

    const write = (item) => {
        const args = paramOrder(item);
        try{
            contract.methods[item.name](...args)
              .send({ from: account })
              .then((res) => console.log(res));
        }
        catch(err){
            console.log(err)
        }
    };

    const paramOrder = (item) => {
        const arr = [];
        for (let i = 0; i < item.inputs.length; i++){
            arr.push(item.inputs[i].param);
        }
        return arr;
    };

    useEffect(()=>{
        (async()=>{
            if(window.ethereum){

                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                accounts && setAccount(accounts[0])

                window.ethereum.on('accountsChanged', function (accounts) {
                    setAccount(accounts[0])
                });

                const web3 = new Web3(window.web3.currentProvider);
                const contract = new web3.eth.Contract(
                  abi,
                  "0x8e4AD033CC7A8D1f8071C2228B079456575B0749"
                );
                setContract(contract)
            }
        })()
    },[])

    useEffect(()=>{
        if(!contract) return
        readFunctions.forEach(item=>{
            if(item.inputs.length === 0)
                handleLoad(item)
        })
    },[contract])
    return (
        <div className="h-100 w-100 d-flex flex-column text-white wrapper mx-auto position-relative">
            <div>
                <div className="my-3 px-4" style={{fontSize:'28px'}}>Read Contract</div>
                <div className="d-flex flex-column align-items-center gap-4 w-100">
                {
                    readFunctions.map((item,key)=>(
                        <div key={key} className="d-flex flex-column gap-2 w-100 p-4" style={{border:'1px solid white'}}>
                            <div className="text-xl">{item.name}</div>
                            <div className="d-flex flex-column gap-2">
                            {
                                item.inputs.map((item,index)=>(
                                    <input 
                                    style={{borderRadius:"10px",outline:'none',padding:'1rem', backgroundColor:'#2c2f48',color:'white',border:'none'}}
                                    type="text" key={index*-1} name={item.name} placeholder={`${item.name} (${item.type})`} 
                                    onChange={(e) => handleChange(e, item)}
                                    />
                                ))
                            }
                            </div>
                            {
                                item.inputs.length === 0 && <div>{data[item.name] ? data[item.name] : "loading..." }</div>
                            }
                            {
                                item.inputs.length !== 0 &&
                            <div>
                                <button onClick={() => call(item)}
                                style={{width:"9rem",padding:'1rem 2rem',borderRadius:'10px',border:'none',backgroundColor:'#513b8f'}}
                                >
                                    Query
                                </button>
                            </div>
                            }
                            {
                                result[item.name] && <div className="break-words">{result[item.name]}</div>
                            }
                            {
                                loading[item.name] && <div>loading...</div>
                            }
                        </div>
                    ))    
                }
                </div>
            </div>
            <div className="">
                <div className="my-3 px-4" style={{fontSize:'28px'}}>Write Contract</div>
                <div className="d-flex flex-column align-items-center gap-4 w-100">
                {
                    writeFunctions.map((item,key)=>(
                        <div key={key} className="d-flex flex-column gap-2 w-100 p-4" style={{border:'1px solid white'}}>
                            <div className="text-xl">{item.name}</div>
                            <div className="d-flex flex-column gap-2">
                            {
                                item.inputs.map((item,index)=>(
                                    <input 
                                    style={{borderRadius:"10px",outline:'none',padding:'1rem', backgroundColor:'#2c2f48',color:'white',border:'none'}}
                                    type="text" key={index*-1} name={item.name} placeholder={`${item.name} (${item.type})`} 
                                    onChange={(e) => handleChange(e, item)}
                                    />
                                ))
                            }
                            </div>
                            <div>
                                <button onClick={() => write(item)}
                                style={{width:"9rem",padding:'1rem 2rem',borderRadius:'10px',border:'none',backgroundColor:'#513b8f'}}
                                >
                                    Write
                                </button>
                            </div>
                        </div>
                    ))    
                }
                </div>
            </div>
        </div>
    );
}

export default AbiInputsGenerator


const contractAddress = "0x8e4AD033CC7A8D1f8071C2228B079456575B0749"
const abi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "approved",
				type: "address",
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256",
			},
		],
		name: "Approval",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address",
			},
			{ indexed: false, internalType: "bool", name: "approved", type: "bool" },
		],
		name: "ApprovalForAll",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256",
			},
		],
		name: "Transfer",
		type: "event",
	},
	{
		inputs: [
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
		],
		name: "approve",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "owner", type: "address" }],
		name: "balanceOf",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "getApproved",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_owner", type: "address" },
			{ internalType: "string", name: "_name", type: "string" },
			{ internalType: "string", name: "_symbol", type: "string" },
		],
		name: "initialize",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "owner", type: "address" },
			{ internalType: "address", name: "operator", type: "address" },
		],
		name: "isApprovedForAll",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "name",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "ownerOf",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "string", name: "uri", type: "string" },
		],
		name: "safeMint",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
		],
		name: "safeTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
			{ internalType: "bytes", name: "_data", type: "bytes" },
		],
		name: "safeTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "operator", type: "address" },
			{ internalType: "bool", name: "approved", type: "bool" },
		],
		name: "setApprovalForAll",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
		name: "supportsInterface",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "symbol",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "tokenURI",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
		],
		name: "transferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	}
];

const readFunctions = abi.filter(item=>item.type === "function" && item.stateMutability === "view")
const writeFunctions = abi.filter(item=>item.type === "function" && item.stateMutability === "nonpayable")