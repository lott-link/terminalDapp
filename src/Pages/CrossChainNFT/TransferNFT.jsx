import React, { useState , useEffect , useContext, useRef } from 'react'
import styles from './SelectNFT.module.css'
import Input from '../../Components/styled/input'
import Button from '../../Components/styled/Button'
import { context } from '../../App'
import { useWeb3React } from '@web3-react/core'
import ProgressBar from '../../Components/ProgressBar'
import { crossChainNFTABI as abi, NFTContractABI } from '../../Contracts/ContractsABI'
import { OverlayTrigger, Tooltip} from 'react-bootstrap'
import useWidth from '../../Hooks/useWidth'
const TransferNFT = ({selectedToken,transferBtn,setTransferBtn,
                        setStages,setCircles,selectedWay,isSafeTransfer})=>{
    const { active, account, library } = useWeb3React()
    const data = useContext(context)
    const width = useWidth()
    const [allChains,setAllChains] = useState([])
    const [fee,setFee] = useState(0)
    const [address,setAddress] = useState("")
    const [addressSmall,setAddressSmall] = useState("")
    const [targetChain,setTargetChain] = useState("")
    const ref2 = useRef(null)
    const transfer = async ()=>{
        if(address.length===0){
            setAddressSmall("address can't be empty")
            return
        }
        // console.log("targetchain",targetChain)
        // const tempContract = new library.eth.Contract(abi,data.addresses[data.network]["crossChain"])
        // const tempFee = await tempContract.methods.mintFee(targetChain).call();
        // console.log("tempFee",tempFee)

        setTransferBtn({...transferBtn,disabled:true,approving:true})
        const contract = new library.eth.Contract(abi,data.addresses[data.network]["crossChain"])
        contract.methods.requestTransferCrossChain(
        selectedToken.contractAddress,account,targetChain,address
        ,selectedToken.tokenID,account).send({from:account,value:parseInt(fee)})
        .on("transactionHash",transactionHash=>{
            setTransferBtn({...transferBtn,loading:true,approving:false})
        })
        .on("receipt",receipt=>{
            setTransferBtn({disabled:false,approving:false,loading:false,msg:""})
            setStages([true,false,false])
            setCircles([true,false,false])
        })
        .on("error",error=>{
            setTransferBtn({disabled:false,approving:false,loading:false,msg:error.msg})
            console.log("error in sending info",error)
        })
    }
    const release = ()=>{
        if(address.length===0){
            setAddressSmall("address can't be empty")
            return
        }
        setTransferBtn({...transferBtn,disabled:true,approving:true})
        const contract = new library.eth.Contract(abi,data.addresses[data.network]["crossChain"])
        contract.methods.requestReleaseLockedToken(
        selectedToken.tokenID,address,account).send({from:account,value:parseInt(fee)})
        .on("transactionHash",transactionHash=>{
            setTransferBtn({...transferBtn,loading:true,approving:false})
        })
        .on("receipt",receipt=>{
            setTransferBtn({disabled:false,approving:false,loading:false,msg:""})
            setStages([true,false,false])
            setCircles([true,false,false])
        })
        .on("error",error=>{
            setTransferBtn({disabled:false,approving:false,loading:false,msg:error.msg})
            console.log("error in sending info",error)
        }) 
    }
    const safeTranferFrom = ()=>{
        if(address.length===0){
            setAddressSmall("address can't be empty")
            return
        }
        setTransferBtn({...transferBtn,disabled:true,approving:true})
        const contract = new library.eth.Contract(NFTContractABI,data.addresses[data.network]["NFT"])
        contract.methods.safeTransferFrom(account,address,selectedToken.tokenID)
        .send({from:account})
        .on("transactionHash",transactionHash=>{
            setTransferBtn({...transferBtn,loading:true,approving:false})
        })
        .on("receipt",receipt=>{
            setTransferBtn({disabled:false,approving:false,loading:false,msg:""})
            setStages([true,false,false])
            setCircles([true,false,false])
        })
        .on("error",error=>{
            setTransferBtn({disabled:false,approving:false,loading:false,msg:error.msg})
            console.log("error in sending info",error)
        })
    }
    const handleTarget = (e)=>{
        setTargetChain(
            data.chains[e.target.value]["chainIdHex"]
        )
        console.log("some shit changed")
        mintFee()
    }
    const mintFee = async ()=>{
        if(!active || !selectedWay) return;
        if(!data.network || !data.chains) return;
        console.log(targetChain)
        const contract = new library.eth.Contract(abi,data.addresses[data.network]["crossChain"])
        console.log("some shit happens here",targetChain)
        const tempFee = await contract.methods.mintFee(data.chains[data.converChainIDToName(targetChain)]["chainIdHex"]).call();
        setFee(tempFee)
    }
    const setTarget = ()=>{
        if(selectedWay===false){
            const contract = new library.eth.Contract(abi,data.addresses[data.network]["crossChain"])
            contract.methods.getLockedTokenData(selectedToken.tokenID).call().then(res=>{
                console.log(res)
                setTargetChain(data.converChainIDToName(parseInt(res.chainId)))
                console.log(data.converChainIDToName(parseInt(res.chainId)))
                setFee(res.releaseGasFee)
                ref2.current.value = data.converChainIDToName(parseInt(res.chainId))
            })
        }
        else {
            ref2.current.value = data.network;
            data.network &&
            setTargetChain(data.chains[data.network]["chainIdHex"])
        }
    }
    useEffect(()=>{
        setTarget()
        if(active){
            if(!isSafeTransfer)
                setAddress(account)
        }
    },[data.network])
    useEffect(()=>{
        if(targetChain) mintFee()
    },[targetChain])
    useEffect(()=>{
        const tempAllChains = []
        for(let key in data.addresses){
            tempAllChains.push(key)
        }
        setAllChains(tempAllChains)
    },[])
    return(
        <div className={`${width < 992 ? "w-100" : "w-50"} p-2 mx-auto ${styles["animation-in"]}`} 
        style={{height:'100vh',borderRight:"1px solid white",borderLeft:"1px solid white",position:"relative"}}>
            <div className='w-100 h-100' style={{border:"1px solid white"}}>
                <div className='text-center py-4' style={{borderBottom:"1px solid white",fontSize:"22px"}}>
                    {isSafeTransfer ? "Transfer NFT" : "Cross Chainin"}
                </div>
                <div className={`py-3 text-center ${width > 992 ? "px-4" : "px-2"}`}>
                    <div style={{display:isSafeTransfer?"none":"block"}}>
                        select your destination network
                    </div>
                    <div className={`text-center ${width > 992 && "m-3"}`} style={{display:isSafeTransfer?"none":"block"}}>
                        <select  name="" className={`${styles.select} p-1 text-center`} 
                        onChange={handleTarget} ref={ref2} disabled={!selectedWay}
                        style={{width:width> 992 ? '24rem':'19rem'}}>
                            {
                            allChains.map(item=><option key={item} value={item}>{item}</option>)
                            }
                        </select>
                    </div>
                    <div className='my-4'>
                        <div>select your destination address</div>
                        <Input style={{width:width> 992 ? '24rem':'19rem'}} 
                        small={addressSmall} success={addressSmall.length !==0 ? true : false}
                        value={address} onChange={e=>{setAddress(e.target.value);setAddressSmall("")}} 
                        title="address" className="" name="address"  type="text" />
                        {!isSafeTransfer && <div className='text-center py-2 px-4' style={{color:"#FF00FF"}}>
                        becarefull your destination address must be on your destination network
                        </div>}
                    </div>
                </div> 
                <div className="text-center text-dark">
                    {!isSafeTransfer &&
                    <div className="bg-white d-flex justify-content-around align-items-center " style={{margin:"0 40px"}}>
                        <div className='d-flex '>
                            <OverlayTrigger  placement={"bottom"}  overlay={<Tooltip >{fee} wei</Tooltip>}>
                                <div className="mx-4">{(fee/10e18).toFixed(4)}</div>
                            </OverlayTrigger>
                            <div><img  style={{width:'25px',weight:'25px'}}
                            src={data.network && data.chains[data.network].icon} alt="" /></div>
                        </div>
                        <div className="">
                        { selectedWay ?
                        <Button onClick={transfer} secondary>
                        Safe Mint CrossChain
                        </Button>
                        :
                        <Button onClick={release} secondary>
                        Safe Mint CrossChain
                        </Button>
                        }
                        </div>
                    </div>
                    }
                    {
                        isSafeTransfer &&
                        <div>
                            <Button onClick={safeTranferFrom} secondary>Safe Transfer</Button>
                        </div>
                    }
                    {/* <Button onClick={transfer}
                    className="w-75 d-flex justify-content-between mx-auto" primary>
                        <div>Safe Mint CrossChain</div> 
                        <div className='d-flex'>
                            <div className='mx-1'>{fee}</div>
                            <div><img style={{width:'25px',height:'25px'}} src={data.network && data.chains[data.network].icon} alt="" /></div>
                        </div>
                    </Button>                             */}
                </div>
                <div className='text-center'style={{padding:"0 48px"}}>your NFT will appear in your destination address in a few minutes</div>
            </div>
            {transferBtn.loading && <ProgressBar estimatedTime={10}/>}
            {transferBtn.approving && 
            <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center" 
            style={{position:'absolute',top:'0',left:'0',zIndex:"20",backgroundColor:"rgba(2,117,216,0.5)"}}>
                 <h4 className='bg-white text-dark larger p-2'>wating for metamask comfirm...</h4>
            </div>
            }
        </div>
    )
}
export default TransferNFT