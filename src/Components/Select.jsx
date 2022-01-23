import React, { useRef, useEffect, useContext } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { context } from "../App";
import styles from './select.module.css'
const Select = () => {
  const [show, setShow] = useState(false);
  const [selectFocus,setSelectFocus] = useState(false)
  const [value,setValue] = useState()
  const [availableChains,setAvailableChains] = useState([])
  const data = useContext(context)
  const history = useHistory()
  const ref = useRef(null);
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShow(false);
      setSelectFocus(false)
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
        style={{width: "100%",height: "40px",padding: "0.25rem 1rem",
        border:selectFocus ? "7px white solid" : "7px white double",
          color: "white",outline: "none",backgroundColor: "#020227",
          fontSize: "16px",
        }}
        className="d-flex justify-content-center align-items-center"
        onClick={() => {setShow(true);setSelectFocus(true)}}
      >
        {
          !value &&
          <>
          {data.network ? data.network : "not connected"} 
          <span style={{transform:"translateY(2px)",marginLeft:'4px'}}>&#x25BC;</span>
          </>
        }
        {value && <>
        {value}
        <span style={{transform:"translateY(2px)",marginLeft:'4px'}}>&#x25BC;</span>
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
                setSelectFocus(false)
              }}
            >
              <div className="d-flex justify-content-between">
                <div>{item.chain}</div>
              {item.supported ? 
              <div style={{backgroundColor:'green',width:'20px',height:'20px',borderRadius:'50%'}}></div>
               :
               <div style={{backgroundColor:'red',width:'20px',height:'20px',borderRadius:'50%'}}></div>
              }
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Select;
