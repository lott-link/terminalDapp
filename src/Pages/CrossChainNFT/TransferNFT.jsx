import React, { useState , useEffect , useContext, useRef } from 'react'
import styles from './SelectNFT.module.css'
import Input from '../../Components/styled/input'
import Button from '../../Components/styled/Button'
import { context } from '../../App'
import { useWeb3React } from '@web3-react/core'
import ProgressBar from '../../Components/ProgressBar'
import { crossChainNFTABI as abi } from '../../Contracts/ContractsABI'
const TransferNFT = ({selectedToken,transferBtn,setTransferBtn,
                        setStages,setCircles,selectedWay})=>{
    const { active, account, library } = useWeb3React()
    const data = useContext(context)
    const [allChains,setAllChains] = useState([])
    const [fee,setFee] = useState(0)
    const [address,setAddress] = useState("")
    const [addressSmall,setAddressSmall] = useState("")
    const [targetChain,setTargetChain] = useState("")
    const ref2 = useRef(null)
    const transfer = ()=>{
        if(address.length===0){
            setAddressSmall("address can't be empty")
            return
        }
        setTransferBtn({...transferBtn,disabled:true,approving:true})
        // const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"chainId","type":"uint256"},{"indexed":false,"internalType":"address","name":"contAddr","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"to","type":"address"}],"name":"RelayerCallRedeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"targetChainId","type":"uint256"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"chainId","type":"uint256"},{"indexed":false,"internalType":"address","name":"contAddr","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"uri","type":"string"}],"name":"RelayerCallSafeMintWrappedToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"wTokenId","type":"uint256"}],"name":"TokenWrapped","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"wTokenId","type":"uint256"}],"name":"WTokenBurned","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wTokenId","type":"uint256"}],"name":"burnWrappedToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"targetChainId","type":"uint256"}],"name":"getFee","outputs":[{"internalType":"uint256","name":"fee","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contAddr","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"redeem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"relayer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"contAddr","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"string","name":"uri","type":"string"}],"name":"safeMintWrappedToken","outputs":[{"internalType":"uint256","name":"wTokenId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"targetChainId","type":"uint256"},{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"targetChainIds","type":"uint256[]"},{"internalType":"uint256[]","name":"fees","type":"uint256[]"}],"name":"setFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newRelayer","type":"address"}],"name":"setRelayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contAddr","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"targetChainId","type":"uint256"}],"name":"transferCrossChainRequest","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wTokenId","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"wReturnCrossChainRequest","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address payable","name":"to","type":"address"}],"name":"withdrawCash","outputs":[],"stateMutability":"nonpayable","type":"function"}]
        const contract = new library.eth.Contract(abi,data.addresses[data.network]["crossChain"])
        console.log("params",selectedToken,account,data.addresses[data.network]["crossChain"],targetChain)
        contract.methods[selectedWay ? "transferCrossChainRequest" : "wReturnCrossChainRequest"](
        selectedToken.contractAddress,selectedToken.tokenID,
        account,address,targetChain).send({from:account,value:parseInt(fee)})
        .on("transactionHash",transactionHash=>{
            setTransferBtn({...transferBtn,loading:true,approving:false})
        })
        .on("receipt",receipt=>{
            setTransferBtn({disabled:false,approving:false,loading:false,msg:""})
            setStages([true,false])
            setCircles([true,false])
        })
        .on("error",error=>{
            setTransferBtn({disabled:false,approving:false,loading:false,msg:error.msg})
            console.log("error in sending info",error)
        })
    }
    const handleTarget = (e)=>{
        setTargetChain(
            data.chains[e.target.value]["chainIdDecimal"]
        )
    }
    const getFee = async ()=>{
        if(!active) return;
        if(!data.network) return;
        // const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"chainId","type":"uint256"},{"indexed":false,"internalType":"address","name":"contAddr","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"to","type":"address"}],"name":"RelayerCallRedeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"targetChainId","type":"uint256"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"chainId","type":"uint256"},{"indexed":false,"internalType":"address","name":"contAddr","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"uri","type":"string"}],"name":"RelayerCallSafeMintWrappedToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"wTokenId","type":"uint256"}],"name":"TokenWrapped","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"wTokenId","type":"uint256"}],"name":"WTokenBurned","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wTokenId","type":"uint256"}],"name":"burnWrappedToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"targetChainId","type":"uint256"}],"name":"getFee","outputs":[{"internalType":"uint256","name":"fee","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contAddr","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"redeem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"relayer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"contAddr","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"string","name":"uri","type":"string"}],"name":"safeMintWrappedToken","outputs":[{"internalType":"uint256","name":"wTokenId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"targetChainId","type":"uint256"},{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"targetChainIds","type":"uint256[]"},{"internalType":"uint256[]","name":"fees","type":"uint256[]"}],"name":"setFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newRelayer","type":"address"}],"name":"setRelayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contAddr","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"targetChainId","type":"uint256"}],"name":"transferCrossChainRequest","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wTokenId","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"wReturnCrossChainRequest","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address payable","name":"to","type":"address"}],"name":"withdrawCash","outputs":[],"stateMutability":"nonpayable","type":"function"}]
        const contract = new library.eth.Contract(abi,data.addresses[data.network]["crossChain"])
        const tempFee = await contract.methods.getFee(targetChain).call();
        setFee(tempFee)
    }
    const setTarget = ()=>{
        if(selectedWay===false){
            const contract = new library.eth.Contract(abi,data.addresses[data.network]["crossChain"])
            contract.methods().getwTokenData(selectedToken.tokenID).then(res=>{
                setTargetChain(res.chainId)
                ref2.current.value = data.converChainIDToName(res.chainId)
            })
        }
        else {
            ref2.current.value = data.network;
            data.network &&
            setTargetChain(data.chains[data.network]["chainIdDecimal"])
        }
    }
    useEffect(()=>{
        setTarget()
        if(active){
            setAddress(account)
        }
    },[data.network])
    useEffect(()=>{
        if(targetChain) getFee()
    },[targetChain])
    useEffect(()=>{
        const tempAllChains = []
        for(let key in data.addresses){
            tempAllChains.push(key)
        }
        setAllChains(tempAllChains)
    },[])
    return(
        <div className={`w-50 h-100 p-2 mx-auto ${styles["animation-in"]}`} style={{borderRight:"1px solid white",borderLeft:"1px solid white",position:"relative"}}>
            <div className='w-100 h-100' style={{border:"1px solid white"}}>
                <div className='text-center py-4' style={{borderBottom:"1px solid white",fontSize:"22px"}}>
                    Cross Chainin
                </div>
                <div className='py-3 px-4 text-center'>
                    <div>
                        select your destination network
                    </div>
                    <div className='text-center m-3' >
                        <select  name="" className={`${styles.select} p-1 text-center`} 
                        onChange={handleTarget} ref={ref2} disabled={!selectedWay}
                        style={{width:'24rem'}}>
                            {
                            allChains.map(item=><option key={item} value={item}>{item}</option>)
                            }
                        </select>
                    </div>
                    <div className='my-4'>
                        <div>select your destination address</div>
                        <Input style={{width:'24rem'}} 
                        small={addressSmall} success={addressSmall.length !==0 ? true : false}
                        value={address} onChange={e=>{setAddress(e.target.value);setAddressSmall("")}} 
                        title="address" className="" name="address"  type="text" />
                        <div className='text-center py-2 px-4' style={{color:"#FF00FF"}}>
                        becurfull your destination address must be on your destination network
                        </div>
                    </div>
                </div> 
                <div className="text-center text-dark">
                    <div className="bg-white d-flex justify-content-around align-items-center " style={{margin:"0 40px"}}>
                        <div className='d-flex w-50'>
                            <div className="mx-4">{fee}</div>
                            <div><img  style={{width:'25px',height:'25px'}}
                            src={data.network && data.chains[data.network].icon} alt="" /></div>
                        </div>
                        <div className="w-50">
                            <Button onClick={transfer} secondary>
                            Safe Mint CrossChain
                            </Button>
                        </div>
                    </div>
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