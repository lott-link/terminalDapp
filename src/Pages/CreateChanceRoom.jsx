import React, { useState, useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import Input from '../Components/styled/input' 
import { context } from '../App'
import { factoryContractABI } from '../Contracts/ContractsABI'
const CreateChanceRoom = () => {
    const { account,library } = useWeb3React()
    const data = useContext(context)
    const [input,setInput] = useState({
        info:'',
        baseURI:'',
        gateFee:'',
        percentCommision:'',
        userLimit:'',
        timeLimit:'',
    })
    const createChanceRoom = ()=>{
        library.setProvider(library.givenProvider)
        const contract = new library.eth.Contract(factoryContractABI,data.addresses[data.network]['factory']);
        contract.methods.newChanceRoom(input.info,input.baseURI,
            input.gateFee,input.percentCommission,
            input.userLimit,input.timeLimit).send({from:account})       
    }
    const handleChange = (e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    return (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <div className='d-flex flex-column'>
                <div className="d-flex justify-content-center">
                    <Input type="text" name="info" 
                        onChange={handleChange} title={"info"}
                        style={{width:'21rem'}} value={input.info}
                    />
                    <Input className="" type="text" name="baseURI" 
                        onChange={handleChange} title={"baseURI"}
                        style={{width:'21rem'}} value={input.baseURI}
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <Input className="" type="text" name="gateFee" 
                        onChange={handleChange} title={"gateFee"}
                        style={{width:'21rem'}} value={input.gateFee}
                    />
                    <Input className="" type="text" name="percentCommission" 
                        onChange={handleChange} title={"percentCommission"}
                        style={{width:'21rem'}} value={input.percentCommission}
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <Input className="" type="text" name="userLimit" 
                        onChange={handleChange} title={"userLimit"}
                        style={{width:'21rem'}} value={input.userLimit}
                    />
                    <Input className="" type="text" name="timeLimit" 
                        onChange={handleChange} title={"timeLimit"}
                        style={{width:'21rem'}} value={input.timeLimit}
                    />
                </div>
                <button className="contract-button mx-auto" 
                onClick={createChanceRoom}
                style={{width:'24rem'}}
                >new chance room</button>
            </div>
        </div>
    )
}

export default CreateChanceRoom;
