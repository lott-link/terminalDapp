import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router'
import { useWeb3React } from '@web3-react/core'
import Button from '../Components/styled/Button'
import {  registerContractABI, chanceRoomLibraryABI } from '../Contracts/ContractsABI'
import CountDown from '../Components/CountDown';
import styles from './chanceRoomList.module.css'
import { context } from '../App'
const ChanceRoom = () => {
    const {active,account,library} = useWeb3React()
    const data = useContext(context)
    const {address} = useParams()
    const [info,setInfo] = useState()
    const [users,setUsers] = useState([])
    const [usersUpdated,setUsersUpdated] = useState(false)
    const getInfo = async ()=>{
        const contract = new library.eth.Contract(chanceRoomLibraryABI,address);
        const creator = await contract.methods.owner().call().then(res=>res)
        const commission = await contract.methods.commission().call().then(res=>res)
        const status = await contract.methods.status().call().then(res=>res)
        const prize = await contract.methods.prize().call().then(res=>res)
        const userLimit = await contract.methods.userLimit().call().then(res=>res)
        const deadLine = await contract.methods.deadLine().call().then(res=>res)
        const gateFee = await contract.methods.gateFee().call().then(res=>res)
        const winner = await contract.methods.winner().call().then(res=>res)
        setInfo({creator,commission,status,prize,userLimit,deadLine,gateFee,winner})
        const userCount = getUsers();
        const time = new Date(deadLine*1000).getTime()
    }
    const getUsers = async ()=>{
        const contract = new library.eth.Contract(chanceRoomLibraryABI,address);
        const registerContract = new library.eth.Contract(registerContractABI,data.addresses[data.network]["register"]);
        const userCount = await contract.methods.userCount().call().then(res=>res)
        for(let i = 0;i < userCount; i++){
            const userAddress = await contract.methods.indexToAddr(i).call().then(res=>res)
            const registered = await registerContract.methods.registered(account).call(res=>res)
            let userName;
            if(registered){
                userName = await registerContract.methods.addressToUsername(userAddress).call(res=>res) 
            }
            else{
                userName = "not signed in"
            }
            setUsers(prevState=>[...prevState,{address,userName,seat:i,}])
        }
        setUsersUpdated(true)
        return userCount;
    }
    const buySeat = async ()=>{
        const contract = new library.eth.Contract(chanceRoomLibraryABI,address);
        contract.methods.buySeat().send({from:account,value:info.gateFee})
    }
    const chooseWinner = async ()=>{
        const contract = new library.eth.Contract(chanceRoomLibraryABI,address);
        contract.methods.rollDice().send({from:account})
    }
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
    useEffect(()=>{
        if(active && !usersUpdated){
            getInfo()
        }
    },[active])
    return (
        <div className="w-100 h-100" style={{overflow:'auto'}}>
          <div className="w-100 px-4 d-flex align-items-center justify-content-between" style={{height:'5%',borderBottom:'2px solid white'}}>
                <div></div>
                <div>chance romm #{address}</div>
                <div className="d-flex">
                    <div className="circle mx-1"></div>
                    <div className="circle"></div>
                </div>
            </div>
            {info && 
            <div className="w-100 d-flex flex-wrap align-items-center p-3">
              <div className="w-50 text-center">
                <div>creator:{info.creator.slice(0,8)+"..."+info.creator.slice(-8)}</div>
                <div>commission on room:{info.commission}</div>
                <div>limit on user:{info.userLimit}</div>
              </div>
              <div className="w-50 text-center">
                <div>limit on time:{getTime(info.deadLine)}</div>
                <div>total prize:{info.prize}</div>
              </div>
              <div className="w-100 d-flex justify-content-center">
                    <Button secondary onClick={buySeat}>buy seat</Button>
                    <Button secondary onClick={chooseWinner} >roll dice</Button>
              </div> 
                {/* <div>creator:{info.creator.slice(0,8)+"..."+info.creator.slice(-8)}</div
                <div>status:{info.status}</div>
                <div>total prize:{info.prize}</div>
                <div>limit on user:{info.userLimit}</div>
                <div>winner:{info.winner}</div>
                */}
            </div>}
            {users.length !== 0 &&
                <table className="w-50 mx-auto">
                <thead>
                  <tr className={`${styles.tr} ${styles.head}`}>
                    <th>Address</th>
                    <th>username</th>
                    <th>seat</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item,index)=>{
                    return(
                      <tr key={index} className={styles.tr}>
                        <td>{item.address.slice(0,8)+"..."+item.address.slice(-8)}</td>
                        <td>{item.userName}</td>
                        <td>{item.seat}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            }
        </div>
    )
}
export default ChanceRoom