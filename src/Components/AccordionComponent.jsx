import React , { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'

const AccordionComponent = ({property})=>{
    const [info,setInfo] = useState([])
    useEffect(()=>{
      if(typeof property[1] !== "object") return
      for(let key in property[1]){
        // if(key!=="chainId" && key!== "tokenID" && key!== "contractAddress" && key!=='image')
        if(!["chainId","tokenID","contractAddress","image","interaction",'tokenURI','isSpam'].includes(key))
          setInfo(prev=>[...prev,[property[1][key].trait_type,property[1][key].value]])
      }
    },[])
    if(typeof property[1] !== "object")
    return (
      <Accordion defaultActiveKey="1">
        <Accordion.Item eventKey="0">
          <Accordion.Header as="h6">{property[0]}</Accordion.Header>
          <Accordion.Body style={{wordBreak:"break-word"}}>
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
export default AccordionComponent;