import styled from "styled-components";
import { useState } from "react";
const TextInput = styled.input`
    width:272px;
    height: 40px;
    margin: 1em;
    margin-bottom:${props=> props.small ? '0' : "1em"};
    padding: 0.25em 1em;
    text-align: center;
    /* padding: 12px 0 12px 8px; */
    border:7px white double;
    color:white;
    outline: none;
    background-color: #020227;
    font-size: 16px;
    border-color:${props => props.success ? (props.success==="success" ? "#00AAAC" : "#FF00FF") : 'white'};
    &:focus {
        border:4px solid;
        border-color:${props => props.success ? props.success==="success" ? "#00AAAC" : "#FF00FF" : 'white'};
    }
    &:hover {
        border:2px solid;
        border-color:${props => props.success ? props.success==="success" ? "#00AAAC" : "#FF00FF" : 'white'};
    }
    &::placeholder{
        color:white;
        opacity: 70%;
    }
    &:disabled {
        background-color: #C0C0C0;
        /* border:none; */
    }
`
const Small = styled.small`
    width:368px;
    color:${props => props.success ? props.success==="success" ? "#00AAAC" : "#FF00FF" : 'white'};
`
const Input = (props)=>{
    const [focus,setFocus] = useState(false)
    return (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',position:'relative'}}>
            <TextInput {...props} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} />
            <label style={{position:'absolute',left:`${props.title && (props.title.length > 10 ? "33%":"40%")}`,backgroundColor:props.disabled?"#C0C0C0":'#020227',top:`${(focus || (props.value && props.value.length!==0)) ?"3px":"24px"}`,paddingLeft:"4px",paddingRight:"4px",transition:'0.2s',pointerEvents:'none'}}>{props.title}</label>
            {props.small && <Small style={{textAlign:'start',paddingLeft:"20px"}}>{props.small}</Small>}
        </div> 
    )
}
export default Input;