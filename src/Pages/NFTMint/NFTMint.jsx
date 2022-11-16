import { useState, useContext } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { create } from 'ipfs-http-client'
import { useWeb3React } from "@web3-react/core";
import { Spinner } from 'react-bootstrap'

import Input from "../../Components/styled/input";
import Button from '../../Components/styled/Button'
import { context } from '../../App'
import ProgressBar from "../../Components/ProgressBar";
import useWidth from "../../Hooks/useWidth";
import { safeMintABI } from "./NFTMintABI";

import 'react-toastify/dist/ReactToastify.css';

const client = create('https://ipfs.infura.io:5001/api/v0')

const NFTMint = () => {
    const { active, account, library } = useWeb3React();
    const [uriDisabled,setUriDisabled] = useState(true);
    const [inputFields,setInputFields] = useState([{property:'',value:''}])
    const [mintBtn,setMintBtn] = useState({disabled:false,approved:false,loading:false})
    const data = useContext(context) 
    const [toSmall,setToSmall] = useState("")
    const width = useWidth()
    const [uploadStatus,setUploadStatus] = useState({
      publicFileHash:false,
    })
    const [input,setInput] = useState({
        to:account,
        uri:"",
        description:"",
        publicFileHash:"",
        name:""
    })
    const handleFileChange = async e =>{
      setUploadStatus({...uploadStatus,[e.target.name]:true})
      const added = await client.add(e.target.files[0])
      setUploadStatus({...uploadStatus,[e.target.name]:false})
      setInput({...input,[e.target.name]:added.path})
      const fileUrl = `https://ipfs.infura.io/ipfs/${added.path}`
    }
    const handleInputChange = (index, event) => {
      const values = [...inputFields];
      if (event.target.name === "property") {
        values[index].property = event.target.value;
      } else {
        values[index].value = event.target.value;
      }
      if(values[index].property && values[index].value ){
          if(!values[index+1])
              values.push({property:'',value:''})
      }
      if(values[index].property=== "" || values[index].value=== "" )
          if(values[index+1])
              values.pop()   
      setInputFields(values);
  };
    const safeMint = async ()=>{
      if(!active) return;
      if(input.to.length===0){
        setToSmall("to address can't be empty")
        return
      }
      setMintBtn({loading:false,disabled:true,approving:true})
      let uri = input.uri;
      if(uriDisabled){
        const tempFields = inputFields.slice(0,-1)
        const attributes = tempFields.map(field=>{return {trait_type:field.property,value:field.value} })
        const json = await client.add(JSON.stringify({
          description:input.description,
          image:"ipfs://"+input.publicFileHash,
          name:input.name,
          attributes
        }))
        uri = `ipfs://${json.path}`
      }
      const contract = new library.eth.Contract(safeMintABI,data.addresses[data.network]["NFT"])
      contract.methods["safeMint"](input.to,uri).send({from:account})
      .on("transactionHash",transactionHash=>{
        setMintBtn({loading:true,disabled:true,approving:false})
      })
      .on("receipt",receipt=>{
          setMintBtn({loading:false,disabled:false,approving:false})
          notify()
      })
      .on("error",error=>{
          setMintBtn({loading:false,disabled:false,approving:false})
          console.log("error in sending info",error)
      })
    }
    const notify = ()=>{
      toast.success('NFT Minted Successfully!', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
  if(!active)
      return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">please connect your wallet</h2>)
  else if(!data.pageSupported) 
      return (<h2 className="w-100 h-100 d-flex justify-content-center align-items-center">Chain not supported</h2>)
  else
  return (
    <div className=" h-100 w-100 d-flex flex-column align-items-center" style={{position:'relative',left:0}}>
      <div className="my-2 w-100 d-flex justify-content-center" style={{borderBottom:"1px solid white"}}>
        <h1>Mint</h1>
      </div>
      <div className="d-flex flex-column align-items-center">
          <div className={`d-flex justify-content-center flex-wrap ${width > 992 ? "w-100" : "w-50"}`}>
            <Input
                type="text"
                name="name"
                onChange={(e)=>setInput({...input,[e.target.name]:e.target.value})}
                title={"name"}
                style={{ width: "21rem" }}
                value={input.name}
            />
            <Input
              type="text"
              name="to"
              onChange={(e)=>setInput({...input,[e.target.name]:e.target.value},setToSmall(""))}
              title={"to"}
              style={{ width: "21rem" }}
              value={input.to}
              small={toSmall}
              success={toSmall.length !==0 ? true : false}
          />
          </div>
          <div className={`d-flex justify-content-start ${width > 992 ? "w-100" : "w-100"} flex-wrap`}>
          <Input
            className=""
            type="text"
            name="uri"
            onChange={(e)=>setInput({...input,[e.target.name]:e.target.value})}
            title={"uri"}
            style={{ width: "21rem" }}
            value={input.uri}
            disabled={uriDisabled}
            small="if you want to use your own uri enable this"
          />
          <Button secondary onClick={()=>setUriDisabled(!uriDisabled)}>
            {uriDisabled ? "enable" : "disable"}
          </Button>
        </div>
        <div className={`d-flex  justify-content-center flex-wrap ${width > 992 ? "w-100" : "w-50"}`}>
          <Input
            type="text" name="description"
            onChange={(e)=>setInput({...input,[e.target.name]:e.target.value})}
            title="description"
            style={{ width: "21rem" }}
            value={input.description}
          />
          <div className="d-flex align-items-center"> 
              <input type="file" 
              name="publicFileHash"
              style={{width:'21rem',margin:'1rem',border:'7px double white'}} 
              onChange={handleFileChange}
              />
              {uploadStatus.publicFileHash &&<Spinner animation="border" variant="light" />}
            </div>  
        </div>
        <div className="align-self-start mx-3 mt-2"><h4>attributes(optional)</h4></div>
        <div className={`d-flex flex-column justify-content-center `} style={{maxHeight:"300px",overflowY:'auto'}}>
        {
        inputFields.map((inputField, index)=>{
            return(
            <div key={index} className="d-flex justify-content-center flex-wrap">
            <Input 
                type="text"  style={{width:"21rem"}}
                onChange={event => handleInputChange(index, event)}
                value={inputField.property}
                name="property"
                placeholder="Property"
            />
            <Input 
                type="text"  style={{width:"21rem"}}
                onChange={event => handleInputChange(index, event)}
                value={inputField.value}
                name="value"
                placeholder="Value"
            />
            </div>)
        })
        }
        </div>
        <Button
          className="contract-button mx-auto"
          onClick={safeMint}
          style={{ width:width>992 ? "24rem" : "21rem" }}
          disabled={mintBtn.disabled}
        >
          Safe Mint
        </Button>
      </div>
      {mintBtn.loading && <ProgressBar estimatedTime={10}/>}
      {mintBtn.approving && 
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center" 
      style={{position:'absolute',top:'0',left:'0',zIndex:"20",backgroundColor:"rgba(2,117,216,0.5)"}}>
           <h4 className='bg-white text-dark larger p-2'>wating for metamask comfirm...</h4>
      </div>
      }
      <ToastContainer style={{position:'absolute', left:'50%',bottom:'3%'}}
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default NFTMint;