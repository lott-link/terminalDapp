import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import { context } from "../../App";
import Spinner from "react-bootstrap/Spinner";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { checkLink } from "../../addresses";
import NFTCard from "../../Components/NFTCard";
import { contractABI } from "./AssetABI";

const Assets = () => {
	const data = useContext(context);
	const { active, account, library, chainId } = useWeb3React();
	const [tokens, setTokens] = useState([]);
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);
	const [modalToken, setModalToken] = useState(null);
	const [error, setError] = useState({ err: false, msg: "" });
	const [spams, setSpams] = useState([]);
	const [showTransferModal, setShowTransferModal] = useState(false);

	const getERC721 = async () => {
		if (!active) return;
		setLoading(true);
		setTokens([]);
		if (!data.network) return;
		let array;
		try {
			array = await axios
				.get(`${data.addresses[data.network]["erc721API"]}${account}`)
				.then((res) => res.data.result);
		} catch (err) {
			setError({ err: true, msg: "Oops something went wrong,please reload" });
			setLoading(false);
			return;
		}
		console.log(array);
		let ids = array.map((token) => token.tokenID + token.contractAddress);
		// ids = Array.from(new Set(ids))
		const counts = new Array(ids.length).fill(0);
		for (let i = 0; i < array.length; i++) {
			for (let j = 0; j < array.length; j++) {
				if (array[i].tokenID + array[i].contractAddress === ids[j]) counts[j]++;
			}
		}
		let idsToShow = [];
		let raw = [];
		counts.forEach((id, index) => {
			if (id % 2 !== 0) {
				idsToShow.push(ids[index]);
				raw.push(array[index]);
			}
		});
		console.log("ids to show", idsToShow);
		console.log("raw", raw);
		const result = group2(raw);
		setLoading(false);
		// const tempTokens = []
		idsToShow.forEach(async (id, index) => {
			const token = await getToken(id.split("0x")[0], "0x" + id.split("0x")[1]);
			if (token) {
				// tempTokens.push(token)

				const tempGroup = result.find((item) =>
					item[0].includes(token.contractAddress)
				);
				const tempToken = tempGroup[1].find(
					(item) => item.tokenID === token.tokenID
				);

				if (tempToken) {
					tempToken.name = token.name;
					tempToken.description = token.description;
					tempToken.image = token.image;
					tempToken.tokenID = token.tokenID;
					tempToken.contractAddress = token.contractAddress;
					tempToken.chainId = token.chainId;
					tempToken.attributes = token.attributes;
					tempToken.interaction = token.interaction
						? token.interaction
						: "noInteraction";
					tempToken.tokenURI = token.tokenURI;
					tempToken.isSpam = false;

					setTokens([...result]);
				} else {
					console.log("broken token", token, tempToken);
				}
				// setTokens(prev=>[...prev,token])
			}
			if (index === idsToShow.length - 1) {
				// setLoading(false)
				// group(tempTokens)
			}
		});
		// if(idsToShow.length === 0) setLoading(false)
	};
	//getToken gets token information it accepts token id and contract address
	//then checks in local storage, if the token is available in localstorage returns it
	//else it gets tokenURI from contract
	const getToken = async (tokenID, contractAddress, refresh = false) => {
		if (!active) return;
		const token = localStorage.getItem(contractAddress + tokenID);
		if (token && !refresh) {
			return JSON.parse(token);
		} else {
			const contract = new library.eth.Contract(contractABI, contractAddress);
			const tokenURI = await contract.methods
				.tokenURI(tokenID)
				.call((res) => res);
			const tempTokenURI = checkLink(tokenURI);
			try {
				console.log("tokenURI", tempTokenURI);
				const tokenJson = await axios.get(tempTokenURI).then((res) => res.data);
				// const image = checkLink(tokenJson.image)
				const data = {
					name: tokenJson.name,
					description: tokenJson.description,
					image: tokenJson.image,
					tokenID,
					contractAddress,
					chainId,
					attributes: tokenJson.attributes,
					interaction: tokenJson.interaction
						? tokenJson.interaction
						: "noInteraction",
					tokenURI: tokenURI,
					isSpam: false,
				};
				localStorage.setItem(contractAddress + tokenID, JSON.stringify(data));
				if (refresh) {
					let findGroup = tokens.find((item) =>
						item[0].includes(contractAddress)
					);
					let findToken = findGroup[1].find((item) => item.tokenID === tokenID);
					console.log(findToken);

					findToken.name = data.name;
					findToken.description = data.description;
					findToken.image = data.image;
					findToken.tokenID = data.tokenID;
					findToken.contractAddress = data.contractAddress;
					findToken.chainId = data.chainId;
					findToken.attributes = data.attributes;
					findToken.interaction = data.interaction
						? data.interaction
						: "noInteraction";
					findToken.tokenURI = data.tokenURI;
					findToken.isSpam = false;

					setTokens([...tokens]);
					console.log(findToken);
				}
				return data;
			} catch (err) {
				return {
					name: "failed to load",
					description: "",
					image: "",
					tokenID,
					contractAddress,
					chainId: "",
					attributes: "",
					interaction: "noInteraction",
					tokenURI: "",
					isSpam: "",
				};
			}
		}
	};
	const group2 = (tempTokens) => {
		const data = {
			name: "",
			description: "",
			image: "",
			tokenID: "",
			contractAddress: "",
			chainId: "",
			attributes: "",
			interaction: "noInteraction",
			tokenURI: "",
			isSpam: "",
		};
		let result = {};
		tempTokens.forEach((token) => {
			if (result[token.tokenName + " " + token.contractAddress])
				result[token.tokenName + " " + token.contractAddress].push({
					...data,
					contractAddress: token.contractAddress,
					tokenID: token.tokenID,
				});
			else
				result[token.tokenName + " " + token.contractAddress] = [
					{
						...data,
						contractAddress: token.contractAddress,
						tokenID: token.tokenID,
					},
				];
		});
		console.log("group2", Object.entries(result));
		setTokens(Object.entries(result));
		return Object.entries(result);
	};
	useEffect(() => {
		data.network && getERC721();
	}, [data.network, chainId]);
	if (tokens.length === 0 && !loading && !error.err)
		return (
			<div className="w-100 h-100 d-flex justify-content-center align-items-center">
				<h1>you don't have any token</h1>
			</div>
		);
	const setSpamToken = (token) => {
		token.isSpam = true;
		const foundGroup = tokens.find((item) =>
			item[0].includes(token.contractAddress)
		);
		foundGroup[1] = foundGroup[1].filter(
			(item) =>
				!(
					item.contractAddress === token.contractAddress &&
					item.tokenID === token.tokenID
				)
		);
		setTokens([...tokens]);
		setSpams([...spams, token]);
	};
	const setUnspamToken = (token) => {
		token.isSpam = false;
		setSpams((prev) =>
			prev.filter(
				(item) =>
					item.contractAddress !== token.contractAddress &&
					item.tokenID !== token.tokenID
			)
		);
		const foundGroup = tokens.find((item) =>
			item[0].includes(token.contractAddress)
		);
		foundGroup[1].push(token);
		setTokens([...tokens]);
	};
	return (
		<div
			className="w-100 h-100"
			style={{ overflowY: "auto", position: "relative" }}
		>
			<div className="d-flex flex-column flex-wrap px-3 py-4">
				{tokens.map((group, index) => {
					return (
						group[1].length !== 0 && (
							<div
								key={Math.random() * 1e6}
								className="px-4 pb-4 my-2"
								style={{
									border: "5px double white",
									overFlow: "auto",
									position: "relative",
								}}
							>
								<div
									className="px-2"
									style={{
										position: "absolute",
										top: "-1rem",
										zIndex: "20",
										backgroundColor: "#020227",
									}}
								>
									{group[0] && group[0].split(" ")[0]}
									<OverlayTrigger
										key={"index"}
										placement={"bottom"}
										overlay={<Tooltip>explore block</Tooltip>}
									>
										<a
											href={
												data.chains[data.network].params[0]
													.blockExplorerUrls[0] +
												"/" +
												"address" +
												"/" +
												(group[0] && group[0].split(" ")[1])
											}
											target="_blank"
											rel="noreferrer"
										>
											<img
												className="mx-2 mb-1"
												src="/info2.svg"
												alt="tooltip-info"
											/>
										</a>
									</OverlayTrigger>
								</div>
								<div
									className="d-flex flex-wrap gap-4"
									style={{ marginTop: "2rem" }}
								>
									{group[1] &&
										group[1].map((token) => (
											<NFTCard
												key={Math.random() * 1e6}
												token={token}
												setShow={setShow}
												setModalToken={setModalToken}
												getToken={getToken}
												checkLink={checkLink}
												setSpamToken={setSpamToken}
											/>
										))}
								</div>
							</div>
						)
					);
				})}
				{spams.length !== 0 && (
					<div
						className="px-4 pb-4 my-2"
						style={{
							border: "5px double white",
							overFlow: "auto",
							position: "relative",
						}}
					>
						<div
							className="px-2"
							style={{
								position: "absolute",
								top: "-1rem",
								zIndex: "20",
								backgroundColor: "#020227",
							}}
						>
							Spam
						</div>
						<div
							className="d-flex flex-wrap gap-4"
							style={{ marginTop: "2rem" }}
						>
							{spams.map((token) => (
								<NFTCard
									key={Math.random() * 1e6}
									token={token}
									setShow={setShow}
									setModalToken={setModalToken}
									getToken={getToken}
									checkLink={checkLink}
									setSpamToken={setSpamToken}
									setUnspamToken={setUnspamToken}
								/>
							))}
						</div>
					</div>
				)}
				{loading && (
					<div style={{ position: "absolute", top: "45%", left: "45%" }}>
						<Spinner
							style={{ width: "3rem", height: "3rem" }}
							animation="grow"
							variant="light"
						/>
						<Spinner
							className="mx-2"
							style={{ width: "3rem", height: "3rem" }}
							animation="grow"
							variant="light"
						/>
						<Spinner
							style={{ width: "3rem", height: "3rem" }}
							animation="grow"
							variant="light"
						/>
					</div>
				)}
			</div>
			{show && (
				<div
					className="w-50 p-3"
					style={{
						height: "50vh",
						position: "fixed",
						backgroundColor: "rgba(0,0,0,0.8)",
						zIndex: "20",
						top: "27%",
						left: "33%",
						border: "5px double white",
					}}
				>
					<div>
						<div
							className="d-flex flex-row-reverse"
							style={{ cursor: "pointer" }}
							onClick={() => setShow(false)}
						>
							close
						</div>
						<div className="d-flex">
							<div>contract address:</div>
							<div style={{ wordBreak: "break-word" }}>
								{modalToken.contractAddress}
							</div>
						</div>
						<div className="d-flex">
							<div style={{ width: "8rem" }}>asset link:</div>
							<div style={{ wordBreak: "break-word" }}>
								<OverlayTrigger
									key={"index"}
									placement={"bottom"}
									overlay={<Tooltip>Copy</Tooltip>}
								>
									<div
										className="text-primary text-decoration-underline"
										onClick={() =>
											navigator.clipboard.writeText(modalToken.image)
										}
									>
										{modalToken.image.length < 40
											? modalToken.image
											: modalToken.image.slice(0, 40)}
									</div>
								</OverlayTrigger>
							</div>
						</div>
						<div className="d-flex">
							<div style={{ width: "8rem" }}>token uri:</div>
							<div style={{ wordBreak: "break-word" }}>
								<OverlayTrigger
									key={"index"}
									placement={"bottom"}
									overlay={<Tooltip>Copy</Tooltip>}
								>
									<div
										className="text-primary text-decoration-underline"
										onClick={() =>
											navigator.clipboard.writeText(modalToken.tokenURI)
										}
									>
										{modalToken.tokenURI.length < 40
											? modalToken.tokenURI
											: modalToken.tokenURI.slice(0, 40)}
									</div>
								</OverlayTrigger>
							</div>
						</div>
					</div>
				</div>
			)}
			{error.err && (
				<div
					className="w-50 p-3"
					style={{
						height: "50vh",
						position: "fixed",
						backgroundColor: "rgba(0,0,0,0.8)",
						zIndex: "20",
						top: "27%",
						left: "33%",
						border: "5px double white",
					}}
				>
					<div className="d-flex justify-content-center align-items-center">
						<h4>{error.msg}</h4>
					</div>
				</div>
			)}
		</div>
	);
};
export default Assets;
