import React , { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useWeb3React } from "@web3-react/core";
import { context } from '../App'
import Button from '../Components/styled/Button';
import Spinner from 'react-bootstrap/Spinner'
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionButton } from 'react-bootstrap';
import {Dropdown} from 'react-bootstrap'
import '../../node_modules/react-loading-skeleton/dist/skeleton.css'
import ContentLoader from '../../node_modules/react-loading-skeleton'
import { useHistory } from 'react-router-dom';
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
        idsToShow.forEach(async (id,index)=>{
          const token = await getToken(id.split('0x')[0],"0x"+id.split('0x')[1])
          tempTokens.push(token)
          setTokens(prev=>[...prev,token])
          if(index===idsToShow.length-1)  setLoading(false)
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
          console.log(tokenURI)
          const tokenJson = await axios.get(tokenURI).then(res=>res.data)
          const data = {
            name:tokenJson.name,
            description:tokenJson.description,
            image:tokenJson.image,
            tokenID,
            contractAddress,
            chainId,
            attributes:tokenJson.attributes
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
    if(tokens.length===0 && !loading) return (
      <div className='w-100 h-100 d-flex justify-content-center align-items-center' > 
        <h1>you don't have any tooken</h1>
      </div>
    )
    return (
        <div className='w-100 h-100' style={{overflowY:"auto"}}>{console.log(tokens)}
            {/* <div className='d-flex flex-wrap gap-3 justify-content-start p-2'> */}
            <div className='grid p-4'>
            {
            tokens.map((token,index)=><NFTCard key={index} token={token}
            />)
            }
            {loading && <div style={{position:'absolute',top:'45%',left:'55%'}}>
                <Spinner style={{width:"3rem",height:"3rem"}} animation="grow" variant="light" />
                <Spinner className='mx-2' style={{width:"3rem",height:"3rem"}} animation="grow" variant="light" />
                <Spinner style={{width:"3rem",height:"3rem"}} animation="grow" variant="light" />
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


const NFTCard = ({token})=>{
    const [loading,setLoading] = useState(true)
    const handleLoad = ()=> setLoading(false)
    const [info,setInfo] = useState([])
    useEffect(()=>{
      for(let key in token){
        if(key!=="chainId" && key!== "tokenID" && key!== "contractAddress" && key!=='image')
          setInfo(prev=>[...prev,[key,token[key]]])
      }
    },[])
    return (
        <div style={{width:'275px'}}>{console.log("info",info)}
            <div style={{backgroundColor:"#C4C4C4"}}><h4 className='m-0'>
              <DropDownComponent token={token} />
            </h4></div>
            <div style={{width:'275px',height:'225px',backgroundColor:"#C4C4C4"}}>
                 <img className='w-100 h-100' onLoad={handleLoad} style={{objectFit:"contain",display:loading?"none":"initial"}} src={token.image} alt="" />
                {loading && <LazyImage className='w-100 h-100' />}
            </div>
            <div className='bg-white text-dark p-4' style={{width:"275px",minHeight:'143px'}}>
            {
              info.map((property,index)=> <AccordionComponent key={index} property={property} />)
            }              
            </div>
        </div>
    )
}

const LazyImage = props => {
    return (
      <ContentLoader 
        speed={5}
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
  
const AccordionComponent = ({property})=>{
  const [info,setInfo] = useState([])
  useEffect(()=>{
    if(typeof property[1] !== "object") return
    for(let key in property[1]){
      if(key!=="chainId" && key!== "tokenID" && key!== "contractAddress" && key!=='image')
        setInfo(prev=>[...prev,[property[1][key].trait_type,property[1][key].value]])
    }
  },[])
  if(typeof property[1] !== "object")
  return (
    <Accordion defaultActiveKey="1">
      <Accordion.Item eventKey="0">
        <Accordion.Header>{property[0]}</Accordion.Header>
        <Accordion.Body>
          {property[1]}
      </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
  else
    return(
      <Accordion defaultActiveKey="1">
      <Accordion.Item eventKey="0">
        <Accordion.Header>{property[0]}</Accordion.Header>
        <Accordion.Body>
        {
              info.map((property,index)=> <AccordionComponent key={index} property={property} />)
        }  
      </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    )
}
const DropDownComponent = ({token})=>{
  const history = useHistory()
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a href="" ref={ref} onClick={(e) => {e.preventDefault();onClick(e);}}
    style={{textDecoration:'none',color:'gray'}}
    >
      {children}
    </a>
  ));
  return (
    <Dropdown className="d-inline mx-2">
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        ...
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={()=>history.push({pathname:"/crosschain",state:{token,type:"transfer"}})}>transfer</Dropdown.Item>
        <Dropdown.Item onClick={()=>history.push({pathname:"/crosschain",state:{token,tyep:"crossChain"}})}>cross chain</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
// {"image":"https://ipfs.infura.io/ipfs/QmZd1dPLWNofQ2DGE2sak4wkPAnavbyMKeANiMcgT6r8Eh","name":"Assembly","description":"an assembly program","attributes":[{"trait_type":"type","value":"8086"},{"trait_type":"model ","value":"com"}]}