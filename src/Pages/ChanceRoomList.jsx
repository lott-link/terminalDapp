import React, { useState, useEffect } from "react";
import Button from "../Components/styled/Button";
import { Table } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core"; 
import { useHistory } from "react-router";
const contractABIChanceRoom = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"requestId","type":"bytes32"}],"name":"RollDice","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"}],"name":"SignIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Win","type":"event"},{"inputs":[],"name":"RNCAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"RNCwithhold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cancel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"charge","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"commission","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deadLine","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gateFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"indexToAddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"info","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_info","type":"string"},{"internalType":"string","name":"_baseURI","type":"string"},{"internalType":"uint256","name":"_gateFee","type":"uint256"},{"internalType":"uint256","name":"_percentCommission","type":"uint256"},{"internalType":"uint256","name":"_userLimit","type":"uint256"},{"internalType":"uint256","name":"_timeLimit","type":"uint256"},{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_RandomNumberConsumer","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"prize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rollDice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"secondsLeftToRollDice","outputs":[{"internalType":"uint256","name":"_secondsLeft","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"randomness","type":"uint256"}],"name":"select","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"signIn","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"status","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_RandomNumberConsumer","type":"address"}],"name":"upgradeRNC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"userCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userEntered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"userLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"usersNumberToRollDice","outputs":[{"internalType":"uint256","name":"_usersNeeded","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawCommission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawableSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const contractAddressFactory = "0x13356777Ef8547d9e2F94a3C0ED2020c1Cd04e65"
const contractABIFactory = [{"inputs":[{"internalType":"address","name":"_registerContract","type":"address"},{"internalType":"address","name":"_randomNumberConsumer","type":"address"},{"internalType":"address","name":"_chanceRoomLibrary","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newLibrary","type":"address"},{"indexed":false,"internalType":"address","name":"updater","type":"address"}],"name":"ChanceRoomLibraryUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"chanceRoom","type":"address"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"NewChanceRoom","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newConsumer","type":"address"},{"indexed":false,"internalType":"address","name":"updater","type":"address"}],"name":"RandomNumberConsumerUpdated","type":"event"},{"inputs":[],"name":"chanceRoomLibrary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"chanceroomsList","outputs":[{"internalType":"contract ChanceRoom[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"info","type":"string"},{"internalType":"string","name":"baseURI","type":"string"},{"internalType":"uint256","name":"gateFee","type":"uint256"},{"internalType":"uint256","name":"percentCommission","type":"uint256"},{"internalType":"uint256","name":"userLimit","type":"uint256"},{"internalType":"uint256","name":"timeLimit","type":"uint256"}],"name":"newChanceRoom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_chanceRoomLibrary","type":"address"}],"name":"newChanceRoomLibrary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_randomNumberConsumer","type":"address"}],"name":"newRandomNumberConsumer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"randomNumberConsumer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"registerContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const ChanceRoomList = () => {
  const { active,account,library,activate} = useWeb3React()
  const [clicked, setClicked] = useState(0);
  const [list,setList] = useState([]);
  const [listUpdated,setListUpdated] = useState(false)
  const [listLoading,setListLoading] = useState(false)
  const history = useHistory()
  const getChanceroomsList = ()=>{
    setListLoading(true)
    const factoryContract = new library.eth.Contract(contractABIFactory,contractAddressFactory) 
    factoryContract.methods.chanceroomsList().call().then(chanceroomList=>{
      console.log(chanceroomList)
      chanceroomList.forEach( async (address)=>{
        const contract = new library.eth.Contract(contractABIChanceRoom,address)
        const creator = await contract.methods.owner().call().then(res=>res)
        const userLimit = await contract.methods.userLimit().call().then(res=>res)
        const timeLimit = await contract.methods.deadLine().call().then(res=>res)
        const prize = await contract.methods.prize().call().then(res=>res)
        const commission = await contract.methods.prize().call().then(res=>res)
        setList(prevState=>[...prevState,{creator,userLimit,timeLimit,prize,commission,address}])
      })
      setListUpdated(true)
      setListLoading(false)
    })
  }
  useEffect(()=>{
    if(active && !listUpdated){
      getChanceroomsList()
    }
  },[active])
  return (
    <div className="w-100 h-100">{console.log(list)}
      <div className="d-flex justify-content-center">
        <Button secondary={clicked === 0} primary={clicked !== 0} style={{ marginLeft: "3px", marginRight: "3px" }} onClick={() => setClicked(0)}>active</Button>
        <Button secondary={clicked === 1} primary={clicked !== 1} style={{ marginLeft: "3px", marginRight: "3px" }} onClick={() => setClicked(1)}>all</Button>
        <Button secondary={clicked === 2} primary={clicked !== 2} style={{ marginLeft: "3px", marginRight: "3px" }} onClick={() => setClicked(2)}>yours</Button>
        <Button secondary={clicked === 3} primary={clicked !== 3} style={{ marginLeft: "3px", marginRight: "3px" }} onClick={() => setClicked(3)}>filter</Button>
      </div>
      <div className="px-5">
      <Table striped bordered hover size="md" variant="light">
        <thead>
          <tr>
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
              <tr key={index} onClick={()=>history.push(`/contract/chanceroom/${item.address}`)}>
                <td>{index}</td>
                <td>{item.creator}</td>
                <td>{item.userLimit}</td>
                <td>{item.timeLimit}</td>
                <td>{item.prize}</td>
                <td>{item.commission}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      {listLoading && <div>loading...</div>}
      <Button secondary>create new room</Button>
      </div>
    </div>
  );
};

export default ChanceRoomList;
