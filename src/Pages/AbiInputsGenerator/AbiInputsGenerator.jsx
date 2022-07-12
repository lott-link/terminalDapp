import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import Accordion from "react-bootstrap/Accordion";

import Input from "../../Components/styled/input";
import Button from "../../Components/styled/Button";

const AbiInputsGenerator = () => {
	const [contract, setContract] = useState(null);
	const [account, setAccount] = useState(null);
	const [result, setResult] = useState({});
	const [loading, setLoading] = useState({});
	const [contractAddress, setContractAddress] = useState("");
	const [readFunctions, setReadFunctions] = useState([]);
	const [writeFunctions, setWriteFunctions] = useState([]);
	const [show, setShow] = useState(0);
	const [localABIs, setLocalABIs] = useState([]);
	const [err, setErr] = useState({ msg: "", error: false });
	const [contractName, setContractName] = useState("");
	const [showItems, setShowItems] = useState(false);
	const [value, setValue] = useState(0);

	const abiRef = useRef(null);

	const handleGenerate = async () => {
		if (window.ethereum) {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const chainId = await window.ethereum.request({ method: "eth_chainId" });
			console.log(chainId);
			accounts && setAccount(accounts[0]);
			window.ethereum.on("accountsChanged", function (accounts) {
				setAccount(accounts[0]);
			});
			const web3 = new Web3(window.web3.currentProvider);

			//checking address validation
			if (!web3.utils.isAddress(contractAddress.trim())) {
				setErr({ error: true, msg: "Address Isn't Valid!" });
				return;
			}
			//checking abi validation
			let abi;
			try {
				abi = JSON.parse(abiRef.current.value);
				console.log(abi);
				if (typeof abi !== "object") {
					setErr({ error: true, msg: "ABI is corupted" });
					return;
				}
			} catch (err) {
				console.log(err);
				setErr({ error: true, msg: "ABI is corupted" });
				if (typeof abi !== "object") {
					setErr({ error: true, msg: "ABI is corupted" });
					return;
				}
				return;
			}

			const contract = new web3.eth.Contract(abi, contractAddress.trim());
			setContract(contract);

			setReadFunctions(
				abi.filter(
					(item) => item.type === "function" && item.stateMutability === "view"
				)
			);
			setWriteFunctions(
				abi.filter(
					(item) =>
						item.type === "function" &&
						["nonpayable", "payable"].includes(item.stateMutability)
				)
			);

			//persisting contract ABIs
			let abis = localStorage.getItem("abis");
			if (abis) {
				abis = JSON.parse(abis);
				const found = abis.find(
					(item) => item.contractAddress === contractAddress
				);
				if (!found)
					localStorage.setItem(
						"abis",
						JSON.stringify([
							...abis,
							{ contractName, contractAddress, abi, chainId },
						])
					);
			} else {
				localStorage.setItem(
					"abis",
					JSON.stringify([{ contractName, contractAddress, abi, chainId }])
				);
			}
		}
	};

	const handleChange = (e, item) => {
		item.param = e.target.value;
	};

	const call = (item) => {
		const args = paramOrder(item);
		setLoading((prev) => {
			return { ...prev, [item.name]: true };
		});
		try {
			contract.methods[item.name](...args)
				.call()
				.then((res) => {
					setResult((prev) => {
						return { ...prev, [item.name]: res };
					});
					setLoading((prev) => {
						return { ...prev, [item.name]: false };
					});
				})
				.catch((err) => {
					setResult((prev) => {
						return { ...prev, [item.name]: err.message };
					});
					setLoading((prev) => {
						return { ...prev, [item.name]: false };
					});
				});
		} catch (err) {
			console.log(err);
			setLoading((prev) => {
				return { ...prev, [item.name]: false };
			});
			setErr({ error: true, msg: err.reason });
		}
	};

	const write = (item) => {
		console.log(item);
		const args = paramOrder(item);
		try {
			contract.methods[item.name](...args)
				.send({ from: account, value: item?.payable === true ? value : 0 })
				.then((res) => console.log(res));
		} catch (err) {
			console.log(err);
			setErr({ error: true, msg: err.reason });
		}
	};

	const paramOrder = (item) => {
		const arr = [];
		for (let i = 0; i < item.inputs.length; i++) {
			arr.push(item.inputs[i].param);
		}
		return arr;
	};

	const handleSelect = (item) => {
		setContractAddress(item.contractAddress);
		abiRef.current.value = JSON.stringify(item.abi);
		setContractName(item.contractName);
	};

	const handleRemoveABI = (itemToRemomve) => {
		const abis = localStorage.getItem("abis");
		const filteredABIs = JSON.parse(abis).filter(
			(item) => item.contractAddress !== itemToRemomve.contractAddress
		);
		localStorage.setItem("abis", JSON.stringify(filteredABIs));
		setLocalABIs(
			localABIs.filter(
				(item) => item.contractAddress !== itemToRemomve.contractAddress
			)
		);
	};

	useEffect(() => {
		(async () => {
			const chainId = await window.ethereum.request({ method: "eth_chainId" });
			const abis = localStorage.getItem("abis");
			if (abis) {
				setLocalABIs(
					JSON.parse(abis).filter((item) => item.chainId === chainId)
				);
			}
		})();
	}, []);

	return (
		<div className="h-100 w-100 d-flex flex-column align-items-center text-white wrapper mx-auto position-relative">
			<div
				className="d-flex justify-content-center py-2 w-100"
				style={{ borderBottom: "1px solid white" }}
			>
				<div>ABI Generator</div> {console.log(localABIs)}
			</div>
			{localABIs.length !== 0 && (
				<div className="w-100 d-flex flex-column align-items-center">
					{/* <select name="" id=""  className="text-center py-1 mt-4 position-relative w-50"
    			style={{background:"#020227",color:'white',border:'7px double white'}}
				onChange={handleSelect}
    			>
					<option value="">select</option>
					{
						localABIs.map((item,key)=>(
							<option key={"abi"+key} value={item.contractAddress}>
								{item.contractName}
							</option>
						))
					}
				</select> */}
					<div
						className="text-center py-1 mt-4 position-relative w-50 px-2"
						style={{
							background: "#020227",
							color: "white",
							border: "7px double white",
						}}
						onClick={() => setShowItems(!showItems)}
					>
						{" "}
						Select From Previuos ABIs
					</div>
					{showItems &&
						localABIs.map((item, key) => (
							<div
								key={"abi" + key}
								className="d-flex justify-content-around align-items-center p-2"
								style={{
									width: "50%",
									zIndex: "20",
									background: "#020227",
									border: "1px solid white",
								}}
								value={item.contractAddress}
								onClick={(e) => {
									e.stopPropagation();
									handleSelect(item);
								}}
							>
								<div>{item.contractName}</div>
								<div>
									<Button
										style={{ margin: "0" }}
										onClick={(e) => {
											e.stopPropagation();
											handleRemoveABI(item);
										}}
									>
										remove
									</Button>
								</div>
							</div>
						))}
				</div>
			)}
			<div className="w-50">
				<Input
					style={{ width: "100%" }}
					value={contractName}
					title="Contract Name"
					type="text"
					onChange={(e) => setContractName(e.target.value)}
					small="this is an optional value for saving your abi with name."
					smallProps={{ style: { width: "100%" } }}
				/>
			</div>
			<div className="w-50">
				<Input
					style={{ width: "100%" }}
					value={contractAddress}
					title="Contract Address"
					type="text"
					onChange={(e) => setContractAddress(e.target.value)}
				/>
			</div>
			<div className="w-50" style={{ position: "relative" }}>
				<label
					htmlFor=""
					className="px-3"
					style={{
						position: "absolute",
						background: "#020227",
						top: "-10px",
						left: "20px",
					}}
				>
					ABI
				</label>
				<textarea
					name=""
					id=""
					rows="10"
					className="w-100 p-2"
					ref={abiRef}
					style={{
						background: "#020227",
						border: "7px double white",
						color: "white",
						width: "20rem",
					}}
				></textarea>
			</div>
			<div>
				<Button secondary onClick={handleGenerate}>
					Generate
				</Button>
			</div>
			<div className="">
				<Button secondary onClick={() => setShow(0)}>
					Read
				</Button>
				<Button secondary onClick={() => setShow(1)}>
					Write
				</Button>
			</div>
			{readFunctions.length !== 0 && show === 0 && (
				<div className="w-75 mb-4">
					<div className="my-3 px-4" style={{ fontSize: "28px" }}>
						Read Contract
					</div>
					<Accordion defaultActiveKey="0">
						{readFunctions.map((item, key) => (
							<Accordion.Item
								eventKey={key}
								key={"key" + key}
								style={{ backgroundColor: "white" }}
							>
								<Accordion.Header
									className="py-2 acc-header"
									style={{ backgroundColor: "#020227" }}
								>
									{key + 1}. {item.name}
								</Accordion.Header>
								<Accordion.Body
									className="py-2"
									style={{ backgroundColor: "#020227" }}
								>
									{item.inputs.map((item, index) => (
										<Input
											className="w-100 my-1"
											key={index}
											placeholder={`${item.name} (${item.type})`}
											name={item.name}
											onChange={(e) => handleChange(e, item)}
										/>
									))}
									{/* {
                                item.inputs.length === 0 && <div>{data[item.name] ? data[item.name] : "loading..." }</div>
                            } */}
									<div>
										<Button secondary onClick={() => call(item)}>
											Query
										</Button>
									</div>
									{result[item.name] && (
										<div style={{ wordBreak: "break-word" }}>
											{JSON.stringify(result[item.name])}
										</div>
									)}
									{loading[item.name] && <div>loading...</div>}
								</Accordion.Body>
							</Accordion.Item>
						))}
					</Accordion>
				</div>
			)}
			{writeFunctions.length !== 0 && show === 1 && (
				<div className="w-75 mb-4">
					<div className="my-3 px-4" style={{ fontSize: "28px" }}>
						Write Contract
					</div>
					<Accordion defaultActiveKey="0">
						{writeFunctions.map((item, key) => (
							<Accordion.Item
								eventKey={key}
								key={"key" + key}
								style={{ backgroundColor: "white" }}
							>
								<Accordion.Header
									className="py-2 acc-header"
									style={{ backgroundColor: "#020227" }}
								>
									{key + 1}. {item.name}
								</Accordion.Header>
								<Accordion.Body
									className="py-2"
									style={{ backgroundColor: "#020227" }}
								>
									<div className="d-flex flex-column gap-2">
										{item.inputs.map((item, index) => (
											<Input
												className="w-100 my-1"
												key={index * -1}
												placeholder={`${item.name} (${item.type})`}
												name={item.name}
												onChange={(e) => handleChange(e, item)}
											/>
										))}
										{item?.payable === true && (
											<Input
												className="w-100 my-1"
												key="payable value"
												placeholder={"payable value"}
												name={"payable value"}
												onChange={(e) => setValue(e.target.value)}
											/>
										)}
									</div>
									<div>
										<Button secondary onClick={() => write(item)}>
											Write
										</Button>
									</div>
								</Accordion.Body>
							</Accordion.Item>
						))}
					</Accordion>
				</div>
			)}
			{err.error && (
				<div
					className="w-100 h-100 d-flex justify-content-center align-items-center position-absolute top-0"
					style={{ backgroundColor: "rgba(2,117,216,0.5)" }}
				>
					<div
						className="bg-dark p-4 d-flex flex-column gap-2 position-absolute mx-4"
						style={{ top: "35vh" }}
					>
						<div
							style={{ cursor: "pointer" }}
							onClick={() => setErr({ err: false, msg: "" })}
						>
							close
						</div>
						<div>
							<h4>{err.msg}</h4>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AbiInputsGenerator;
