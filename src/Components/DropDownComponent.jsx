import React from 'react';
import { useHistory } from 'react-router-dom';
import {Dropdown} from 'react-bootstrap'
import { OverlayTrigger, Tooltip} from 'react-bootstrap'

const DropDownComponent = ({token,setShow,setModalToken,getToken,setSpamToken,setUnspamToken})=>{
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
        <OverlayTrigger key={"index"} placement={"bottom"}  overlay={<Tooltip >copy</Tooltip>}>
          <span style={{cursor:'pointer'}} 
          onClick={(e)=>{e.stopPropagation();navigator.clipboard.writeText(token.tokenID)}}>
              #{
              token.tokenID.length > 5 ?
              token.tokenID.slice(0,3) + ".."
              :
              token.tokenID
              }
          </span> 
        </OverlayTrigger>
          <span style={{position:'relative',left:token.tokenID.length > 5 ?'180px' : '200px',cursor:'pointer'}}>...</span>
          <Dropdown.Menu align="end">
            <Dropdown.Item onClick={()=>history.push({pathname:"/tools/crosschain",state:{token,type:"transfer"}})}>transfer</Dropdown.Item>
            <Dropdown.Item onClick={()=>history.push({pathname:"/tools/crosschain",state:{token,type:"crossChain"}})}>cross chain</Dropdown.Item>
            <Dropdown.Item onClick={()=>{setModalToken(token);setShow(true)}}>more info</Dropdown.Item>
            <Dropdown.Item onClick={()=>getToken(token.tokenID,token.contractAddress,true)}>refresh token</Dropdown.Item>
            <Dropdown.Item onClick={()=>token.isSpam ? setUnspamToken(token) : setSpamToken(token)}>{token.isSpam ? "show" : "hide"}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Toggle>
      </Dropdown>
    )
  }
export default DropDownComponent;