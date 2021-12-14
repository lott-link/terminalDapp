import { useState, useEffect } from 'react'
import axios from 'axios'
import { useWeb3React } from "@web3-react/core";
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"privateFileHash","outputs":[{"internalType":"string","name":"_privateFileHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"privateInfo","outputs":[{"internalType":"string","name":"_privateInfo","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"publicFileHash","outputs":[{"internalType":"string","name":"_publicFileHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"publicInfo","outputs":[{"internalType":"string","name":"_publicInfo","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"},{"internalType":"string","name":"publicInfo","type":"string"},{"internalType":"string","name":"privateInfo","type":"string"},{"internalType":"string","name":"publicFileHash","type":"string"},{"internalType":"string","name":"privateFileHash","type":"string"}],"name":"safeMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const Assets = () => {
    const { active, account, library } = useWeb3React()
    const [tokens,setTokens] = useState([])
    const [show,setShow] = useState(false)
    const [modal,setModal] = useState()
    const getERC20 = async ()=>{
        if(!active) return;
        axios.get(`https://api-testnet.polygonscan.com/api?module=account&action=tokentx&address=${account}&startblock=0&endblock=19999999&sort=asc&apikey=YourApiKeyToken`)
        .then(res=>console.log(res.data.result))
    }
    const getERC721 = async ()=>{
        if(!active) return;
        axios.get(`https://api-testnet.polygonscan.com/api?module=account&action=tokennfttx&address=${account}&startblock=0&endblock=999999999&sort=asc`)
        .then(res=>{setTokens(res.data.result);console.log(res.data.result)})
    }
    const getToken = async (tokenID,contractAddress) => {
        if(!active) return;
        const token = localStorage.getItem(contractAddress+tokenID)
        if(token){
            setModal(JSON.parse(token))
            setShow(true) 
        }
        else{
            const contract = new library.eth.Contract(contractABI,contractAddress)
            const tokenURI = await contract.methods.tokenURI(tokenID).call(res=>res)
            const tokenJson = await axios.get(tokenURI).then(res=>res.data)
            const data = {
                author:tokenJson.author,
                description:tokenJson.description,
                publicFileHash:"https://ipfs.infura.io/ipfs/"+tokenJson.publicFileHash
            }
            setModal(data)
            localStorage.setItem(contractAddress+tokenID,JSON.stringify(data))
            setShow(true)
        } 
    }
    useEffect(()=>{
        getERC721()
    },[])
    return (
        <div>
            <button onClick={getERC20}>getERC20</button>
            <button onClick={getERC721}>getERC721</button>
            <div className="d-flex flex-column align-items-center">
                {
                    tokens.map((token,index)=>(
                        <div key={index} className="m-2 p-2" 
                        style={{border:'1px solid white'}}
                        onClick={()=>getToken(token.tokenID,token.contractAddress)}
                        >
                            <div>{token.tokenID}</div>
                            <div>{token.tokenName}</div>
                            <div>{token.contractAddress}</div>
                        </div>
                    ))
                }
            </div>
            {show && 
                <div className="w-25 d-flex flex-column align-items-center"
                 style={{position:'absolute',right:'30%',border:'7px double white'}} >
                    <div>author:{modal.author}</div>
                    <div>description:{modal.description}</div>
                    <div><img style={{width:"200px"}} 
                    src={modal.publicFileHash} alt="" /></div>
                    <div style={{cursor:'pointer'}} onClick={()=>setShow(false)}>close</div>
                </div>
            }
        </div>
    )
}

export default Assets
