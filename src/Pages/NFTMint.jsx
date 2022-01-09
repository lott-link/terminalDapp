import { useState, useContext } from "react";
import Input from "../Components/styled/input";
import Button from '../Components/styled/Button'
import { create } from 'ipfs-http-client'
import { useWeb3React } from "@web3-react/core";
import { factoryContractAddress } from '../Contracts/ContractAddress'
import { factoryContractABI,registerContractABI} from '../Contracts/ContractsABI'
import { Spinner } from 'react-bootstrap'
import { context } from '../App'
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"privateFileHash","outputs":[{"internalType":"string","name":"_privateFileHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"privateInfo","outputs":[{"internalType":"string","name":"_privateInfo","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"publicFileHash","outputs":[{"internalType":"string","name":"_publicFileHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"publicInfo","outputs":[{"internalType":"string","name":"_publicInfo","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"},{"internalType":"string","name":"publicInfo","type":"string"},{"internalType":"string","name":"privateInfo","type":"string"},{"internalType":"string","name":"publicFileHash","type":"string"},{"internalType":"string","name":"privateFileHash","type":"string"}],"name":"safeMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const mumbaiAddress = "0xd2Ad56D684A211b5Ee5a2aFb6e8E7a6e6F642d67"
const polygonAddress = "0x6517077303340e0E826d6DaCD64813cb6A9E3195"
const client = create('https://ipfs.infura.io:5001/api/v0')
const NFTMint = () => {
    const { active, account, library } = useWeb3React();
    const [uriDisabled,setUriDisabled] = useState(false);
    const [contractAddress,setContractAddress] = useState(mumbaiAddress)
    const data = useContext(context) 
    const [uploadStatus,setUploadStatus] = useState({
      publicFileHash:false,
      privateFileHash:false
    })
    const [input,setInput] = useState({
        to:"",
        uri:"",
        publicInfo:"",
        privateInfo:"",
        publicFileHash:"",
        privateFileHash:""
    })
    const handleFileChange = async e =>{
      setUploadStatus({...uploadStatus,[e.target.name]:true})
      const added = await client.add(e.target.files[0])
      setUploadStatus({...uploadStatus,[e.target.name]:false})
      console.log("uploaded",added)
      setInput({...input,[e.target.name]:added.path})
      const fileUrl = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(fileUrl)
    }
    const safeMint = async ()=>{
      console.log(data)
      if(!active) return;
      let uri = input.uri;
      if(uriDisabled){
        const json = await client.add(JSON.stringify({
          description:input.publicInfo,
          image:"https://ipfs.infura.io/ipfs/"+input.publicFileHash
        }))
        uri = `https://ipfs.infura.io/ipfs/${json.path}`
        console.log(uri)
      }
      const contract = new library.eth.Contract(contractABI,data.addresses[data.network]["NFT"])
      contract.methods["safeMint"](input.to,uri,input.publicInfo,
      input.privateInfo,input.publicFileHash,input.privateFileHash).send({from:account})
    }
  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
      <div className="d-flex flex-column">
          <div className="w-50">
            <Input
              type="text"
              name="to"
              onChange={(e)=>setInput({...input,[e.target.name]:e.target.value})}
              title={"to"}
              style={{ width: "21rem" }}
              value={input.to}
          />
          </div>
          <div className="d-flex">
          <Input
            className=""
            type="text"
            name="uri"
            onChange={(e)=>setInput({...input,[e.target.name]:e.target.value})}
            title={"uri"}
            style={{ width: "21rem" }}
            value={input.uri}
            disabled={uriDisabled}
            small="when disabled we use our defaults"
          />
          <Button secondary onClick={()=>setUriDisabled(!uriDisabled)}>
            {uriDisabled ? "enable" : "disable"}
          </Button>
        </div>
        <div className="d-flex justify-content-center">
          {
            ['publicInfo','privateInfo'].map((item,index)=>(
              <Input
                key={index}
                type="text"
                name={item}
                onChange={(e)=>setInput({...input,[e.target.name]:e.target.value})}
                title={item}
                style={{ width: "21rem" }}
                value={input[item]}
              />
            ))
          }
        </div>
        <div className="d-flex justify-content-center">
            <div className="d-flex align-items-center"> 
              <input type="file" 
              name="publicFileHash"
              style={{width:'21rem',margin:'1rem',border:'7px double white'}} 
              onChange={handleFileChange}
              />
              {uploadStatus.publicFileHash &&<Spinner animation="border" variant="light" />}
            </div>
            <div className="d-flex align-items-center">
              <input type="file" 
              name="privateFileHash"
              style={{width:'21rem',margin:'1rem',border:'7px double white'}}
              onChange={handleFileChange}
              />
              {uploadStatus.privateFileHash && <Spinner animation="border" variant="light" />}
            </div>
        </div>
        <Button
          className="contract-button mx-auto"
          onClick={safeMint}
          style={{ width: "24rem" }}
        >
          Safe Mint
        </Button>
      </div>
    </div>
  );
};

export default NFTMint;