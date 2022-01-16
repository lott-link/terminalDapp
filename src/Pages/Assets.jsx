import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useWeb3React } from "@web3-react/core";
import { context } from '../App'
import Button from '../Components/styled/Button';
import Spinner from 'react-bootstrap/Spinner'

import '../../node_modules/react-loading-skeleton/dist/skeleton.css'
import ContentLoader from '../../node_modules/react-loading-skeleton'

const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"privateFileHash","outputs":[{"internalType":"string","name":"_privateFileHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"privateInfo","outputs":[{"internalType":"string","name":"_privateInfo","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"publicFileHash","outputs":[{"internalType":"string","name":"_publicFileHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"publicInfo","outputs":[{"internalType":"string","name":"_publicInfo","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"},{"internalType":"string","name":"publicInfo","type":"string"},{"internalType":"string","name":"privateInfo","type":"string"},{"internalType":"string","name":"publicFileHash","type":"string"},{"internalType":"string","name":"privateFileHash","type":"string"}],"name":"safeMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const Assets = () => {
    const data = useContext(context);
    const { active, account, library, chainId } = useWeb3React()
    const [tokens,setTokens] = useState([])
    const [show,setShow] = useState(false)
    const [modal,setModal] = useState()
    const [loading,setLoading] = useState(false)
    // const getERC721 = async ()=>{
    //     if(!active) return;
    //     axios.get(`${data.addresses[data.network]["erc721API"]}${account}`)
    //     .then(res=>{setTokens(res.data.result);console.log(res.data.result)})
    // }
    const getERC721 = async ()=>{
        if(!active) return;
        setLoading(true)
        setTokens([])
        if(!data.network) return
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
        let idsToShow = [] 
        counts.forEach((id,index)=> {if(id%2!==0) idsToShow.push(ids[index])})
        const tempTokens = []
        idsToShow.forEach(async id=>{
          const token = await getToken(id.split('0x')[0],"0x"+id.split('0x')[1])
          tempTokens.push(token)
            setTokens(prev=>[...prev,token])
        })
        setLoading(false)
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
    // const showTokenData = async (tokenID,contractAddress) => {
    //     if(!active) return;
    //     const token = localStorage.getItem(contractAddress+tokenID)
    //     if(token){
    //         setModal(JSON.parse(token))
    //         setShow(true) 
    //     }
    //     else{
    //         const contract = new library.eth.Contract(contractABI,contractAddress)
    //         const tokenURI = await contract.methods.tokenURI(tokenID).call(res=>res)
    //         const tokenJson = await axios.get(tokenURI).then(res=>res.data)
    //         console.log("tokenURI",tokenURI)
    //         console.log("tokenJson",tokenJson)
    //         const data = {
    //             author:tokenJson.author,
    //             description:tokenJson.description,
    //             image:tokenJson.image,
    //             tokenID,
    //             contractAddress,
    //             chainId
    //         }
    //         setModal(data)
    //         localStorage.setItem(contractAddress+tokenID,JSON.stringify(data))
    //         setShow(true)
    //     } 
    // }
    // const showTokenData = ()=>{}
    useEffect(()=>{
        data.network && getERC721()
    },[data.network])
    return (
        <div className='w-100 h-100'>{console.log(tokens)}
            {/* <div className="h-100 d-flex flex-column align-items-center" style={{overflowY:"auto"}}>
                {
                tokens.map((token,index)=>(
                    <div key={index} className="m-2 p-2" 
                    style={{border:'1px solid white',cursor:"pointer"}}
                    // onClick={()=>showTokenData(token.tokenID,token.contractAddress)}
                    onClick={()=>{setModal(token);setShow(true)}}
                    >
                        <div>{token.tokenID}</div>
                        <div>{token.tokenName}</div>
                        <div>{token.contractAddress}</div>
                    </div>
                ))
                }
                
            </div> */}
            <div className='d-flex flex-wrap gap-2 justify-content-center p-1'>
            {
            tokens.map((token,index)=><NFTCard key={index} description={token.description}
                image={token.image}
            />)
            }
            {loading && <div style={{position:'absolute',top:'45%'}}>
                <Spinner style={{width:"5rem",height:"5rem"}} animation="grow" variant="light" />
                <Spinner className='mx-2' style={{width:"5rem",height:"5rem"}} animation="grow" variant="light" />
                <Spinner style={{width:"5rem",height:"5rem"}} animation="grow" variant="light" />
            </div>
            }
            </div>
            {show && 
                <div className="w-25 d-flex flex-column align-items-center"
                 style={{position:'absolute',top:'40%',right:'25%',border:'7px double white',background:"lightgray"}} >
                    {/* <div>author:{modal.author}</div> */}
                    <div>description:{modal.description}</div>
                    <div><img style={{width:"200px"}} 
                    src={modal.image} alt="" /></div>
                    <div style={{cursor:'pointer'}} onClick={()=>setShow(false)}>close</div>
                </div>
            }
        </div>
    )
}

export default Assets


const NFTCard = ({description="there is no description",image,NFTName="no nmae"})=>{
    const [loading,setLoading] = useState(true)
    const handleLoad = ()=> setLoading(false)
    return (
        <div className='w-25' style={{minHeight:"12rem"}}>
            <div className='w-100 h-50 bg-light'>
                 <img className='w-100 h-100' onLoad={handleLoad} style={{objectFit:"contain",display:loading?"none":"initial"}} src={image} alt="" />
                {loading && <LazyImage className='w-100 h-100' />}
            </div>
            <div className='w-100 bg-white text-dark p-4'>
                <div><strong>{NFTName}</strong></div>
                <div>{description}</div>
                <div className='d-flex justify-content-between my-3'>
                    <div>Balance</div>
                    <div className='d-flex align-items-center'>
                        <div className='mx-1'><img src="/eth/Preview.png" alt="" /></div>
                        <div>0.025</div>
                    </div>
                </div>
                <div className='w-100'>
                    <Button className='w-100 m-0' secondary>Withdraw</Button>
                </div>
            </div>
        </div>
    )
}

const LazyImage = props => {
    return (
      <ContentLoader 
        speed={2}
        viewBox="0 0 400 160"
        backgroundColor="#d9d9d9"
        foregroundColor="#ededed"
        {...props}
      >
        <rect x="50" y="6" rx="4" ry="4" width="343" height="38" />
        <rect x="8" y="6" rx="4" ry="4" width="35" height="38" />
        <rect x="50" y="55" rx="4" ry="4" width="343" height="38" />
        <rect x="8" y="55" rx="4" ry="4" width="35" height="38" />
        <rect x="50" y="104" rx="4" ry="4" width="343" height="38" />
        <rect x="8" y="104" rx="4" ry="4" width="35" height="38" />
      </ContentLoader>
    )
  }
  