import React, { useState , useEffect , useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import { OverlayTrigger, Tooltip} from 'react-bootstrap'

import Button from '../../Components/styled/Button'
import { context } from '../../App'
import ProgressBar from '../../Components/ProgressBar'
import useWidth from '../../Hooks/useWidth'
import styles from './SelectNFT.module.css'
import { contractABI } from './SelectNFTABI'

const SelectNFT = ({approveBtn,setApproveBtn,setCircles,setStages
                    ,selectedToken,setSelectedToken,
                    selectedWay,isSafeTransfer})=>{
    const { active, account, library, chainId } = useWeb3React()
    const data = useContext(context)
    const width = useWidth()
    const [tokens,setTokens] = useState([])
    const [loadingTable,setLoadingTable]=useState(true)
    const [selectedIndex,setSelectedIndex] = useState("")
    const [approveCheck,setApproveCheck] = useState(false)
    const [showBtns,setShowBtns] = useState(false)
    const [conditionLoding,setConditionLoading] = useState(false)
    const getERC721 = async ()=>{
        if(!active) return;
        setLoadingTable(true)
        setTokens([])
        if(!data.network) return
        const array = await axios.get(`${data.addresses[data.network]["erc721API"]}${account}`).then(res=>res.data.result)
        let ids = array.map(token=>token.tokenID+token.contractAddress)
        ids = Array.from(new Set(ids))
        const counts = new Array(ids.length).fill(0)
        for(let i = 0; i < array.length; i++){
          for(let j = 0; j < ids.length; j++){
            if(array[i].tokenID + array[i].contractAddress === ids[j])
              counts[j]++
          }
        }
        let idsToShow = [] 
        counts.forEach((id,index)=> {if(id%2!==0) idsToShow.push(ids[index])})
        if(!data.network) return;
        if(selectedWay){
            idsToShow = idsToShow.filter(item=>  item.slice(1) !== data.addresses[data.network]["crossChain"].toLowerCase())
        }else{
            idsToShow = idsToShow.filter(item=>  item.slice(1) === data.addresses[data.network]["crossChain"].toLowerCase())
        }
        idsToShow.forEach(async id=>{
          const token = await getToken(id.split('0x')[0],"0x"+id.split('0x')[1])
          setTokens(prev=>[...prev,token])
        })
        setLoadingTable(false)
    }
    const getToken = async (tokenID,contractAddress) => {
      if(!active) return;
      const token = localStorage.getItem(contractAddress+tokenID)
      if(token){
        return JSON.parse(token)
      }
      else{
        const contract = new library.eth.Contract(contractABI,contractAddress)
        const tokenURI = await contract.methods.tokenURI(tokenID).call(res=>res)
        const tokenJson = await axios.get(tokenURI).then(res=>res.data)
        const data = {
          name:tokenJson.name,
          description:tokenJson.description,
          image:tokenJson.image,
          tokenID,
          contractAddress,
          chainId
        }
        localStorage.setItem(contractAddress+tokenID,JSON.stringify(data))
        return data
      } 
    }
    const firstApprove = async ()=>{
        setApproveBtn({...approveBtn,disabled:true,approving:true})
        const tokenContract = new library.eth.Contract(contractABI,selectedToken.contractAddress)
        const isApprovedBefore = await tokenContract.methods.getApproved(selectedToken.tokenID).call()
        // const isApproveForAllBefore = await tokenContract.methods.isApprovedForAll(account,data.addresses[data.network]["crossChain"]).call()
        // console.log("isApproveForAllBefore",isApproveForAllBefore)
        // if(isApprovedBefore===data.addresses[data.network]["crossChain"] || isApproveForAllBefore){
        if(isApprovedBefore===data.addresses[data.network]["crossChain"]){
            setApproveBtn({disabled:false,approving:false,loading:false,msg:""})
            next()
            return; 
        }
        tokenContract.methods.approve(data.addresses[data.network]["crossChain"],selectedToken.tokenID).send({from:account})
        .on("transactionHash",transactionHash=>{
            setApproveBtn({...approveBtn,loading:true,approving:false})
        })
        .on("receipt",receipt=>{
            setApproveBtn({disabled:false,approving:false,loading:false,msg:""})
            next()
        })
        .on("error",error=>{
            setApproveBtn({disabled:false,approving:false,loading:false,msg:error.msg})
            console.log("error in sending info",error)
        })
    }
    const setApproveForAll = async ()=>{
        setApproveBtn({...approveBtn,disabled:true,approving:true})
        const tokenContract = new library.eth.Contract(contractABI,selectedToken.contractAddress)
        const isApproveForAllBefore = await tokenContract.methods.isApprovedForAll(account,data.addresses[data.network]["crossChain"]).call()
        if(isApproveForAllBefore){
            setApproveBtn({disabled:false,approving:false,loading:false,msg:""})
            next()
            return; 
        }
        tokenContract.methods.setApprovalForAll(selectedToken.contractAddress,1).send({from:account})
        .on("transactionHash",transactionHash=>{
            setApproveBtn({...approveBtn,loading:true,approving:false})
        })
        .on("receipt",receipt=>{
            setApproveBtn({disabled:false,approving:false,loading:false,msg:""})
            next()
        })
        .on("error",error=>{
            setApproveBtn({disabled:false,approving:false,loading:false,msg:error.msg})
            console.log("error in sending info",error)
        })
    }
    const next = ()=>{
        setStages([false,false,true])
        setCircles([true,true,true])
    }
    useEffect(()=>{
        if(active){
            if(selectedToken && selectedToken.contractAddress){
                setTokens([selectedToken])
                setSelectedIndex(0)
                setLoadingTable(false)
                onChangeToken(selectedToken,0)
            }else{
                getERC721()
            }
        }
    },[data.network])
    const onChangeToken = async (token,index)=>{
        if(isSafeTransfer){
            setSelectedToken(token);
            setSelectedIndex(index);
            return;
        }
        setConditionLoading(true)
        setSelectedToken(token);
        setSelectedIndex(index);
        setShowBtns(true)
        const tokenContract = new library.eth.Contract(contractABI,token.contractAddress)
        const isApprovedBefore = await tokenContract.methods.getApproved(token.tokenID).call()
        if(isApprovedBefore===data.addresses[data.network]["crossChain"]){
            setApproveCheck(true)
        }else{
            setApproveCheck(false)
        }
        setConditionLoading(false)
    }
    return (
        <div className={`${width < 992 ? "w-100" : "w-50"} h-100 p-2 ${styles["animation-in"]}`} 
        style={{borderRight:"1px solid white",borderLeft:"1px solid white",position:"relative"}}>
            <div className='w-100 h-100' style={{border:"1px solid white"}}>
                {selectedWay ?
                <div className='text-center py-4' style={{borderBottom:"1px solid white",fontSize:"22px"}}>
                    Select and Approve
                    <OverlayTrigger key={"bottom"} placement={"bottom"}
                    overlay={
                    <Tooltip >
                    In the next step, your NFT will lock to the smart contract and a new 
                    NFT will mint on your destination Network on the same or different 
                    address that you want, with the same metadata.
                    You can claim this NFT by burning the NFT that mint on other networks.
                    In this step, you must approve your NFT to Cross-Chain-NFT (CCN) 
                    contract to Lock your NFT.
                    </Tooltip>
                    }
                >
                <img className='mx-2 m-1' src="/info.svg" alt="" />
                </OverlayTrigger>
                </div>
                :
                <div className='text-center py-4' style={{borderBottom:"1px solid white",fontSize:"22px"}}>
                    Select your Cross-Chain-NFT
                </div>
                }
                <div className='px-4'>
                    <div className='py-4 px-4 text-center'>select NFT you want to {isSafeTransfer? "transfer" :"bridge"} to other {isSafeTransfer? "address" : "network"}</div> 
                    <div className='text-center' style={{overflow:"auto",maxHeight:"16rem"}}>
                        <table className="w-100">
                            <thead>
                              <tr className={`${styles.tr} ${styles.head}`}>
                                <th>chainId</th>
                                <th>tokenId</th>
                                <th>contract Address</th>
                                <th>description</th>
                              </tr>
                            </thead>
                            <tbody>
                                {
                                tokens.map((token,index)=>(
                                    <tr onClick={()=>{onChangeToken(token,index)}} 
                                    key={index} className={`${styles.tr} ${selectedIndex===index ? styles.selected : ""}`}>
                                        <td>{token.chainId}</td>
                                        <td>{token.tokenID}</td>
                                        <td>{token.contractAddress&&(token.contractAddress.slice(0,4)+"..."+token.contractAddress.slice(-4))}</td>
                                        <td>{token.description && token.description.length > 7 ? token.description.slice(0,7)+"..." : token.description }</td>
                                    </tr>        
                                ))
                                }
                                {loadingTable ? <tr className={`${styles.tr}`} ><td  colSpan={4}>table is loading...</td></tr> :
                                (tokens.length === 0 && <tr className={`${styles.tr}`} ><td  colSpan={4}>you don't have any {selectedWay? "NFT":"Cross Chain NFT"}</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                    <div className='text-center py-2' style={{color:"#FF00FF"}}>
                    for brigifing your NFT you must set approve to the contract, that contract change
                    </div>
                    {showBtns && (    
                        selectedWay ? 
                        (approveCheck ?  (conditionLoding? <div className='text-center'>loading...</div> :<div className='d-flex justify-content-center'><Button primary className="w-50" onClick={next}>next</Button></div>)  :
                        (conditionLoding ? <div className='text-center'>loading...</div> :<div className="text-center d-flex">
                            <Button onClick={firstApprove} disabled={approveBtn.disabled}
                            className="w-50" secondary>APPROVE</Button>
                            <Button onClick={setApproveForAll}  disabled={approveBtn.disabled}
                            className="w-50" secondary>Approve For All</Button>
                        </div>) )
                        :
                        <div className='d-flex justify-content-center'><Button primary className="w-50" onClick={next}>next</Button></div>
                        )
                    } 
                    {
                        isSafeTransfer && selectedToken && 
                        <div className='d-flex justify-content-center'><Button primary className="w-50" onClick={next}>next</Button></div>
                    }
                </div>
            </div>
            {approveBtn.loading && <ProgressBar estimatedTime={10}/>}
            {approveBtn.approving && 
            <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center" 
            style={{position:'absolute',top:'0',left:'0',zIndex:"20",backgroundColor:"rgba(2,117,216,0.5)"}}>
                 <h4 className='bg-white text-dark larger p-2'>wating for metamask comfirm...</h4>
            </div>
            }
        </div>
    )
}
export default SelectNFT;