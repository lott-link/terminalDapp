import styled from "styled-components";
const Button = styled.button`
    margin: 1em;
    padding: 0.25em 1em;
    box-shadow: 4px 4px 0px #565656;
    border:none;
    &:hover {
        color:#0000AC;
    }
    &:disabled {
        background-color: #C0C0C0;
        border:none;
        color: white;
        &:hover {
            color:white;
        }
    }
    &:active {
        transform: translate(2px,2px);
    }
    ${(props)=> props.primary &&
        `background-color: #C0C0C0;
        `
    }
    ${(props)=> props.secondary &&
        `background-color: #FFFF00;`
    }
`
export default Button;