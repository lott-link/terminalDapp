import React, { useState, useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core"; 
import { useHistory } from "react-router";
import styles from './chanceRoomList.module.css'
import axios from 'axios'
import Web3 from "web3";

import CountDown from "../../Components/CountDown";
import Button from "../../Components/styled/Button";
import { context } from '../../App'
import useWidth from "../../Hooks/useWidth";

const ChanceRoomList = () => {
  const { active,account,library, chainId} = useWeb3React()
  const data = useContext(context)
  const [clicked, setClicked] = useState(1);
  const [list,setList] = useState([]);
  const [cList,setCList]= useState([])
  const width = useWidth()
  const history = useHistory()
  const getTime = (time)=>{
    if(parseInt(time) === 0)
      return "No Limit"
    else{
      const date = new Date(time*1000);
      if(date.getTime() < new Date().getTime())
        return "Time limit finished"
      else{
        return <CountDown time={date.getTime()/1000}/>
      }
    }
  }
  // const getPastEvents = async ()=>{
  //     let allEvents = [];
  //     const firstBlock = 21122189; 
  //     const lastBlock = await library.eth.getBlockNumber().then(res=>res)
  //     const contract = new library.eth.Contract(factoryContractABI,factoryContractAddress);
  //       contract.getPastEvents("NewChanceRoom",{fromBlock:firstBlock,toBlock:firstBlock+1000})
  //       .then(res=>console.log("getPast events",res))
  //     for(let i = firstBlock; i < lastBlock ; i+=1000){
  //       contract.getPastEvents("NewChanceRoom",{fromBlock:i,toBlock:i+1000},
  //       (error,events)=>{
  //           if(events && events.length !== 0){
  //               events.map(event=>allEvents.push(event))
  //           if(error)
  //             console.log(error)
  //           }
  //       })
  //     }
  //     setEvents(allEvents)
  // }
  const getAllTransactions = ()=>{
    const currentChain = data.converChainIDToName(chainId)
    const chains = data.supportedChains.find(item=> item.chain === currentChain)
    if( chains && !chains.supported ) return 
    try{
      const topic = Web3.utils.sha3("NewChanceRoom(address,address,uint256,uint256,uint256,uint256)")
      axios.get(`https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&fromBlock=21122189&toBlock=31122189
      &address=${data.addresses[data.network]['factory']}&apikey=YourApiKeyToken
      &topic0=${topic}`)
      .then(res=>{
        console.log(res)
        const data = res.data.result;
        let info = []
        data.forEach(event=>{
          const userLimit = "0x"+event.data.slice(260,322);
          const timeLimit = "0x"+event.data.slice(322,458);
          const commission = "0x"+event.data.slice(208,258);
          info.push({
          address:"0x"+event.data.slice(26,66),
          owner:"0x"+event.data.slice(90,130),
          commission:Web3.utils.toDecimal(commission),
          userLimit:Web3.utils.toDecimal(userLimit),
          timeLimit:Web3.utils.toDecimal(timeLimit),
        })}
        )
        setList(info)
        setCList(info)
      })
    }
    catch(err){
      console.log(err)
    }
  }
  const subscribe = ()=>{
    const currentChain = data.converChainIDToName(chainId)
    const chains = data.supportedChains.find(item=> item.chain === currentChain)
    if( !chains.supported ) return 
    library.setProvider(new Web3.providers.WebsocketProvider("wss://rpc-mumbai.maticvigil.com/ws/v1/c94e97b70a9c2127c529d948ce9229b844c4dbdb"))    
    library.eth.subscribe('logs', {
        address: data.addresses[data.network]['factory'],
        topics: [library.utils.sha3("NewChanceRoom(address,address,uint256,uint256,uint256,uint256)")]
      }, function(error, result){
          if (!error){
            const userLimit = "0x"+result.data.slice(260,322);
            const timeLimit = "0x"+result.data.slice(322,458);
            const commission = "0x"+result.data.slice(208,258);
            setList(prevState=>[...prevState,{
              address:"0x"+result.data.slice(26,66),
              owner:"0x"+result.data.slice(90,130),
              commission:Web3.utils.toDecimal(commission),
              userLimit:Web3.utils.toDecimal(userLimit),
              timeLimit:Web3.utils.toDecimal(timeLimit),
          }])
          setCList(prevState=>[...prevState,{
            address:"0x"+result.data.slice(26,66),
            owner:"0x"+result.data.slice(90,130),
            commission:Web3.utils.toDecimal(commission),
            userLimit:Web3.utils.toDecimal(userLimit),
            timeLimit:Web3.utils.toDecimal(timeLimit),
          }])
        }   
    })
  }
  const filterByYours = (number)=>{
    if(active){
      setClicked(number)
      setList(cList.filter(item=>library.utils.toChecksumAddress(item.owner) === library.utils.toChecksumAddress(account)))
    }
  }
  const filterByAll = (number)=>{
    setList(cList)
    setClicked(number)
  }
  useEffect(()=>{
    if(active){
      subscribe()
    }
  },[active])
  useEffect(()=>{
    getAllTransactions()
  },[])
  if(!active)
    return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">please connect your wallet</h2>)
  else if(!data.pageSupported) 
    return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">Chain not supported</h2>)
  else
  return (
    <div className="w-100 h-100">
      <div className="d-flex justify-content-center">
        <Button secondary={clicked === 0} primary={clicked !== 0} style={{ marginLeft: "3px", marginRight: "3px" }} onClick={() => setClicked(0)}>active</Button>
        <Button secondary={clicked === 1} primary={clicked !== 1} style={{ marginLeft: "3px", marginRight: "3px" }} onClick={() => filterByAll(1)}>all</Button>
        <Button secondary={clicked === 2} primary={clicked !== 2} style={{ marginLeft: "3px", marginRight: "3px" }} onClick={() => filterByYours(2)}>yours</Button>
        <Button secondary={clicked === 3} primary={clicked !== 3} style={{ marginLeft: "3px", marginRight: "3px" }} onClick={() => setClicked(3)}>filter</Button>
      </div>
      <div className={width > 600 && "px-5"}>
      <table className="w-100">
        <thead>
          <tr className={`${styles.tr} ${styles.head}`}>
            <th>#</th>
            <th>Creator</th>
            <th>User Limit</th>
            <th>Time Limit</th>
            <th>Prize</th>
            <th>Commission</th>
          </tr>
        </thead>
        <tbody>
        {list.length!== 0 && list.map((item,index)=>{
            return(
              <tr 
                className={styles.tr}
                key={index}
                onClick={()=>history.push(`/contract/chanceroom/${item.address}`)}>
                <td>{index+1}</td>
                <td>{width > 600 ? (item.owner.slice(0,8)+"..."+item.owner.slice(-8)) : (item.owner.slice(0,2)+"."+item.owner.slice(-2))}</td>
                <td>{(item.userLimit)}</td>
                <td>{getTime(item.timeLimit)}</td>
                <td>0</td>
                <td>{item.commission}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Button secondary onClick={()=>history.push('/contract/createchanceroom')}>create new room</Button>
      </div>
    </div>
  );
};

export default ChanceRoomList;