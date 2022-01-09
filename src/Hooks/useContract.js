import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
const useContract = ({}) => {
    const { account } = useWeb3React()
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [sendDisabled,setSendDisabled] = useState(false)
    const [sendLoading,setSendLoading] = useState(false)
    const [loadingMsg,setLoadingMsg] = useState()
    const [now,setNow] = useState(0)
    const [func,setFunc] = useState({func:()=>{},init:false})
    const estimatedTime = 15;
    const progress = ()=>{
        const interval = setInterval(()=>{
            let state;
            setNow(prev => state=prev)
            console.log(state)
            if(state+100/estimatedTime>=100){
                setNow(100)
                clearInterval(interval)
            }
            else
                setNow(prevState => Math.floor(prevState+100/estimatedTime))
        },1000)
    }
    const method = ()=>{
        if(!func.init) return
        setSendDisabled(true)
        setSendLoading(true)
        setButtonDisabled(true)
        setLoadingMsg("Wating to approve")
        func.func().send({from:account})
        .on("transactionHash",transactionHash=>{
            setLoadingMsg('Wating to comfirm')
            progress()
        })
        .on("receipt",receipt=>{
            setNow(0)
            setLoadingMsg()
            setSendDisabled(false)
            setSendLoading(false)
            setButtonDisabled(false)
        })
        .on("error",error=>{
            setLoadingMsg()
            setSendDisabled(false)
            setSendLoading(false)
            setButtonDisabled(false)
            console.log("error in sending info",error)
        })
    }
    return {buttonDisabled,sendDisabled,now,loadingMsg,sendLoading}
}

export default useContract
