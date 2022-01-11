import React, { useState , useEffect , useContext , useRef } from 'react'
import styles from './NFTCrossChain.module.css'
import Button from '../Components/styled/Button'
import Input from '../Components/styled/input'
import { context } from '../App'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import { OverlayTrigger, Tooltip} from 'react-bootstrap'
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"privateFileHash","outputs":[{"internalType":"string","name":"_privateFileHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"privateInfo","outputs":[{"internalType":"string","name":"_privateInfo","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"publicFileHash","outputs":[{"internalType":"string","name":"_publicFileHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"publicInfo","outputs":[{"internalType":"string","name":"_publicInfo","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"},{"internalType":"string","name":"publicInfo","type":"string"},{"internalType":"string","name":"privateInfo","type":"string"},{"internalType":"string","name":"publicFileHash","type":"string"},{"internalType":"string","name":"privateFileHash","type":"string"}],"name":"safeMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const NFTCrossChain = () => {
    const { active, account, library, chainId } = useWeb3React()
    const data = useContext(context)
    const [tokens,setTokens] = useState([])
    const [selectedToken,setSelectedToken] = useState("")
    const [selectedIndex,setSelectedIndex] = useState("")
    const [targetChain,setTargetChain] = useState("")
    const [value,setValue] = useState("")
    const [address,setAddress] = useState("")
    const [now,setNow] = useState(0)
    const estimatedTime = 10;
    const [approveBtn,setApproveBtn] = useState({
        disabled:false,loading:false,approving:false,msg:""
    })
    const [transferBtn,setTransferBtn] = useState({
        disabled:false,loading:false,approving:false,msg:""
    })
    const [approves,setApproves] = useState({first:false,second:true})
    const [availableChains,setAvailableChains] = useState([])
    const [allChains,setAllChains] = useState([])
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
    const getERC721 = async ()=>{
        if(!active) return;
        setTokens([])
        if(!data.addresses[data.network]["erc721API"]) return
        const array = await axios.get(`${data.addresses[data.network]["erc721API"]}${account}`).then(res=>res.data.result)
        console.log("array",array)
        let ids = array.map(token=>token.tokenID+token.contractAddress)
        ids = Array.from(new Set(ids))
        const counts = new Array(ids.length).fill(0)
        for(let i = 0; i < array.length; i++){
          for(let j = 0; j < ids.length; j++){
            if(array[i].tokenID + array[i].contractAddress === ids[j])
              counts[j]++
          }
        }
        const idsToShow = [] 
        counts.forEach((id,index)=> {if(id%2!==0) idsToShow.push(ids[index])})
        idsToShow.forEach(async id=>{
          const token = await getToken(id.split('0x')[0],"0x"+id.split('0x')[1])
          setTokens(prev=>[...prev,token])
        })
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
        setApproves({...approves,first:true})
        setApproveBtn({...approveBtn,disabled:true,approving:true})
        const tokenContract = new library.eth.Contract(contractABI,selectedToken.contractAddress)
        const isApprovedBefore = await tokenContract.methods.getApproved(selectedToken.tokenID).call()
        // const isApproveForAllBefore = await tokenContract.methods.isApprovedForAll(account,data.addresses[data.network]["crossChain"]).call()
        console.log("isApprovedBefore",isApprovedBefore)
        // console.log("isApproveForAllBefore",isApproveForAllBefore)
        // if(isApprovedBefore===data.addresses[data.network]["crossChain"] || isApproveForAllBefore){
        if(isApprovedBefore===data.addresses[data.network]["crossChain"]){
            setApproveBtn({disabled:false,approving:false,loading:false,msg:""})
            setApproves({first:true,second:false})
            return; 
        }
        tokenContract.methods.approve(data.addresses[data.network]["crossChain"],selectedToken.tokenID).send({from:account})
        .on("transactionHash",transactionHash=>{
            setApproveBtn({...approveBtn,loading:true,approving:false})
            progress()
        })
        .on("receipt",receipt=>{
            setApproveBtn({disabled:false,approving:false,loading:false,msg:""})
            setApproves({first:true,second:false})
            setNow(0)
        })
        .on("error",error=>{
            setApproveBtn({disabled:false,approving:false,loading:false,msg:error.msg})
            console.log("error in sending info",error)
            setApproves({first:false,second:true})
            setNow(0)
        })
    }
    const transfer = ()=>{
        setApproves({...approves,second:true})
        setTransferBtn({...transferBtn,disabled:true,approving:true})
        const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"chainId","type":"uint256"},{"indexed":false,"internalType":"address","name":"contAddr","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"to","type":"address"}],"name":"RelayerCallRedeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"targetChainId","type":"uint256"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"chainId","type":"uint256"},{"indexed":false,"internalType":"address","name":"contAddr","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"uri","type":"string"}],"name":"RelayerCallSafeMintWrappedToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"wTokenId","type":"uint256"}],"name":"TokenWrapped","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"wTokenId","type":"uint256"}],"name":"WTokenBurned","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wTokenId","type":"uint256"}],"name":"burnWrappedToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"targetChainId","type":"uint256"}],"name":"getFee","outputs":[{"internalType":"uint256","name":"fee","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contAddr","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"redeem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"relayer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"contAddr","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"string","name":"uri","type":"string"}],"name":"safeMintWrappedToken","outputs":[{"internalType":"uint256","name":"wTokenId","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"targetChainId","type":"uint256"},{"internalType":"uint256","name":"fee","type":"uint256"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"targetChainIds","type":"uint256[]"},{"internalType":"uint256[]","name":"fees","type":"uint256[]"}],"name":"setFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newRelayer","type":"address"}],"name":"setRelayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contAddr","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"targetChainId","type":"uint256"}],"name":"transferCrossChainRequest","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"wTokenId","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"wReturnCrossChainRequest","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address payable","name":"to","type":"address"}],"name":"withdrawCash","outputs":[],"stateMutability":"nonpayable","type":"function"}]
        const contract = new library.eth.Contract(abi,data.addresses[data.network]["crossChain"])
        console.log("params",selectedToken,account,data.addresses[data.network]["crossChain"],targetChain)
        contract.methods.transferCrossChainRequest(
        selectedToken.contractAddress,selectedToken.tokenID,
        account,data.addresses[data.network]["crossChain"],targetChain).send({from:account,value:parseInt(value)})
        .on("transactionHash",transactionHash=>{
            setTransferBtn({...approveBtn,loading:true,approving:false})
            progress()
        })
        .on("receipt",receipt=>{
            setTransferBtn({disabled:false,approving:false,loading:false,msg:""})
            setApproveBtn({disabled:false,approving:false,loading:false,msg:""})
            setApproves({first:false,second:true})
            setNow(0)
        })
        .on("error",error=>{
            setTransferBtn({disabled:false,approving:false,loading:false,msg:error.msg})
            console.log("error in sending info",error)
            setApproves({first:true,second:false})
            setNow(0)
        })
    }
    const handleTarget = (e)=>{
        setTargetChain(
            data.chains[e.target.value]["chainIdDecimal"]
        )
    }
    const setApproveForAll = async ()=>{
        setApproves({...approves,first:true})
        setApproveBtn({...approveBtn,disabled:true,approving:true})
        const tokenContract = new library.eth.Contract(contractABI,selectedToken.contractAddress)
        const isApproveForAllBefore = await tokenContract.methods.isApprovedForAll(account,data.addresses[data.network]["crossChain"]).call()
        console.log(isApproveForAllBefore)
        if(isApproveForAllBefore){
            setApproveBtn({disabled:false,approving:false,loading:false,msg:""})
            setApproves({first:true,second:false})
            return; 
        }
        tokenContract.methods.setApprovalForAll(selectedToken.contractAddress,1).send({from:account})
        .on("transactionHash",transactionHash=>{
            setApproveBtn({...approveBtn,loading:true,approving:false})
        })
        .on("receipt",receipt=>{
            setApproveBtn({disabled:false,approving:false,loading:false,msg:""})
            setApproves({first:true,second:false})
        })
        .on("error",error=>{
            setApproveBtn({disabled:false,approving:false,loading:false,msg:error.msg})
            console.log("error in sending info",error)
            setApproves({first:false,second:true})
        })
    }
    const ref = useRef(null)
    const ref2 = useRef(null)
    useEffect(()=>{
        ref.current.value = data.network;
        ref2.current.value = data.network;
        data.network &&
        setTargetChain(data.chains[data.network]["chainIdDecimal"])
    },[data.network])
    useEffect(()=>{ 
        if(active){
           getERC721()
           setAddress(account)
        }
      },[data.network])
    useEffect(()=>{
        const tempChains = []
        const tempAllChains = []
        for(let key in data.addresses){
            if(data.addresses[key].crossChain && data.addresses[key].crossChain.length!==0)
                tempChains.push(key)
            tempAllChains.push(key)
        }
        setAvailableChains(tempChains)
        setAllChains(tempAllChains)
    },[])
    const progress = ()=>{
        const interval = setInterval(()=>{
            let state;
            setNow(prev => state=prev)
            if(state+100/estimatedTime>=100){
                setNow(100)
                clearInterval(interval)
            }
            else
                setNow(prevState => Math.floor(prevState+100/estimatedTime))
        },1000)
    }
    return (
        <div className='w-100 h-100' style={{display:'flex',flexFlow:'column'}} >
            <div className='d-flex justify-content-between py-2' style={{borderBottom:"1px solid white"}}>
                <div className='mx-4 my-auto'>back</div>
                <div className='my-auto'>
                Cross Chain NFT
                <OverlayTrigger key={"bottom"} placement={"bottom"}
                overlay={
                <Tooltip >
                  In this contract you can mint a Wrap token from your NFT in any EVM network, 
                    your token will lock in CRN contract. 
                    any one that has the Wrapped token of your NFT can unlock the NFT from contract.
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
            {/* <div className='py-2 px-4' style={{borderBottom:"1px solid white"}}>
            In this contract you can mint a Wrap token from your NFT in any EVM network, 
            your token will lock in CRN contract. 
            any one that has the Wrapped token of your NFT can unlock the NFT from contract.
             you can read more about thin contract HERE.
            </div> */}
            <div className='d-flex' style={{flexGrow:"1"}}>
                <div className='w-50 h-100 p-2' style={{borderRight:"1px solid white",position:"relative"}}>
                    {approves.first && 
                    <div  className="d-flex justify-content-center align-items-center" 
                    style={{width:'100%',height:"100%",position:'absolute',top:"0",left:"0",zIndex:'10',backgroundColor:"rgba(0,0,255,0.5)"}}>
                        <h1 className='bg-white text-danger'>{approveBtn.approving?"wating to confirm...":approveBtn.loading?<ProgressBar now={now}/>:""}</h1>        
                    </div>} 
                    <div className='w-100 h-100' style={{border:"1px solid white"}}>
                        <div className='text-center py-4' style={{borderBottom:"1px solid white",fontSize:"22px"}}>
                            Select Your NFT
                        </div>
                        <div className='px-4'>
                            <div className='py-4 px-4 text-center'>select NFT you want to bridge to other network</div> 
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
                                            <tr onClick={()=>{setSelectedToken(token);setSelectedIndex(index)}} 
                                            key={index} className={`${styles.tr} ${selectedIndex===index ? styles.selected : ""}`}>
                                                <td>{token.chainId}</td>
                                                <td>{token.tokenID}</td>
                                                <td>{token.contractAddress.slice(0,4)+"..."+token.contractAddress.slice(-4)}</td>
                                                <td>{token.description && token.description.length > 7 ? token.description.slice(0,7)+"..." : token.description }</td>
                                            </tr>        
                                        ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='text-center py-2' style={{color:"#FF00FF"}}>
                            for brifging your NFT you must set approve to the contract, that contract change
                            </div>
                            <div className="text-center d-flex">
                                <Button onClick={firstApprove} disabled={approveBtn.disabled}
                                className="w-50" secondary>APPROVE</Button>
                                <Button onClick={setApproveForAll}  disabled={approveBtn.disabled}
                                className="w-50" secondary>Approve For All</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-50 h-100 p-2' style={{position:'relative'}}>
                    {approves.second && 
                    <div  className="d-flex justify-content-center align-items-center" 
                    style={{width:'100%',height:"100%",position:'absolute',top:"0",left:"0",zIndex:'10',backgroundColor:"rgba(0,0,255,0.5)"}}>
                        <h1 className='bg-white text-danger'>{transferBtn.approving?"wating to confirm...":transferBtn.loading?<ProgressBar now={now} />:""}</h1>        
                    </div>} 
                    <div className='w-100 h-100' style={{border:"1px solid white"}}>
                        <div className='text-center py-4' style={{borderBottom:"1px solid white",fontSize:"22px"}}>
                            Cross Chainin
                        </div>
                        <div className='py-3 px-4 text-center'>
                            write the destination Address and select the destination network,
                             your NFT will appear in your destination address in few minetrs.
                        </div> 
                        <div className='text-center py-2 px-4' style={{color:"#FF00FF"}}>
                        becurfull your destination address must be on your destination network
                        </div>
                        <div>
                            <Input style={{width:'24rem'}} value={address} onChange={e=>setAddress(e.target.value)} title="address" className="" name="address"  type="text" />
                            <Input style={{width:'24rem'}} value={value} onChange={e=>setValue(e.target.value)} title="getfee" className="" name="value"  type="text" />
                            <div className='text-center m-4' >
                                <select  name="" className={`${styles.select} p-1 text-center`} 
                                onChange={handleTarget} ref={ref2}
                                style={{width:'24rem'}}>
                                    {
                                    allChains.map(item=><option key={item} value={item}>{item}</option>)
                                    }
                                    {/* <option value="polygon">polygon</option>
                                    <option value="ethereum">ethereum</option>
                                    <option value="mumbai">mumbai</option> */}
                                </select>
                            </div>
                        </div>
                        <div className="text-center">
                            <Button onClick={transfer}
                            className="w-75" primary>APPROVE</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NFTCrossChain

const ProgressBar = ({now})=>{
    return (
        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center" style={{position:'absolute',top:'0',left:'0',zIndex:"20"}}>
             <div className="w-25 my-2" style={{background:'white'}}>
                <div style={{width:now+"%",color:"white",backgroundColor:'red',transition:'0.2s',fontSize:'smaller' }}>
                    <span className="d-flex ejustify-content-center">{`${now}%`}</span>
                </div>
            </div>
        </div>
    )
}