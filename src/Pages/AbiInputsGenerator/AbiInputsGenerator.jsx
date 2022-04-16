import React, { useState, useEffect } from "react";
import Web3 from "web3";

import Input from "../../Components/styled/input";
import Button from "../../Components/styled/Button";

const AbiInputsGenerator = () => {
    const [contract,setContract] = useState(null)
    const [account,setAccount] = useState(null)
    const [data,setData] = useState({})
    const [result,setResult] = useState({})
    const [loading,setLoading] = useState({})
	const [abi,setAbi] = useState("")
	const [contractAddress,setContractAddress] = useState("")
	const [readFunctions,setReadFunctions] = useState([])
	const [writeFunctions,setWriteFunctions] = useState([])
	const [show,setShow] = useState(0)

	const handleGenerate = async ()=>{
        if(window.ethereum){
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            accounts && setAccount(accounts[0])
            window.ethereum.on('accountsChanged', function (accounts) {
                setAccount(accounts[0])
            });
            const web3 = new Web3(window.web3.currentProvider);
            const contract = new web3.eth.Contract(
              abi,
              contractAddress
            );
            setContract(contract)

			setReadFunctions(
				abi.filter(item=>item.type === "function" && item.stateMutability === "view")
			)
			setWriteFunctions(
				abi.filter(item=>item.type === "function" && item.stateMutability === "nonpayable")
			)
        }
	}
	
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

    // useEffect(()=>{
    //     (async()=>{
    //         if(window.ethereum){

    //             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //             accounts && setAccount(accounts[0])

    //             window.ethereum.on('accountsChanged', function (accounts) {
    //                 setAccount(accounts[0])
    //             });

    //             const web3 = new Web3(window.web3.currentProvider);
    //             const contract = new web3.eth.Contract(
    //               abi,
    //               "0x8e4AD033CC7A8D1f8071C2228B079456575B0749"
    //             );
    //             setContract(contract)
    //         }
    //     })()
    // },[])

    useEffect(()=>{
        // if(!readFunctions) return
        readFunctions.forEach(item=>{
            if(item.inputs.length === 0)
                handleLoad(item)
        })
    },[readFunctions])
    return (
        <div className="h-100 w-100 d-flex flex-column align-items-center text-white wrapper mx-auto position-relative">
    	    <div className='d-flex justify-content-center py-2 w-100' style={{borderBottom:"1px solid white"}}>
            	<div>ABI Generator</div>	
    		</div>
			
			<div className="w-50">
				<Input style={{width:"100%"}}
            	value={contractAddress} title="Contract Address" type="text" onChange={e=>setContractAddress(e.target.value)}/>
			</div>
			<div className="w-50"  style={{position:'relative'}}>
    	    	<label htmlFor="" className='px-3'
    	    	style={{position:'absolute',background:'#020227',top:'-10px',left:"20px"}}>
    	    	    ABI   
    	    	</label>
    	    	<textarea name="" id=""  rows="10" className='w-100 p-2' 
    	    	onChange={(e)=>setAbi(JSON.parse(e.target.value))} 
    	    	style={{background:'#020227',border:'7px double white',color:'white',width:'20rem'}}>
    	    	</textarea>
	    	</div>
			<div><Button secondary onClick={handleGenerate}>Generate</Button></div>
			<div className="">
				<Button secondary onClick={()=>setShow(0)}>Read</Button>
				<Button secondary onClick={()=>setShow(1)}>Write</Button>
			</div>
			{ readFunctions.length !== 0 && show === 0 && 
			<div className="w-75">
                <div className="my-3 px-4" style={{fontSize:'28px'}}>Read Contract</div>
                <div className="d-flex flex-column align-items-center gap-4 w-100">
                { 
                    readFunctions.map((item,key)=>(
                        <div key={key} className="d-flex flex-column gap-2 w-100 p-4" style={{border:'1px solid white'}}>
                            <div className="text-xl">{item.name}</div>
                            <div className="d-flex flex-column gap-2">
                            {
                                item.inputs.map((item,index)=>(
                                    <Input className="w-100"
									key={index} placeholder={`${item.name} (${item.type})`}  name={item.name} 
									onChange={(e) => handleChange(e, item)}
									/>
									// <input 
                                    // style={{borderRadius:"10px",outline:'none',padding:'1rem', backgroundColor:'#2c2f48',color:'white',border:'none'}}
                                    // type="text" key={index*-1} name={item.name} placeholder={`${item.name} (${item.type})`} 
                                    // onChange={(e) => handleChange(e, item)}
                                    // />
                                ))
                            }
                            </div>
                            {
                                item.inputs.length === 0 && <div>{data[item.name] ? data[item.name] : "loading..." }</div>
                            }
                            {
                                item.inputs.length !== 0 &&
                            <div>
								<Button secondary onClick={() => call(item)}>
									Query
								</Button>
                            </div>
                            }
                            {
                                result[item.name] && <div style={{wordBreak:'break-word'}}>{result[item.name]}</div>
                            }
                            {
                                loading[item.name] && <div>loading...</div>
                            }
                        </div>
                    ))    
                }
                </div>
            </div> 
			}
			{ writeFunctions.length !== 0 && show === 1 &&
            <div className="w-75">
                <div className="my-3 px-4" style={{fontSize:'28px'}}>Write Contract</div>
                <div className="d-flex flex-column align-items-center gap-4 w-100">
                { 
                    writeFunctions.map((item,key)=>(
                        <div key={key} className="d-flex flex-column gap-2 w-100 p-4" style={{border:'1px solid white'}}>
                            <div className="text-xl">{item.name}</div>
                            <div className="d-flex flex-column gap-2">
                            {
                                item.inputs.map((item,index)=>(
									<Input className="w-100"
									key={index*-1} placeholder={`${item.name} (${item.type})`}  name={item.name} 
									onChange={(e) => handleChange(e, item)}
									/>
                                    // <input 
                                    // style={{borderRadius:"10px",outline:'none',padding:'1rem', backgroundColor:'#2c2f48',color:'white',border:'none'}}
                                    // type="text" key={index*-1} name={item.name} placeholder={`${item.name} (${item.type})`} 
                                    // onChange={(e) => handleChange(e, item)}
                                    // />
                                ))
                            }
                            </div>
                            <div>
								<Button secondary onClick={() => write(item)}>
								Write
								</Button>
                            </div>
                        </div>
                    ))    
                }
                </div>
            </div>
			}
        </div>
    );
}

export default AbiInputsGenerator