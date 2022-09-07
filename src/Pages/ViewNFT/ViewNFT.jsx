import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";

import Input from "../../Components/styled/input";
import Button from "../../Components/styled/Button";
import NFTCard from "../../Components/NFTCard";
import { checkLink } from "../../addresses";
import { ABI } from "./ViewNFT_ABI";
import TokenInfo from "../../Components/TokenInfo";

const ViewNFT = () => {
	const [contractAddress, setContractAddress] = useState("");
	const [tokenID, setTokenId] = useState("");
	const [previousToken, setPreviousToken] = useState();
	const [currentToken, setCurrentToken] = useState();
	const [nextToken, setNextToken] = useState();
	const [show, setShow] = useState(false);
	const [modalToken, setModalToken] = useState(null);
	const [loading, setLoading] = useState(false);

	const { active, chainId, library: web3 } = useWeb3React();

	const getToken = async (tokenID) => {
		if (!active) return;
		const contract = new web3.eth.Contract(ABI, contractAddress);
		const tokenURI = await contract.methods
			.tokenURI(tokenID)
			.call((res) => res);
		const tempTokenURI = checkLink(tokenURI);
		const tokenJson = await axios.get(tempTokenURI).then((res) => res.data);
		return { ...tokenJson, tokenID, contractAddress, tokenURI };
	};

	const getTokenByClick = async (tokenID) => {
		const token = await getToken(tokenID);
		setCurrentToken(token);
	};

	const loadNext = async () => {
		setLoading(true);
		setPreviousToken({ ...currentToken });
		setCurrentToken({ ...nextToken });

		const tempNextToken = await getToken(parseInt(tokenID) + 2);
		setNextToken(tempNextToken);

		setTokenId(parseInt(tokenID) + 1);

		setLoading(false);
	};

	const loadPrevious = async () => {
		setLoading(true);
		setNextToken({ ...currentToken });
		setCurrentToken({ ...previousToken });

		const tempPrevToken = await getToken(parseInt(tokenID) - 2);
		setPreviousToken(tempPrevToken);

		setTokenId(parseInt(tokenID) - 1);
		setLoading(false);
	};

	useEffect(() => {
		//runs on the first time when user clicked on View nft button
		if (previousToken || nextToken) return;
		(async () => {
			if (!tokenID) return;

			const previousToken = await getToken(parseInt(tokenID) - 1);
			const nextToken = await getToken(parseInt(tokenID) + 1);

			setPreviousToken(previousToken);
			setNextToken(nextToken);
		})();
	}, [currentToken]);

	return (
		<div
			className=" h-100 w-100 d-flex flex-column align-items-center"
			style={{ position: "relative", left: 0 }}
		>
			<div
				className="my-2 w-100 d-flex justify-content-center"
				style={{ borderBottom: "1px solid white" }}
			>
				<h1>View NFT</h1>
			</div>
			<div className="d-flex flex-column align-items-center">
				<Input
					type="text"
					name="contractAddress"
					onChange={(e) => setContractAddress(e.target.value)}
					title={"Contract Address"}
					style={{ width: "21rem" }}
					value={contractAddress}
				/>
				<Input
					type="text"
					name="tokenId"
					onChange={(e) => setTokenId(e.target.value)}
					title={"Token Id"}
					style={{ width: "21rem" }}
					value={tokenID}
				/>
				<Button
					secondary
					className="w-75"
					onClick={() => getTokenByClick(tokenID)}
				>
					View NFT
				</Button>
			</div>
			{currentToken && (
				<div>
					<NFTCard
						token={currentToken}
						setShow={setShow}
						setModalToken={setModalToken}
						getToken={() => {}}
						checkLink={checkLink}
						setSpamToken={() => {}}
						showHideAndSpam={false}
					/>
					<div className="d-flex justify-content-between">
						{previousToken && (
							<Button
								secondary
								className="mx-0"
								onClick={loadPrevious}
								disabled={loading}
							>
								Previous
							</Button>
						)}
						{nextToken && (
							<Button
								secondary
								className="mx-0"
								onClick={loadNext}
								disabled={loading}
							>
								Next
							</Button>
						)}
						{show && <TokenInfo modalToken={modalToken} setShow={setShow} />}
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewNFT;
