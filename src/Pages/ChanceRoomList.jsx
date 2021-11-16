import React, { useState, useEffect } from "react";
import Button from "../Components/styled/Button";
import { useWeb3React } from "@web3-react/core"; 
import { useHistory } from "react-router";
import CountDown from "../Components/CountDown";
import { factoryContractAddress } from '../Contracts/ContractAddress'
import styles from './chanceRoomList.module.css'
import axios from 'axios'
import Web3 from "web3";
const ChanceRoomList = () => {
  const { active,account,library,activate} = useWeb3React()
  const [clicked, setClicked] = useState(1);
  const [list,setList] = useState([]);
  const [cList,setCList]= useState([])
  const [listLoading,setListLoading] = useState(false)
  const [events,setEvents] = useState()
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
    const topic = Web3.utils.sha3("NewChanceRoom(address,address,uint256,uint256,uint256,uint256)")
    axios.get(`https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&fromBlock=21122189&toBlock=31122189
    &address=${factoryContractAddress}&apikey=YourApiKeyToken
    &topic0=${topic}`)
    .then(res=>{
      console.log("data is ",res.data.result);
      const data = res.data.result;
      let info = []
      data.map(event=>{
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
      console.log("new Data",info)
      setList(info)
      setCList(info)
    })
  }
  const subscribe = ()=>{
    library.setProvider(new Web3.providers.WebsocketProvider("wss://rpc-mumbai.maticvigil.com/ws/v1/c94e97b70a9c2127c529d948ce9229b844c4dbdb"))    
    library.eth.subscribe('logs', {
        address: factoryContractAddress,
        topics: [library.utils.sha3("NewChanceRoom(address,address,uint256,uint256,uint256,uint256)")]
      }, function(error, result){
          if (!error){
            console.log(result)
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
  return (
    <div className="w-100 h-100">
      <div className="d-flex justify-content-center">
        <Button secondary={clicked === 0} primary={clicked !== 0} style={{ marginLeft: "3px", marginRight: "3px" }} onClick={() => setClicked(0)}>active</Button>
        <Button secondary={clicked === 1} primary={clicked !== 1} style={{ marginLeft: "3px", marginRight: "3px" }} onClick={() => filterByAll(1)}>all</Button>
        <Button secondary={clicked === 2} primary={clicked !== 2} style={{ marginLeft: "3px", marginRight: "3px" }} onClick={() => filterByYours(2)}>yours</Button>
        <Button secondary={clicked === 3} primary={clicked !== 3} style={{ marginLeft: "3px", marginRight: "3px" }} onClick={() => setClicked(3)}>filter</Button>
      </div>
      <div className="px-5">
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
                <td>{item.owner.slice(0,8)+"..."+item.owner.slice(-8)}</td>
                <td>{(item.userLimit)}</td>
                <td>{getTime(item.timeLimit)}</td>
                <td>0</td>
                <td>{item.commission}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {listLoading && <div>loading...</div>}
      <Button secondary onClick={()=>history.push('/contract/createchanceroom')}>create new room</Button>
      </div>
    </div>
  );
};

export default ChanceRoomList;