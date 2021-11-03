import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useWeb3React } from '@web3-react/core'
import { Table } from "react-bootstrap";
import Button from '../Components/styled/Button'
const contractAddressSignin = "0x92c3f3B2122B61a50B218df446e2799535FCb519"
const contractABISignin = [{"inputs":[{"internalType":"address","name":"_DAOAddress","type":"address"},{"internalType":"uint256","name":"_pureNameFee","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"userAddress","type":"address"},{"indexed":false,"internalType":"string","name":"info","type":"string"}],"name":"SetInfo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"userAddress","type":"address"},{"indexed":false,"internalType":"string","name":"username","type":"string"}],"name":"SignIn","type":"event"},{"inputs":[],"name":"DAOContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addrToUser","outputs":[{"internalType":"string","name":"username","type":"string"},{"internalType":"string","name":"info","type":"string"},{"internalType":"bool","name":"isVIP","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"userAddr","type":"address"}],"name":"addressToProfile","outputs":[{"internalType":"string","name":"username","type":"string"},{"internalType":"string","name":"info","type":"string"},{"internalType":"bool","name":"VIPstatus","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"userAddr","type":"address"}],"name":"addressToUsername","outputs":[{"internalType":"string","name":"username","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"userAddr","type":"address"}],"name":"isPure","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"userAddr","type":"address"}],"name":"isVIP","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contractAddr","type":"address"}],"name":"newDAOContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pureNameFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"username","type":"string"}],"name":"registered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"userAddr","type":"address"}],"name":"registered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"info","type":"string"}],"name":"setInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"setPureNameFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"username","type":"string"},{"internalType":"string","name":"info","type":"string"},{"internalType":"address","name":"presenter","type":"address"}],"name":"signIn","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"userAddr","type":"address"}],"name":"upgradeToVIP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"userToAddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"username","type":"string"}],"name":"usernameToAddress","outputs":[{"internalType":"address","name":"userAddr","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"username","type":"string"}],"name":"usernameToProfile","outputs":[{"internalType":"address","name":"userAddr","type":"address"},{"internalType":"string","name":"info","type":"string"},{"internalType":"bool","name":"VIPstatus","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"receiverAddress","type":"address"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const contractABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"requestId","type":"bytes32"}],"name":"RollDice","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"}],"name":"SignIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Win","type":"event"},{"inputs":[],"name":"RNCAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"RNCwithhold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cancel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"charge","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"commission","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deadLine","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gateFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"indexToAddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"info","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_info","type":"string"},{"internalType":"string","name":"_baseURI","type":"string"},{"internalType":"uint256","name":"_gateFee","type":"uint256"},{"internalType":"uint256","name":"_percentCommission","type":"uint256"},{"internalType":"uint256","name":"_userLimit","type":"uint256"},{"internalType":"uint256","name":"_timeLimit","type":"uint256"},{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_RandomNumberConsumer","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"prize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rollDice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"secondsLeftToRollDice","outputs":[{"internalType":"uint256","name":"_secondsLeft","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"randomness","type":"uint256"}],"name":"select","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"signIn","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"status","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_RandomNumberConsumer","type":"address"}],"name":"upgradeRNC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"userCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userEntered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"userLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"usersNumberToRollDice","outputs":[{"internalType":"uint256","name":"_usersNeeded","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawCommission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawableSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const ChanceRoom = () => {
    const {active,account,library} = useWeb3React()
    const {address} = useParams()
    const [info,setInfo] = useState()
    const [users,setUsers] = useState([])
    const [usersUpdated,setUsersUpdated] = useState(false)
    const [disableBuySeat,setDisableBuySeat] = useState()
    const [disableChooseWinner,setDisableChooseWinner] = useState()
    const [roomStatus,setRoomStatus] = useState("")
    const getInfo = async ()=>{
        const contract = new library.eth.Contract(contractABI,address);
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
        // if((userLimit!==0 && userCount === userLimit) ||
        //    (deadLine !==0 && time)){
        //        setDisableBuySeat(true)
        //        setDisableChooseWinner(true)
        //        setRoomStatus("choose winner")
        // }
        // if(status==="waiting for random number..."){
        //     setDisableBuySeat(true)
        //     setRoomStatus("waiting for chainLink")
        // }
        // else if(status==="finished"){
        //     setDisableChooseWinner(true)
        //     setRoomStatus("winner")
        // }
    }
    const getUsers = async ()=>{
        const contract = new library.eth.Contract(contractABI,address);
        const contractSignin = new library.eth.Contract(contractABISignin,contractAddressSignin);
        const userCount = await contract.methods.userCount().call().then(res=>res)
        for(let i = 0;i < userCount; i++){
            const userAddress = await contract.methods.indexToAddr(i).call().then(res=>res)
            const registered = await contractSignin.methods.registered(account).call(res=>res)
            let userName;
            if(registered){
                userName = await contractSignin.methods.addressToUsername(userAddress).call(res=>res) 
            }
            else{
                userName = "not signed in"
            }
            setUsers(prevState=>[...prevState,{address,userName,seat:i,}])
        }
        setUsersUpdated(true)
        return userCount;
    }
    const buySeat = ()=>{
        const contract = new library.eth.Contract(contractABI,address);
        contract.methods.signIn().send({from:account,value:info.gateFee})
    }
    const chooseWinner = ()=>{
        const contract = new library.eth.Contract(contractABI,address);
        contract.methods.rollDice().send({from:account})
    }
    useEffect(()=>{
        if(active && !usersUpdated){
            getInfo()
        }
    },[active])
    return (
        <div>{console.log(users)}
            {info && 
            <div className="d-flex flex-column align-items-center">
                <div>chanceroom:{address}</div>
                <div>creator:{info.creator}</div>
                <div>commission on room:{info.commission}</div>
                <div>status:{info.status}</div>
                <div>total prize:{info.prize}</div>
                <div>limit on user:{info.userLimit}</div>
                <div>limit on time:{info.deadLine}</div>
                <div>winner:{info.winner}</div>
                <div className="d-flex">
                    <Button secondary onClick={buySeat}>buy seat</Button>
                    <Button secondary onClick={chooseWinner} >roll dice</Button>
                </div>
            </div>}
            {users.length !== 0 &&
                <Table className="w-50 mx-auto" striped bordered hover size="md" variant="light">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>username</th>
                    <th>seat</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item,index)=>{
                    return(
                      <tr key={index}>
                        <td>{item.address}</td>
                        <td>{item.userName}</td>
                        <td>{item.seat}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            }
        </div>
    )
}
export default ChanceRoom
