import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";

import Button from "./styled/Button";
import Input from "./styled/input";
import { NFTContractABI } from "../Pages/CrossChainNFT/TransferNFTABI";
import useWidth from "../Hooks/useWidth";
import ProgressBar from "./ProgressBar";

const TransferModal = ({ show, setShow, token }) => {
	const { active, account, library } = useWeb3React();
	const width = useWidth();
	const [address, setAddress] = useState("");
	const [addressSmall, setAddressSmall] = useState("");
	const [transferBtn, setTransferBtn] = useState({
		disabled: false,
		loading: false,
		approving: false,
		msg: "",
	});
	const safeTranferFrom = () => {
		if (address.length === 0) {
			setAddressSmall("address can't be empty");
			return;
		}
		setTransferBtn({ ...transferBtn, disabled: true, approving: true });
		const contract = new library.eth.Contract(
			NFTContractABI,
			token.contractAddress
		);
		contract.methods
			.safeTransferFrom(account, address, token.tokenID)
			.send({ from: account })
			.on("transactionHash", (transactionHash) => {
				setTransferBtn({ ...transferBtn, loading: true, approving: false });
			})
			.on("receipt", (receipt) => {
				setTransferBtn({
					disabled: false,
					approving: false,
					loading: false,
					msg: "",
				});
				setShow(false);
			})
			.on("error", (error) => {
				setTransferBtn({
					disabled: false,
					approving: false,
					loading: false,
					msg: error.msg,
				});
				console.log("error in sending info", error);
			});
	};
	if (show)
		return (
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
				<div
					className="d-flex flex-row-reverse"
					style={{ cursor: "pointer" }}
					onClick={() => {
						setShow(false);
						setTransferBtn({ ...transferBtn, msg: "" });
					}}
				>
					close
				</div>
				<div className="my-4">
					<div className="w-full d-flex justify-content-center">
						select your destination address
					</div>
					<Input
						style={{ width: width > 992 ? "24rem" : "19rem" }}
						small={addressSmall}
						success={addressSmall.length !== 0 ? true : false}
						value={address}
						onChange={(e) => {
							setAddress(e.target.value);
							setAddressSmall("");
						}}
						title="address"
						className=""
						name="address"
						type="text"
					/>
					<div className="text-center py-2 px-4" style={{ color: "#FF00FF" }}>
						becarefull your destination address must be on your destination
						network
					</div>
				</div>
				<div className="w-full d-flex justify-content-center">
					<Button onClick={safeTranferFrom} secondary>
						Safe Transfer
					</Button>
				</div>
				{transferBtn.loading && <ProgressBar estimatedTime={10} />}
				{transferBtn.approving && (
					<div
						className="w-100 h-100 d-flex flex-column justify-content-center align-items-center"
						style={{
							position: "absolute",
							top: "0",
							left: "0",
							zIndex: "20",
							backgroundColor: "rgba(2,117,216,0.5)",
						}}
					>
						<h4 className="bg-white text-dark larger p-2">
							wating for metamask comfirm...
						</h4>
					</div>
				)}
			</div>
		);
	else return <></>;
};

export default TransferModal;
