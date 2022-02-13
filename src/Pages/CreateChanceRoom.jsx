import React, { useState, useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useHistory } from 'react-router-dom'

import Input from '../Components/styled/input' 
import { context } from '../App'
import { factoryContractABI } from '../Contracts/ContractsABI'

const CreateChanceRoom = () => {
    const { account,library } = useWeb3React()
    const history = useHistory()
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
        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center position-relative">
            <div className='position-absolute top-0 p-2' onClick={()=>history.push('/contract/chanceroomlist')}
            style={{left:0,cursor:'pointer'}}>back</div>
            <div className='d-flex justify-content-center flex-wrap'>
                {
                ["info","baseURI","gateFee","percentCommision","userLimit","timeLimit"].map((item,index)=>(
                    <Input type="text" name={item} key={index}
                        onChange={handleChange} title={item}
                        style={{width:'21rem'}} value={input[item]}
                    />
                ))
                }
                <button className="contract-button mx-auto" 
                onClick={createChanceRoom}
                style={{width:'24rem'}}
                >new chance room</button>
            </div>
        </div>
    )
}

export default CreateChanceRoom;
