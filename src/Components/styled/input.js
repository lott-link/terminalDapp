import styled from "styled-components";
const TextInput = styled.input`
    width:272px;
    height: 40px;
    margin: 1em;
    margin-bottom:${props=> props.small ? '0' : "1em"};
    padding: 0.25em 1em;
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
        border:none;
    }
`
const Small = styled.small`
    width:272px;
    height: 21px;
    color:${props => props.success ? props.success==="success" ? "#00AAAC" : "#FF00FF" : 'white'};
`
const Input = (props)=>{
    return (
        <div style={{display:'flex',flexDirection:'column'}}>
            <TextInput {...props} />
            {props.small && <Small style={{textAlign:'start',marginLeft:"1em"}}>{props.small}</Small>}
        </div>
    )
}
export default Input;