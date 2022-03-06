import React, { useState , useEffect , useContext , useRef } from 'react'
import styles from './NFTCrossChain.module.css'
import { context } from '../App'
import { OverlayTrigger, Tooltip} from 'react-bootstrap'
import SelectNFT from './CrossChainNFT/SelectNFT'
import TransferNFT from './CrossChainNFT/TransferNFT'
import InfoPage from './CrossChainNFT/InfoPage'
import { useLocation } from 'react-router-dom' 
import { useWeb3React } from '@web3-react/core'
import useWidth from '../Hooks/useWidth'
const NFTCrossChain = ({props}) => {
    const { active } = useWeb3React()
    const data = useContext(context)
    const width = useWidth()
    const location = useLocation()
    const [availableChains,setAvailableChains] = useState([])
    const [stages,setStages] = useState([true,false,false])
    const [circles,setCircles] = useState([true,false,false])
    const [selectedToken,setSelectedToken] = useState("")
    const [selectedWay,setSelectedWay] = useState()
    const [isSafeTransfer,setIsSafeTransfer] = useState(false)
    const [approveBtn,setApproveBtn] = useState({
        disabled:false,loading:false,approving:false,msg:""
    })
    const [transferBtn,setTransferBtn] = useState({
        disabled:false,loading:false,approving:false,msg:""
    })
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
    useEffect(()=>{
        const tempChains = []
        for(let key in data.addresses){
            if(data.addresses[key].crossChain && data.addresses[key].crossChain.length!==0)
                tempChains.push(key)
        }
        setAvailableChains(tempChains)

        if(location.state){
            setSelectedToken(location.state.token)
            if(location.state.type === "crossChain"){
                if(location.state.token.contractAddress.toLowerCase() !== data.addresses[data.network]["crossChain"].toLowerCase()){
                    //when the nft is from another contract
                    //and we want to mint it with our crosschain contract
                    setCircles([true,true,false])
                    setStages([false,true,false])
                    setSelectedWay(true)
                }else{
                    //when nft is from crosschain contract and we
                    //want to release it give it back to it's last
                    //contract
                    setCircles([true,true,false])
                    setStages([false,true,false])
                    setSelectedWay(false)
                }
            }
            else if(location.state.type === "transfer"){
                //coming from asset page
                setIsSafeTransfer(true)
                setCircles([true,true,true])
                setStages([false,false,true])
                setSelectedWay(true)
            }
        }
        if(location.pathname === "/tools/transfer"){
            //coming from transfer standAlone page
            setIsSafeTransfer(true)
            setCircles([true,false])
            setStages([false,true,false])
            setSelectedWay(true)
        }
    },[])
    if(!active)
        return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">please connect your wallet</h2>)
    else if(!data.pageSupported) 
        return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">Chain not supported</h2>)
    else
    return (
        <div className='w-100 h-100' style={{display:'flex',flexFlow:'column'}} >
            <div className='d-flex justify-content-between py-2' style={{borderBottom:"1px solid black"}}>
                <div onClick={back} style={{cursor:"pointer"}} className='mx-4 my-auto'>{!stages[0] && "back"}</div>
                <div className='my-auto'>
                {isSafeTransfer ? "Transfer" : "Cross Chain NFT"}
                {!isSafeTransfer &&
                <OverlayTrigger key={"bottom"} placement={"bottom"}
                overlay={
                <Tooltip >
                In this contract you can mint a Wrap token 
                from your NFT in any EVM network, 
                your token will lock in CRN contract. 
                any one that has the Wrapped token of your 
                NFT can unlock the NFT from contract.
                 you can read more about thin contract HERE.
                </Tooltip>}>
              <img className='mx-2 m-1' src="/info.svg" alt="" />
            </OverlayTrigger>}
                </div>
                <div className='d-flex' style={{paddingRight:'10px'}}>
                {
                availableChains.map((chain,index)=> (
                    <OverlayTrigger key={index} placement={"bottom"}  overlay={<Tooltip >{chain}</Tooltip>}>
                    <div className="mx-1">
                        <a href={data.chains[chain].params[0].blockExplorerUrls[0]+"/"+"address"+"/"+data.addresses[chain].crossChain}
                            target="_blank" rel="noreferrer" 
                        >
                            <img style={{width:'20px',height:'20px'}} src={data.chains[chain].icon} alt={chain+"icon"} />  
                        </a>
                    </div>
                    </OverlayTrigger>
                    )
                )
                }
                </div>
            </div>
            <div style={{borderRight:"1px solid black",borderLeft:"1px solid black",position:"relative",
            backgroundColor:(approveBtn.loading || approveBtn.approving || transferBtn.loading || transferBtn.approving)?"rgba(2,117,216,0.5)":""}}
            className={`d-flex justify-content-center pt-2 ${width < 992 ? "w-100" : "w-50"} mx-auto`}>
                {
                circles.map((item,index)=>{
                    if(item) return(
                        <div key={index} className='mx-2' 
                        style={{width:"15px",height:'15px',backgroundColor:"black",borderRadius:'50%'}}></div>
                    )
                    else return(
                        <div key={index} className='mx-2' 
                        style={{width:"15px",height:'15px',backgroundColor:"black",borderRadius:'50%',opacity:'50%'}}></div>
                    )
                })
                }
            </div>
            <div className='d-flex justify-content-center' style={{flexGrow:"1",height:"calc(90vh - 6rem)"}}>
                {stages[0] && <InfoPage setCircles={setCircles} setStages={setStages} setSelectedWay={setSelectedWay}/>}
                {stages[1] && <SelectNFT setSelectedToken={setSelectedToken} selectedToken={selectedToken}
                 approveBtn={approveBtn} setApproveBtn={setApproveBtn} setCircles={setCircles} 
                setStages={setStages} selectedWay={selectedWay} isSafeTransfer={isSafeTransfer} />}
                {stages[2] && <TransferNFT transferBtn={transferBtn} setTransferBtn={setTransferBtn} isSafeTransfer={isSafeTransfer}
                selectedToken={selectedToken} setStages={setStages} setCircles={setCircles} selectedWay={selectedWay} />}
            </div>
        </div>
    )
}
export default NFTCrossChain