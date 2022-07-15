import React, { useState, useEffect, useContext } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { create } from "ipfs-http-client";

import { context } from "../../App";
import useWidth from "../../Hooks/useWidth";
import Input from "../../Components/styled/input";
import Button from "../../Components/styled/Button";
import { registerContractABI } from "./RegisterABI";
import { checkLink } from "../../addresses";

const client = create("https://ipfs.infura.io:5001/api/v0");
const dappId =
	"79235601003081460397231834677255739410696715732490899525095189002564176447706";

const Register = () => {
	const [availableChains, setAvailableChains] = useState([]);
	const [userValid, setUserValid] = useState({ valid: false, msg: "" });
	const [payableAmount, setPayableAmount] = useState(0);
	const [referral, setReferral] = useState("");
	const [label, setLabel] = useState("");
	const [sendInfoDisabled, setSendInfoDisabled] = useState(false);
	const [ipfsTemplate, setIpfsTemplate] = useState("");
	const [inputs, setInputs] = useState({});
	const [inputJson, setInputJson] = useState();
	const [sendInfoLoading, setSendInfoLoading] = useState(false);
	const [loadingMsg, setLoadingMsg] = useState();

	const { account, chainId, active, library } = useWeb3React();
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

	const setInfo = async () => {
		const baseUrl = "ipfs://";

		const tempInputJson = inputJson;
		tempInputJson.inputs.forEach((item) => (item.value = inputs[item.name]));

		const inputObj = await client.add(JSON.stringify(tempInputJson));

		const infoObj = {
			template: {
				address: ipfsTemplate,
				info: baseUrl + inputObj.path,
			},
		};
		const infoURL = await client.add(JSON.stringify(infoObj));

		const referralId = library.utils
			.toBN(library.utils.soliditySha3(referral.toLowerCase()))
			.toString();

		const registerContract = new library.eth.Contract(
			registerContractABI,
			data.addresses[data.network]["register"]
		);

		registerContract.methods
			.register(account, input, baseUrl + infoURL.path, referralId, dappId)
			.send({ from: account, value: payableAmount })
			.on("receipt", (receipt) => {
				console.log("%cRecirpt", "color:yellow", receipt);
			});
	};

	const getInfo = async () => {
		const json = (await axios.get(checkLink(ipfsTemplate) + "/abi.json")).data;
		setInputJson(json);
		const inputObj = {};
		json.inputs.forEach((item) => {
			inputObj[item.name] = "";
		});
		setInputs(inputObj);

		console.log(inputObj);
		console.log(Object.keys(inputObj));
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
						{input.length !== 0 && (
							<div
								className="position-relative"
								style={{ top: "-3.2rem", left: "9rem" }}
							>
								<label htmlFor="">{label}</label>
							</div>
						)}
						<Input
							style={{ width: width > 600 ? "24rem" : "20rem" }}
							small="enter username of your referral, as default Lott.Link"
							smallProps={{ style: { textAlign: "start" } }}
							value={referral}
							title="referral"
							type="text"
							onChange={(e) => setReferral(e.target.value)}
						/>
						<div className="d-flex align-items-center">
							<Input
								style={{ width: width > 600 ? "24rem" : "20rem" }}
								small=""
								smallProps={{ style: { textAlign: "start" } }}
								value={ipfsTemplate}
								title="Template Link"
								type="text"
								onChange={(e) => setIpfsTemplate(e.target.value)}
							/>
							<button
								onClick={getInfo}
								style={{ width: "8rem", height: "2rem" }}
							>
								get info
							</button>
						</div>
					</div>
				</div>
				<div className="w-100 d-flex flex-column justify-content-center align-items-center">
					{console.log(inputs)}
					{Object.keys(inputs).map((item, key) => (
						<Input
							key={key}
							type="text"
							style={{ width: width > 600 ? "24rem" : "20rem" }}
							title={item}
							name={item}
							value={inputs[item]}
							onChange={(e) =>
								setInputs({ ...inputs, [e.target.name]: e.target.value })
							}
						/>
					))}
				</div>

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

export default Register;

// template link : ipfs://QmTca8BhwUquaw6RXwYQZRwYx6r72NShYEgWpssAnTWoh8
