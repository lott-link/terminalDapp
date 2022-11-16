import React, { useState, useContext } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";

import Input from "../../Components/styled/input";
import Button from "../../Components/styled/Button";
import useWidth from "../../Hooks/useWidth";
import { context } from "../../App";

const accounts = new Set();

const ReadOwnerOfContract = () => {
	const data = useContext(context);
	const width = useWidth();
	const [address, setAddress] = useState("");
	const [currentBlock, setCurrentBlock] = useState(0);
	const [lastBlockRead, setLastBlockRead] = useState(0);
	const [accountArray, setAccountArray] = useState([]);
	const [link, setLink] = useState();
	const { account, chainId, active, library: web3 } = useWeb3React();
	const transferTopic =
		"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

	const handleClick = async (getMore = false) => {
		let apiLink = data.addresses[data.network]["logAPI"];
		getMore &&
			(apiLink = apiLink.replace(
				/fromBlock=[0-9]+/,
				`fromBlock=${lastBlockRead + 1}`
			));
		console.log(apiLink);
		const logs = (
			await axios.get(apiLink + address + "&topic0=" + transferTopic)
		).data.result;
		logs.forEach((log) => {
			accounts.add("0x" + log.topics[1].slice(26, log.topics[1].length));
			accounts.add("0x" + log.topics[2].slice(26, log.topics[2].length));
		});
		accounts.delete("0x0000000000000000000000000000000000000000");

		const curBlock = await web3.eth.getBlockNumber();
		setCurrentBlock(curBlock);

		let lstBlockRead =
			logs.length > 0 ? logs[logs.length - 1].blockNumber : lastBlockRead;
		lstBlockRead = web3.utils.toNumber(lstBlockRead);
		setLastBlockRead(lstBlockRead);

		console.log(accounts);
		console.log(logs);
		setAccountArray(Array.from(accounts));
	};
	const exportCSV = () => {
		let str = "account,";
		console.log({ accountArray });
		accountArray.forEach((item) => (str += item + ",\n"));
		console.log({ str });

		const csvContent = "data:text/csv;charset=utf-8," + str;
		const encodedURI = encodeURI(csvContent);
		console.log(encodedURI);
		setLink(encodedURI);
	};

	return (
		<div className="w-100 h-100 d-flex flex-column  align-items-center">
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
			<div>current Block:{currentBlock}</div>
			<div>last Block which log have been read:{lastBlockRead}</div>
			<div>
				{accountArray.map((item, key) => (
					<div key={key}>{item}</div>
				))}
			</div>
			<div>
				<Button onClick={() => handleClick(true)}>Get More</Button>
				<Button onClick={exportCSV}>Get CSV</Button>
			</div>
			<div>
				{link && (
					<a href={link} download={"accounts.csv"}>
						Download
					</a>
				)}
			</div>
		</div>
	);
};

export default ReadOwnerOfContract;
