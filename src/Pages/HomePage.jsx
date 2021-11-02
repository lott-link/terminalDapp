import React from 'react'
import { useWeb3React } from '@web3-react/core'
import {contractABI,contractAddress} from '../Contracts/ContractInfo'
const HomePage = () => {
    const {account,library} = useWeb3React()
    const [watingToApprove,setWatingToApprove] = React.useState()
    const [watingToConfirm,setWatingToConfirm] = React.useState()
    const [successful,setSuccessful] = React.useState()

    const handle = async ()=>{
        fetch('/estimatedtime')
        .then(res=>res.json())
        .then(data=>console.log(data))
    }
    const handle2 = ()=>{
        fetch('/estimatedtime',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body:JSON.stringify({
                time:23
            })
        })
    }
    const sendInfo = ()=>{
        setWatingToApprove(true)
        const data = JSON.stringify({telegram:'mmdaminah'}).replaceAll("\"","\'")
        const contract = new library.eth.Contract(contractABI,contractAddress)
        contract.methods.setInfo(JSON.stringify(data)).send({from:account})
        // .then(res=>{
        //     console.log("this is response in then",res)
        //     setWatingToConfirm(false)
        // })
        .on("sending",payload=>console.log("this is sending event",payload))
        .on("sent",payload=>console.log("this is sent event",payload))
        .on("transactionHash",transactionHash=>{
            setWatingToApprove(false)
            setWatingToConfirm(true)
            console.log("this is txhash event",transactionHash)
        })
        .on("receipt",receipt=>{
            setWatingToConfirm(false)
            setSuccessful(true)
            console.log("this is receipt event",receipt)
        })
        // .on("confirmation",(confirmation,receipt,latestBlockHash)=>console.log("this is confir event",confirmation,receipt,latestBlockHash))
        .on("error",error=>console.log("error",error))
    }
    return (
        <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{overflow:'auto'}}>
            <div>
                <div style={{whiteSpace:'pre'}}> =======================================================================</div>
                <div style={{whiteSpace:'pre'}}>  ██       ██████  ████████ ████████    ██      ██ ███    ██ ██   ██</div>
                <div style={{whiteSpace:'pre'}}>  ██      ██    ██    ██       ██       ██      ██ ████   ██ ██  ██</div>
                <div style={{whiteSpace:'pre'}}>  ██      ██    ██    ██       ██       ██      ██ ██ ██  ██ █████</div>
                <div style={{whiteSpace:'pre'}}>  ██      ██    ██    ██       ██       ██      ██ ██  ██ ██ ██  ██</div>
                <div style={{whiteSpace:'pre'}}>  ███████  ██████     ██       ██    ██ ███████ ██ ██   ████ ██   ██    </div>
                <div style={{whiteSpace:'pre'}}></div>
                <div style={{whiteSpace:'pre'}}> ================ Open source smart contract on EVM ===================</div>
                <div style={{whiteSpace:'pre'}}>  =============== Verify Random Function by ChanLink ================</div>
            </div>
            <button onClick={handle}>request getting</button>
            <button onClick={handle2}>request sending</button>
            <button onClick={sendInfo}>send info</button>
            {watingToApprove && <div className="text-danger">wating to approve</div>}
            {watingToConfirm && <div className="text-warning">wating for confirm</div>}
            {successful && <div className="text-success">transaxtion successful</div>}
        </div>
    )
}
export default HomePage;