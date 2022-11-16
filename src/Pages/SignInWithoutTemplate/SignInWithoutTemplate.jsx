import React, { useState, useEffect, useContext } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { create } from "ipfs-http-client";

import { context } from "../../App";
import useWidth from "../../Hooks/useWidth";
import Input from "../../Components/styled/input";
import Button from "../../Components/styled/Button";
import { registerContractABI } from "../Register/RegisterABI";
import { checkLink } from "../../addresses";

const client = create("https://ipfs.infura.io:5001/api/v0");
const dappId =
	"79235601003081460397231834677255739410696715732490899525095189002564176447706";

const SignInWithoutTemplate = () => {
	const [availableChains, setAvailableChains] = useState([]);
	const [userValid, setUserValid] = useState({ valid: false, msg: "" });
	const [payableAmount, setPayableAmount] = useState(0);
	const [referral, setReferral] = useState("");
	const [infoFields, setInfoFields] = useState([]);
	const [sendInfoDisabled, setSendInfoDisabled] = useState(false);

	const { account, library } = useWeb3React();
	const [input, setInput] = useState("");
	const data = useContext(context);
	const width = useWidth();

	const handleUserName = async (e) => {
		setInput(e.target.value);
		const contract = new library.eth.Contract(
			registerContractABI,
			data.addresses[data.network]["register"]
		);

		contract.methods
			.charNamePrice(e.target.value)
			.call()
			.then((res) => {
				setPayableAmount(res);
				setUserValid({ valid: true, msg: "Enter Username" });
			})
			.catch((err) => {
				console.log(err);
				setUserValid({ valid: false, msg: "Username has been registered" });
			});
	};

	const [infoOptions, setInfoOptions] = useState([
		"Telegram",
		"Phone number",
		"Email",
		"Website",
		"Facebook",
		"Instagram",
		"Linkedin",
		"Discord",
	]);
	const addOptionInput = (option) => {
		const values = [...infoFields];
		const keys = values.map((item) => item.key);
		if (!keys.includes(option)) {
			values.push({ key: option, value: "" });
			setInfoFields(values);
			setInfoOptions((prev) => prev.filter((item) => item !== option));
		}
	};
	const handleInputChange = (index, event) => {
		const values = [...infoFields];
		if (event.target.name === "key") values[index].key = event.target.value;
		else values[index].value = event.target.value;
		setInfoFields(values);
	};
	const handleRemoveField = (index, item) => {
		console.log(item);
		const values = [...infoFields];
		values.splice(index, 1);
		setInfoFields(values);
		setInfoOptions((prev) => [...prev, item.key]);
	};
	const getInfoFieldsData = () => {
		const data = {};
		infoFields.forEach((item) => (data[item.key] = item.value));
		return data;
	};
	const setInfo = async () => {
		setSendInfoDisabled(true);

		// const baseUrl = "ipfs://";

		const base64Pre = "data:application/json;base64,";
		let obj = getInfoFieldsData(infoFields);
		obj = { ...obj, defaultTemplate: true };

		//encoding
		const base64Obj = Buffer.from(JSON.stringify(obj)).toString("base64");
		//decoding
		// const decoded = Buffer.from(base64Obj, "base64").toString();

		const referralId = library.utils
			.toBN(library.utils.soliditySha3(referral.toLowerCase()))
			.toString();

		const registerContract = new library.eth.Contract(
			registerContractABI,
			data.addresses[data.network]["register"]
		);

		registerContract.methods
			.register(account, input, base64Pre + base64Obj, referralId, dappId)
			.send({ from: account, value: payableAmount })
			.on("receipt", (receipt) => {
				console.log("%cRecirpt", "color:yellow", receipt);
				setSendInfoDisabled(false);
			});
	};

	useEffect(() => {
		const tempChains = [];
		for (let key in data.addresses) {
			if (
				data.addresses[key].register &&
				data.addresses[key].register.length !== 0
			)
				tempChains.push(key);
		}
		setAvailableChains(tempChains);
	}, []);
	return (
		<div className="w-100 h-100" style={{ position: "relative" }}>
			<div
				className={`px-4 d-flex align-items-center justify-content-between`}
				style={{ height: "5%", borderBottom: "2px solid white" }}
			>
				<div></div>
				<div>Sign In</div>
				<div className="d-flex">
					{availableChains.map((chain, index) => (
						<OverlayTrigger
							key={index}
							placement={"bottom"}
							overlay={<Tooltip>{chain}</Tooltip>}
						>
							<div className="mx-1">
								<a
									href={
										data.chains[chain].params[0].blockExplorerUrls[0] +
										"/" +
										"address" +
										"/" +
										data.addresses[chain].register
									}
									target="_blank"
									rel="noreferrer"
								>
									<img
										style={{ width: "20px", height: "20px" }}
										src={data.chains[chain].icon}
										alt={chain + "icon"}
									/>
								</a>
							</div>
						</OverlayTrigger>
					))}
				</div>
			</div>
			<div
				style={{ height: "70vh", overflowY: "auto" }}
				className={`${width > 600 && "px-4"} text-center`}
			>
				<div className="my-2">
					<div className="d-flex flex-column align-items-center position-relative w-100">
						<Input
							style={{
								width: width > 600 ? "24rem" : "20rem",
								paddingRight: "7rem",
							}}
							small={userValid.msg}
							smallProps={{ style: { textAlign: "start" } }}
							success={userValid.valid ? "success" : "failure"}
							value={input}
							title="Enter username"
							type="text"
							onChange={handleUserName}
						/>
						<Input
							style={{ width: width > 600 ? "24rem" : "20rem" }}
							small="enter username of your referral, as default Lott.Link"
							smallProps={{ style: { textAlign: "start" } }}
							value={referral}
							title="referral"
							type="text"
							onChange={(e) => setReferral(e.target.value)}
						/>
						<div
							className="my-2 mx-auto"
							style={{ width: width > 600 ? "24rem" : "20rem" }}
						>
							{infoOptions.map((option, index) => (
								<Button
									primary
									className="mx-1"
									// disabled={buttonDisabled}
									onClick={() => addOptionInput(option)}
									key={index}
								>
									{option}
								</Button>
							))}
						</div>
					</div>
				</div>
				{infoFields.map((item, index) => {
					return (
						<div
							key={index}
							className="d-flex justify-content-center align-items-center"
						>
							<div>
								<Input
									style={{ width: width > 600 ? "16.5rem" : "12.5rem" }}
									title={
										item.key.slice(0, 1).toUpperCase() +
										item.key.slice(1, item.key.length)
									}
									className=""
									onChange={(event) => handleInputChange(index, event)}
									name="value"
									value={item.value}
									type="text"
								/>
							</div>
							<div onClick={() => handleRemoveField(index, item)}>
								<Button>Remove</Button>
							</div>
						</div>
					);
				})}
				<div className="d-flex flex-column align-items-center">
					<div
						className="d-flex flex-column align-items-center mx-auto"
						style={{ width: width > 600 ? "26rem" : "20rem" }}
					>
						<div
							className="bg-white text-dark d-flex justify-content-around align-items-center w-100"
							style={{ margin: "0 40px" }}
						>
							<div className="d-flex ">
								<OverlayTrigger
									placement={"bottom"}
									overlay={<Tooltip>{payableAmount} wei</Tooltip>}
								>
									<div className="mx-4">
										{(payableAmount / 1e18).toFixed(4)}
									</div>
								</OverlayTrigger>
								<div>
									<img
										style={{ width: "25px", weight: "25px" }}
										src={data.network && data.chains[data.network].icon}
										alt=""
									/>
								</div>
							</div>
							<div>
								<Button
									secondary
									style={{ width: width > 600 ? "16rem" : "12rem" }}
									className=""
									onClick={setInfo}
									disabled={sendInfoDisabled}
								>
									Set Info
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				className="p-3"
				style={{
					borderTop: "2px solid white",
					overflow: "auto",
					position: "relative",
					bottom: "0",
				}}
			>
				this contract mint a unique username on your wallet address to easily
				named you on other contract. you can set your contact info optionaly.
				other people can see your info. _reqular user name are free and pure
				user name are payble.
			</div>
		</div>
	);
};

export default SignInWithoutTemplate;
