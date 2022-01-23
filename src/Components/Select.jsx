import React, { useRef, useEffect, useContext } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { context } from "../App";
import Badge from 'react-bootstrap/Badge'
import styles from './select.module.css'
const Select = () => {
  const [show, setShow] = useState(false);
  const [value,setValue] = useState()
  const [availableChains,setAvailableChains] = useState([])
  const data = useContext(context)
  const history = useHistory()
  const ref = useRef(null);
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShow(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });
  history.listen(location=>{
    handleAvailableChains(location.pathname)
  })
  const handleAvailableChains = (location)=>{
    
    switch(location){
      case '/':
        const tempChains = []
        for(let key in data.addresses){
        if(data.addresses[key].crossChain && data.addresses[key].crossChain.length!==0)
            tempChains.push({chain:key,supported:true})
        }
        setAvailableChains([...tempChains])
        break
      case '/contract/signin':
        setAvailableChains(checkNetworkSupport("register"))
        break;
      case '/contract/createchanceroom':
        setAvailableChains(checkNetworkSupport("factory"))
        break;
      case '/contract/chanceroomlist':
        break;
      case '/nft/mint':
        setAvailableChains(checkNetworkSupport("NFT"))
        break;
      case '/nft/asset':
        setAvailableChains(checkNetworkSupport("erc721API"))
        break;
      case '/tools/crosschain':
        setAvailableChains(checkNetworkSupport("crossChain"))
    }
  }
  const checkNetworkSupport = (contractName)=>{
    const tempChains = []
    for(let key in data.addresses){
        if(data.addresses[key][contractName] && data.addresses[key][contractName].length!==0)
          tempChains.push({chain:key,supported:true})
        else
          tempChains.push({chain:key,supported:false})
        }
        return tempChains;
    }
  useEffect(()=>{
    handleAvailableChains(history.location.pathname)
  },[])
  const handleNetworkChange = (chainName)=>{
    if(window.ethereum){
        window.ethereum
            .request({
              method: "wallet_addEthereumChain",
              params: data.chains[chainName]["params"]
        })

        let chainId = data.chains[chainName]["chainIdHex"]
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        }).then(()=>data.setNetwork(chainName))
    }
  }
  // useEffect(()=>{
    // const tempChains = []
    // for(let key in data.addresses){
    //     if(data.addresses[key].crossChain && data.addresses[key].crossChain.length!==0)
    //         tempChains.push({chain:key,supported:true})
    // }
    // setAvailableChains(tempChains)
  // },[])
  return (
    <div ref={ref} className="w-100" style={{position:'relative'}}>
      <div
        style={{width: "100%",height: "32px",padding: "0.25rem 1rem",
          outline: "none",backgroundColor: "#FFFF00",
          fontSize: "16px",color:'black'
        }}
        className="d-flex justify-content-center align-items-center"
        onClick={() => {setShow(!show)}}
      >
        {
          !value &&
          <>
          {data.network ? <span style={{textTransform:'capitalize'}}>{data.network}</span> : "not connected"} 
          <span style={{transform:"translateY(2px)",marginLeft:'4px',position:'absolute',right:"4px"}}>&#x25BC;</span>
          </>
        }
        {value && <>
        {<span style={{textTransform:'capitalize'}}>{value}</span> }
        <span style={{transform:"translateY(2px)",marginLeft:'4px',position:'absolute',right:"4px"}}>&#x25BC;</span>
        </>
        }
      </div>
      <div style={{ position: "absolute",zIndex:'10',width:'100%' }}>
        {show &&
          availableChains.map((item, index) => (
            <div
              key={index}
              className={styles.option}
              onClick={()=>{setValue(item.chain);
                setShow(false);
                handleNetworkChange(item.chain);
              }}
            >
              <div className="d-flex justify-content-center" >
                <div style={{textTransform:'capitalize'}}>{item.chain}</div>
              {!item.supported && 
              <div style={{position:'absolute',right:'4px'}}>
                <Badge bg="danger">Not supported</Badge>
              </div>
              }
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Select;
