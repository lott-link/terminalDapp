import React , { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useWeb3React } from "@web3-react/core";
import { context } from '../App'
import Spinner from 'react-bootstrap/Spinner'
import Accordion from 'react-bootstrap/Accordion'
import {Dropdown} from 'react-bootstrap'
import '../../node_modules/react-loading-skeleton/dist/skeleton.css'
import ContentLoader from '../../node_modules/react-loading-skeleton'
import { useHistory } from 'react-router-dom';
import { OverlayTrigger, Tooltip} from 'react-bootstrap'
import { Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom' 
import { useParams } from 'react-router-dom'
import useWidth from '../Hooks/useWidth';

const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"privateFileHash","outputs":[{"internalType":"string","name":"_privateFileHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"privateInfo","outputs":[{"internalType":"string","name":"_privateInfo","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"publicFileHash","outputs":[{"internalType":"string","name":"_publicFileHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"publicInfo","outputs":[{"internalType":"string","name":"_publicInfo","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"},{"internalType":"string","name":"publicInfo","type":"string"},{"internalType":"string","name":"privateInfo","type":"string"},{"internalType":"string","name":"publicFileHash","type":"string"},{"internalType":"string","name":"privateFileHash","type":"string"}],"name":"safeMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]


const Assets = () => {
    const data = useContext(context);
    const { active, account, library, chainId } = useWeb3React()
    const [tokens,setTokens] = useState([])
    const [loading,setLoading] = useState(false)
    const [show,setShow] = useState(false)
    const [modalToken,setModalToken] = useState(null)
    
    const checkLink = (link)=>{
      const protocol = link.split(':')[0]
      console.log(protocol)
      if(protocol.toLowerCase().includes(['http','https']))
        return link
      else if(protocol.toLowerCase().includes(['ipfs']))
        return "https://ipfs.infura.io/" + link.split(':')[1].slice(0,link.length-1)
      else return link
    }
    
    const getERC721 = async ()=>{
        if(!active) return;
        setLoading(true)
        setTokens([])
        if(!data.network) return
        const array = await axios.get(`${data.addresses[data.network]["erc721API"]}${account}`).then(res=>res.data.result)
        console.log(array)
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
          if(token){
            tempTokens.push(token)
            setTokens(prev=>[...prev,token])
          } 
          if(index===idsToShow.length-1)  {
            setLoading(false)
            group(tempTokens)
          }
        })
        if(idsToShow.length === 0) setLoading(false)
    }
    const getToken = async (tokenID,contractAddress) => {
      if(!active) return;
      const token = localStorage.getItem(contractAddress+tokenID)
      if(token){
        return JSON.parse(token)
      }
      else{
        const contract = new library.eth.Contract(contractABI,contractAddress)
        let tokenURI = await contract.methods.tokenURI(tokenID).call(res=>res)
        tokenURI = checkLink(tokenURI)
        try {
          const tokenJson = await axios.get(tokenURI).then(res=>res.data)
          const image = checkLink(tokenJson.image)
          const data = {
            name:tokenJson.name,
            description:tokenJson.description,
            image,
            tokenID,
            contractAddress,
            chainId,
            attributes:tokenJson.attributes,
            interaction:tokenJson.interaction ? tokenJson.interaction : "noInteraction",
            tokenURI:tokenURI
          }
          localStorage.setItem(contractAddress+tokenID,JSON.stringify(data))
          return data
        } 
        catch(err){
          return false
        }
        
      } 
    }
    const group = async (tempTokens)=>{
      let result = {}
      tempTokens.forEach(token=>{
        if(result[token.contractAddress])
          result[token.contractAddress].push(token)
        else 
          result[token.contractAddress] = [token]
      })
      const finalObj = {}
      for(let key in result){
        const contract = new library.eth.Contract(contractABI,key)
        const contractName = await contract.methods.name().call()
        finalObj[contractName + " " + key ] = result[key] 
      }
      setTokens(Object.entries(finalObj))
    }
    useEffect(()=>{
        data.network && getERC721()
    },[data.network,chainId])
    if(tokens.length===0 && !loading) return (
      <div className='w-100 h-100 d-flex justify-content-center align-items-center' > 
        <h1>you don't have any token</h1>
      </div>
    )
    return (
        <div className='w-100 h-100' style={{overflowY:"auto",position:'relative'}}>
            <div className='d-flex flex-column flex-wrap px-3 py-4'>
            {
            tokens.map((group,index)=>{
              return (
                <div key={index} className='px-4 pb-4 my-2'
                 style={{border:'5px double white',overFlow:'auto',position:'relative'}}>
                  <div className='px-2'
                  style={{position:'absolute',top:"-1rem",zIndex:'20',backgroundColor:'black'}}>
                    {group[0] && group[0].split(" ")[0]}
                    <OverlayTrigger key={"index"} placement={"bottom"}  overlay={<Tooltip >explore block</Tooltip>}>
                      <a href={data.chains[data.network].params[0].blockExplorerUrls[0]+"/"+"address"+"/"+ (group[0] && group[0].split(" ")[1])}
                       target="_blank" rel="noreferrer">
                        <img className='mx-2 mb-1' src="/info2.svg" alt="tooltip-info" />
                      </a>
                    </OverlayTrigger>
                  </div> 
                  <div className='d-flex flex-wrap gap-4' style={{marginTop:'2rem'}}>
                    {group[1] && group[1].map((token,indx)=><NFTCard key={indx} token={token} setShow={setShow} setModalToken={setModalToken}/>)}
                  </div>
                </div>
              )
            })
            }
            {loading && <div style={{position:'absolute',top:'45%',left:'55%'}}>
                <Spinner style={{width:"3rem",height:"3rem"}} animation="grow" variant="light" />
                <Spinner className='mx-2' style={{width:"3rem",height:"3rem"}} animation="grow" variant="light" />
                <Spinner style={{width:"3rem",height:"3rem"}} animation="grow" variant="light" />
            </div>
            }
            </div>
            {show &&
              <div className='w-50 p-3'
               style={{height:'50vh',position:'fixed',backgroundColor:"rgba(0,0,0,0.8)"
               ,zIndex:"20",top:'27%',left:'33%',border:"5px double white"}}>
                <div>
                  <div className='d-flex flex-row-reverse' style={{cursor:'pointer'}} onClick={()=>setShow(false)}>close</div>
                  <div className='d-flex'>
                    <div>contract address:</div>
                    <div style={{wordBreak:'break-word'}}>{modalToken.contractAddress}</div>
                  </div>
                  <div className='d-flex'>
                    <div>asset link:</div>
                    <div style={{wordBreak:'break-word'}}><a target="_blank" rel="noreferrer" href={modalToken.image}>{modalToken.image}</a></div>
                  </div>
                  <div className='d-flex'>
                    <div>token uri:</div>
                    <div style={{wordBreak:'break-word'}}><a target="_blank" rel="noreferrer" href={modalToken.tokenURI}>{modalToken.tokenURI}</a></div>
                  </div>
                </div>
              </div>
            }
        </div>
    )
}

export default Assets;

const NFTCard = ({token,setShow,setModalToken})=>{
    const { library , account} = useWeb3React()
    const [loading,setLoading] = useState(true)
    const handleLoad = ()=> setLoading(false)
    const [info,setInfo] = useState([])
    const [val,setVal] = useState("")
    useEffect(()=>{
      for(let key in token){
        // if(key!=="chainId" && key!== "tokenID" && key!== "contractAddress" && key!=='image')
        if(!["chainId","tokenID","contractAddress","image","interaction"].includes(key))
        setInfo(prev=>[...prev,[key,token[key]]])
      }
    },[])
    const handleChange = (e, item) => {
      if (item.params) {
        item.params = { ...item.params, [e.target.name]: e.target.value };
      } else {
        item.params = { [e.target.name]: e.target.value };
      }
    };
    const call = (item) => {
      const args = paramOrder(item);
      const contract = new library.eth.Contract([item], token.contractAddress);
      contract.methods[item.name](...args)
        .call()
        .then((res) => setVal({res,sig:item.signature}));
    };
    const write = (item) => {
      const contract = new library.eth.Contract([item], token.contractAddress);
      contract.methods[item.name]()
        .send({ from: account })
        .then((res) => console.log(res));
    };
    const paramOrder = (item) => {
      const arr = [];
      for (let i = 0; i < item.inputs.length; i++)
        arr.push(item.params[item.inputs[i].name]);
      return arr;
    };
    return (
        <div style={{width:'275px'}}>
            <div style={{backgroundColor:"#C4C4C4"}}>
              <DropDownComponent token={token} setShow={setShow} setModalToken={setModalToken} />
            </div>
            <div style={{width:'275px',height:'225px',backgroundColor:"#C4C4C4"}}>
                 <img className='w-100 h-100' onLoad={handleLoad} style={{objectFit:"contain",display:loading?"none":"initial"}} src={token.image} alt="" />
                {loading && <LazyImage className='w-100 h-100' />}
            </div>
            <div className='bg-white text-dark px-2 py-3' style={{width:"275px",minHeight:'130px'}}>
            {
              info.map((property,index)=> <AccordionComponent key={index} property={property} />)
            }     
            {token.interaction !=="noInteraction" &&
            <>
              <div>
                {token.interaction.read.map((item, index) => {
                return (
                  <div key={index}>
                    <div>
                      <label htmlFor="">{item.name}</label>
                    </div>
                    {item.inputs.map((element, index2) => {
                      return (
                        <input
                          key={index2 * 1000}
                          type="text"
                          placeholder={element.name}
                          name={element.name}
                          onChange={(e) => handleChange(e, item)} />);
                            })}
                        <button className='rounded' onClick={() => call(item)}>call</button>
                        {val && val.sig === item.signature && <div>{val.res}</div>}
                  </div>
                  );
                  })}
              </div>
              <div>
              {token.interaction.write.map((item, index) => {
                return (
                  <div key={index * -1}>
                    <label htmlFor="">{item.name}</label>
                    {item.inputs.map((element, index2) => {
                      return (
                        <input
                          key={index2 * 1000}
                          type="text"
                          placeholder={element.name}
                          name={element.name}
                          onChange={(e) => handleChange(e, item)}
                        />
                      );
                    })}
                    <button onClick={() => write(item)}>write</button>
                  </div>
                );
              })}
            </div>
              </>
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
      // if(key!=="chainId" && key!== "tokenID" && key!== "contractAddress" && key!=='image')
      if(!["chainId","tokenID","contractAddress","image","interaction"].includes(key))
        setInfo(prev=>[...prev,[property[1][key].trait_type,property[1][key].value]])
    }
  },[])
  if(typeof property[1] !== "object")
  return (
    <Accordion defaultActiveKey="1">
      <Accordion.Item eventKey="0">
        <Accordion.Header as="h6">{property[0]}</Accordion.Header>
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
        <Accordion.Header as="h6">{property[0]}</Accordion.Header>
        <Accordion.Body>
        {
              info.map((property,index)=> <AccordionComponent key={index} property={property} />)
        }  
      </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    )
}
const DropDownComponent = ({token,setShow,setModalToken})=>{
  const history = useHistory()
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span href="" ref={ref} onClick={(e) => {e.preventDefault();onClick(e);}}
    style={{textDecoration:'none',color:'gray'}}
    >
      {children}
    </span>
  ));
  return (
    <Dropdown className="d-inline mx-2">
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        <span style={{position:'relative',left:'20px',cursor:'default'}}>#{token.tokenID}</span> 
        <span style={{position:'relative',left:'180px'}}>...</span>
        <Dropdown.Menu align="end">
          <Dropdown.Item onClick={()=>history.push({pathname:"/tools/crosschain",state:{token,type:"transfer"}})}>transfer</Dropdown.Item>
          <Dropdown.Item onClick={()=>history.push({pathname:"/tools/crosschain",state:{token,type:"crossChain"}})}>cross chain</Dropdown.Item>
          {/* <Dropdown.Item onClick={()=>history.push({pathname:`/assets/${token.contractAddress}/${token.tokenID}`,state:token})}>more info</Dropdown.Item> */}
          <Dropdown.Item onClick={()=>{setModalToken(token);setShow(true)}}>more info</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Toggle>
    </Dropdown>
  )
}



