import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import Input from '../Components/styled/input' 
const contractAddress = "0x13356777Ef8547d9e2F94a3C0ED2020c1Cd04e65"
const contractABI = [{"inputs":[{"internalType":"address","name":"_registerContract","type":"address"},{"internalType":"address","name":"_randomNumberConsumer","type":"address"},{"internalType":"address","name":"_chanceRoomLibrary","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newLibrary","type":"address"},{"indexed":false,"internalType":"address","name":"updater","type":"address"}],"name":"ChanceRoomLibraryUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"chanceRoom","type":"address"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"NewChanceRoom","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newConsumer","type":"address"},{"indexed":false,"internalType":"address","name":"updater","type":"address"}],"name":"RandomNumberConsumerUpdated","type":"event"},{"inputs":[],"name":"chanceRoomLibrary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"chanceroomsList","outputs":[{"internalType":"contract ChanceRoom[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"info","type":"string"},{"internalType":"string","name":"baseURI","type":"string"},{"internalType":"uint256","name":"gateFee","type":"uint256"},{"internalType":"uint256","name":"percentCommission","type":"uint256"},{"internalType":"uint256","name":"userLimit","type":"uint256"},{"internalType":"uint256","name":"timeLimit","type":"uint256"}],"name":"newChanceRoom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_chanceRoomLibrary","type":"address"}],"name":"newChanceRoomLibrary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_randomNumberConsumer","type":"address"}],"name":"newRandomNumberConsumer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"randomNumberConsumer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"registerContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const CreateChanceRoom = () => {
    const {activate,account,chainId,active,connector,library,deactivate} = useWeb3React()
    const [input,setInput] = useState({
        addrToUser:'',
        getRoleAdmin:'',
        getRoleMemberRole:'',
        getRoleMemberIndex:'',
        getRoleMemberCount:'',
        hasRoleRole:'',
        hasRoleAccount:'',
        supportsInterface:'',
        userAddr:'',
        userToAddr:'',
        grantRoleRole:'',
        grantRoleAccount:'',
        info:'',
        baseURI:'',
        gateFee:'',
        percentCommision:'',
        userLimit:'',
        timeLimit:'',
        newChanceRoomLibrary:'',
        newRandomNumberConsumer:'',
        renounceRole:'',
        randomness:'',
        signIn:'',
        upgradeRNC:''
    })
    const [loading,setLoading] = useState({
        Factory:false,
        RNC:false,
        RNCfee:false,
        RNCwithhold:false,
        baseURI:false,
        commission:false,
        deadline:false,
        gateFee:false,
        indexToAddr:false,
        info:false,
        owner:false,
        prize:false,
        secondsLeftToRollDice:false,
        status:false,
        userCount:false,
        userEntered:false,
        userLimit:false,
        userNumberToRollDice:false,
        winner:false,
        withdrawableSupply:false,
        cancel:false,
        charge:false,
        initilize:false,
        rollDice:false,
        select:false,
        signIn:false,
        upgradeRNC:false,
        withdrawCommission:false,
    })
    const [data,setData] = useState({
        Factory:'',
        RNC:'',
        RNCfee:'',
        RNCwithhold:'',
        baseURI:'',
        commission:'',
        deadline:'',
        gateFee:'',
        indexToAddr:'',
        info:'',
        owner:'',
        prize:'',
        secondsLeftToRollDice:'',
        status:'',
        userCount:'',
        userEntered:'',
        userLimit:'',
        userNumberToRollDice:'',
        winner:'',
        withdrawableSupply:'',
    })
    const getData = async (method)=>{
        const contract = new library.eth.Contract(contractABI,contractAddress);
        setLoading(prevState=> {
            return { ...prevState,[method]:true}
        })
        let data;
        switch (method){
            case 'RNC':
                data = await contract.methods.RNC().call()
                break
            case 'RNCfee':
                data = await contract.methods.RNCfee().call()
                break
            case 'RNCwithhold':
                data = await contract.methods.RNCwithhold().call()
                break
            case 'baseURI':
                data = await contract.methods.baseURI().call()
                break
            case 'commission':
                data = await contract.methods.commission().call()
                break
            case 'deadLine':
                data = await contract.methods.deadLine().call()
                break
            case 'gateFee':
                data = await contract.methods.gateFee().call()
                break
            case 'indexToAddr':
                data = await contract.methods.gateFee(input.indexToAddr).call()
                break
            case 'info':
                data = await contract.methods.info().call()
                break
            case 'owner':
                data = await contract.methods.owner().call()
                break
            case 'prize':
                data = await contract.methods.prize().call()
                break
            case 'userCount':
                data = await contract.methods.userCount().call()
                break
            case 'userEntered':
                data = await contract.methods.userEntered(input.userEntered).call()
                break    
            case 'userLimit':
                data = await contract.methods.userLimit().call()
                break
            case 'winner':
                data = await contract.methods.winner().call()
                break
            case 'withdrawableSupply':
                data = await contract.methods.withdrawableSupply().call()
                break
        }
        setData(prevState=> {
            return { ...prevState,[method]:data}
        })
        setLoading({...loading,[method]:false})
    }
    const sendData = (method)=>{
        const contract = new library.eth.Contract(contractABI,contractAddress);
        setLoading({...loading,name:true})
        switch(method){
            case 'cancel':
                contract.methods.cancel().send()
                break;
            case 'charge':
                contract.methods.charge(input.charge).send()
                break;
            case 'newChanceRoom':
                contract.methods.newChanceRoom(input.info,input.baseURI,
                input.gateFee,input.percentCommission,
                input.userLimit,input.timeLimit).send({from:account})
                break
            case 'signInVIP':
                contract.methods.signInVIP("0xA3a8a63EDfC22e6644D0137b1657c4b6f13EC9a9",'lary',"noIfno").send({from:account,value:1000000})
                break;
            case 'select':
                contract.methods.randomness(input.select).send()
                break;
            case 'signIn':
                contract.methods.signIn(input.signIn).send({from:account})
                break;
            case 'upgradeRNC':
                contract.methods.upgradeRNC(input.upgradeRNC).send()
                break;
            case 'withdrawCommission':
                contract.methods.withdrawCommission().send()
                break;
        }
    }
    const handleChange = (e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    useEffect(()=>{
        if(active){
          
        }
    },[active])
    return (
        <div className="w-100 h-100">
            <div className='d-flex flex-column'>
                <div className="d-flex justify-content-center">
                    <Input type="text" name="info" 
                        onChange={handleChange} placeholder={"info"}
                        style={{width:'20rem'}}
                    />
                    <Input className="" type="text" name="baseURI" 
                        onChange={handleChange} placeholder={"baseURI"}
                        style={{width:'20rem'}}
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <Input className="" type="text" name="gateFee" 
                        onChange={handleChange} placeholder={"gateFee"}
                        style={{width:'20rem'}}
                    />
                    <Input className="" type="text" name="percentCommission" 
                        onChange={handleChange} placeholder={"percentCommission"}
                        style={{width:'20rem'}}
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <Input className="" type="text" name="userLimit" 
                        onChange={handleChange} placeholder={"userLimit"}
                        style={{width:'20rem'}}
                    />
                    <Input className="" type="text" name="timeLimit" 
                        onChange={handleChange} placeholder={"timeLimit"}
                        style={{width:'20rem'}}
                    />
                </div>
                <button className="contract-button mx-auto" 
                onClick={()=>sendData('newChanceRoom')}
                style={{width:'24rem'}}
                >new chance room</button>
            </div>
        </div>
    )
}

export default CreateChanceRoom;
