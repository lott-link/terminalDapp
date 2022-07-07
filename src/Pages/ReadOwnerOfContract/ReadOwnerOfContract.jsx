import React, { useState, useContext } from "react";
import axios from 'axios'
import { useWeb3React } from "@web3-react/core";

import Input from "../../Components/styled/input";
import Button from "../../Components/styled/Button";
import useWidth from "../../Hooks/useWidth";
import { context } from "../../App";

const ReadOwnerOfContract = () => {
	const data = useContext(context);
	const width = useWidth();
	const [address, setAddress] = useState("");
	const {account,chainId,active,library:web3} = useWeb3React()
    const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

    const handleClick = async () => {
        const logs = (await axios.get(data.addresses[data.network]["logAPI"]+address+"&topic0="+transferTopic)).data.result
        console.log(logs)
		
    };


	return (
		<div className="w-100 h-100">
			<div className="w-50 mx-auto mt-4 d-flex justify-content-center align-items-center">
				<Input
					style={{ width: width > 600 ? "16.5rem" : "12.5rem" }}
					title={"Contract Address"}
					className=""
					onChange={(e) => setAddress(e.target.value)}
					name="value"
					value={address}
					type="text"
				/>
				<Button onClick={handleClick}>get data</Button>
			</div>
		</div>
	);
};

export default ReadOwnerOfContract;
