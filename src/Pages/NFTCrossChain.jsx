import React, { useState , useEffect , useContext , useRef } from 'react'
import styles from './NFTCrossChain.module.css'
import { context } from '../App'
import { OverlayTrigger, Tooltip} from 'react-bootstrap'
import SelectNFT from './CrossChainNFT/SelectNFT'
import TransferNFT from './CrossChainNFT/TransferNFT'
import InfoPage from './CrossChainNFT/InfoPage'
const NFTCrossChain = () => {
    const data = useContext(context)
    const [availableChains,setAvailableChains] = useState([])
    const [stages,setStages] = useState([true,false,false])
    const [circles,setCircles] = useState([true,false,false])
    const [selectedToken,setSelectedToken] = useState("")
    const [selectedWay,setSelectedWay] = useState()
    const [approveBtn,setApproveBtn] = useState({
        disabled:false,loading:false,approving:false,msg:""
    })
    const [transferBtn,setTransferBtn] = useState({
        disabled:false,loading:false,approving:false,msg:""
    })
    const handleNetworkChange = (e)=>{
        data.setNetwork(e.target.value)
        if(window.ethereum){
            window.ethereum
                .request({
                  method: "wallet_addEthereumChain",
                  params: data.chains[e.target.value]["params"]
            })
            let chainId = data.chains[e.target.value]["chainIdHex"]
            window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId }],
            })
        }
    }
    const back = ()=>{
        const index = stages.findIndex(item=>item=== true )
        const tempStages = stages;
        const tempCircles = circles;
        tempStages[index] = false;
        tempStages[index-1] = true;
        tempCircles[index] = false;
        setStages([...tempStages])
        setCircles([...tempCircles])
    }
    const ref = useRef(null)
    useEffect(()=>{
        ref.current.value = data.network;
    },[data.network])
    useEffect(()=>{
        const tempChains = []
        for(let key in data.addresses){
            if(data.addresses[key].crossChain && data.addresses[key].crossChain.length!==0)
                tempChains.push(key)
        }
        setAvailableChains(tempChains)
    },[])
    return (
        <div className='w-100 h-100' style={{display:'flex',flexFlow:'column'}} >
            <div className='d-flex justify-content-between py-2' style={{borderBottom:"1px solid white"}}>
                <div onClick={back} style={{cursor:"pointer"}} className='mx-4 my-auto'>{!stages[0] && "back"}</div>
                <div className='my-auto'>
                Cross Chain NFT
                <OverlayTrigger key={"bottom"} placement={"bottom"}
                overlay={
                <Tooltip >
                In this contract you can mint a Wrap token 
                from your NFT in any EVM network, 
                your token will lock in CRN contract. 
                any one that has the Wrapped token of your 
                NFT can unlock the NFT from contract.
                 you can read more about thin contract HERE.
                </Tooltip>
              }
            >
              <img className='mx-2 m-1' src="/info.svg" alt="" />
            </OverlayTrigger>
                </div>
                <div className='mx-4'>
                    <select ref={ref} onChange={handleNetworkChange} name="" className={styles.select}>
                        {availableChains.map(item=>(<option key={item} value={item}>{item}</option>))}
                    </select>
                </div>
            </div>
            <div style={{borderRight:"1px solid white",borderLeft:"1px solid white",position:"relative",
            backgroundColor:(approveBtn.loading || approveBtn.approving || transferBtn.loading || transferBtn.approving)?"rgba(2,117,216,0.5)":""}}
            className='d-flex justify-content-center pt-2 w-50 mx-auto'>
                {
                circles.map((item,index)=>{
                    if(item) return(
                        <div key={index} className='mx-2' 
                        style={{width:"15px",height:'15px',backgroundColor:"white",borderRadius:'50%'}}></div>
                    )
                    else return(
                        <div key={index} className='mx-2' 
                        style={{width:"15px",height:'15px',backgroundColor:"white",borderRadius:'50%',opacity:'50%'}}></div>
                    )
                })
                }
            </div>
            <div className='d-flex justify-content-center' style={{flexGrow:"1"}}>
                {stages[0] && <InfoPage setCircles={setCircles} setStages={setStages} setSelectedWay={setSelectedWay}/>}
                {stages[1] && <SelectNFT setSelectedToken={setSelectedToken} selectedToken={selectedToken}
                 approveBtn={approveBtn} setApproveBtn={setApproveBtn} setCircles={setCircles} 
                setStages={setStages} selectedWay={selectedWay} />}
                {stages[2] && <TransferNFT transferBtn={transferBtn} setTransferBtn={setTransferBtn}
                selectedToken={selectedToken} setStages={setStages} setCircles={setCircles} selectedWay={selectedWay} />}
            </div>
        </div>
    )
}
export default NFTCrossChain