// const Assets = ()=>{
//   return (
//     <>
//       <Route path="/assets" exact component={AssetsPage} />
//       <Route path="/assets/:contractAddress/:tokenId"  component={AssetsSingle} />
//     </>
//   )
// }
// export default Assets;

// const AssetsSingle = ()=>{
//   const location = useLocation()
//   const [token,setToken] = useState(location.state || null)
//   const { contractAddress, tokenId } = useParams()
//   console.log(contractAddress, tokenId,token)
//   const width = useWidth()
//   useEffect(()=>{
//     if(!location.state){
//       setToken({"name":"no token"})
    
//     }
//   })
//   return (
//     <div className="h-100 w-100 p-3">
//       <div className={`d-flex ${width < 992 && "flex-wrap"} gap-3`}>
//         <div className={`${width > 992 ? "w-50" : "w-100"}`}>
//           <img className='w-100' src={token.image} alt="" />
//         </div>
//         <div className={`${width > 992 ? "w-50" : "w-100"} d-flex flex-column gap-2`}>
//           <div className='d-flex gap-1'>
//             <div>name:</div>
//             <div>{token.name}</div>
//           </div>
//           <div className='d-flex gap-1'>
//             <div>description:</div>
//             <div>{token.description}</div>
//           </div>
//           <div className='d-flex gap-1'>
//             <div>contract address:</div>
//             <div>{token.contractAddress.slice(0,8)+"..."+token.contractAddress.slice(-8)}</div>
//           </div>
//           <div className='d-flex gap-1'>
//             <div>token id:</div>
//             <div>{token.tokenID}</div>
//           </div>
//           <div></div>
//         </div>
//       </div>
//       <div className='d-flex flex-wrap gap-2 px-4 p-3 my-2'
//           style={{border:'5px double white',overFlow:'auto',position:'relative'}}>
//            <div className='px-2'
//            style={{position:'absolute',top:"-1rem",zIndex:'20',backgroundColor:'black'}}>
//              Properties
//            </div>
//            {token.attributes.map((attr,index)=>(
//             <div key={index} className="d-flex flex-column p-2"
//              style={{width:'fit-content',border:'1px solid white'}}>
//               <div>{attr.trait_type}</div>
//               <div>{attr.value}</div>
//             </div>
//           ))}
//          </div>
//       <div>
//       </div>
//     </div>
//   )
// }

// ipfs:/