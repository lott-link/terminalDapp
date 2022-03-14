import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import axios from "axios";

import { context } from "../App";
import { checkLink } from "../addresses";
import Button from "../Components/styled/Button";

const User = () => {
    const [profile,setProfile] = useState([])
	const { user } = useParams();
    const data = useContext(context)

    const editLinks = (link)=>{
        //facebook
        //instagram
        //telegram
        //phone number
        //website
        //email

    }

	useEffect(() => {
        (async()=>{
            if(!data.network) return;
            const web3 = new Web3(
                new Web3.providers.HttpProvider(
                    "https://rinkeby.infura.io/v3/f0362c1f5aea42abb1d875f7a0f8692d"
                )
            );
            try{
                const contract = new web3.eth.Contract(abi,data.addresses[data.network]["register"]);
                const userId = web3.utils.toBN(web3.utils.soliditySha3(user.split("@")[0])).toString()  
                const tokenURI = await contract.methods.tokenURI(userId).call()
                const metadata = await axios.get(checkLink(tokenURI)).then(res=>res.data)
                console.log(metadata)
                if(metadata.profile)
                    setProfile(Object.entries(metadata.profile))
            }catch(err){
                console.log(err)
            }
        })()
	}, [data.network]);

	return (
    <div className='w-100 h-100 d-flex justify-content-center align-items-center'>{console.log(profile)}
        <div className="d-flex flex-column align-items-center w-100">
        {
            profile.map((item,index)=>{
                if(item[0] === 'Telegram')
                    return (
                        <a href={`https://t.me/${item[1]}`} target="_blank" rel="noreferrer" key={index} className="w-25">
                            <Button secondary className="w-100">{item[0]}</Button>
                        </a>
                    )
                else if(item[0] === 'Email')
                    return (
                        <a href={`mailto: ${item[1]}`} target="_blank" rel="noreferrer" key={index} className="w-25">
                            <Button secondary className="w-100">{item[0]}</Button>
                        </a>
                    )
                else if(item[0] === 'Phone number')
                return (
                    <a href={`tel: ${item[1]}`} target="_blank" rel="noreferrer" key={index} className="w-25">
                        <Button secondary className="w-100">{item[0]}</Button>
                    </a>
                )
                else if(item[0] === 'Website')
                return (
                    <a href={"https://"+item[1]} target="_blank" rel="noreferrer" key={index} className="w-25">
                        <Button secondary className="w-100">{item[0]}</Button>
                    </a>
                )
                else if(item[0] === 'Facebook')
                return (
                    <a href={"https://facebook.com/"+item[1]} target="_blank" rel="noreferrer" key={index} className="w-25">
                        <Button secondary className="w-100">{item[0]}</Button>
                    </a>
                )
                else if(item[0] === 'Instagram')
                return (
                    <a href={"https://instagram.com/"+item[1]} target="_blank" rel="noreferrer" key={index} className="w-25">
                        <Button secondary className="w-100">{item[0]}</Button>
                    </a>
                )
                else if(item[0] === 'Linkedin')
                return (
                    <a href={"https://www.linkedin.com/in/"+item[1]} target="_blank" rel="noreferrer" key={index} className="w-25">
                        <Button secondary className="w-100">{item[0]}</Button>
                    </a>
                )
            })
        }
        </div>
    </div>
    );
};

export default User;

const abi = [
    {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
]