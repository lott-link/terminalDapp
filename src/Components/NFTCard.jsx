import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import DropDownComponent from "./DropDownComponent";
import LazyImage from "./LazyImage";
import AccordionComponent from "./AccordionComponent";

const NFTCard = ({
	token,
	setShow,
	setModalToken,
	getToken,
	checkLink,
	setSpamToken,
	setUnspamToken,
}) => {
	const { library, account } = useWeb3React();
	const [loading, setLoading] = useState(true);
	const handleLoad = () => setLoading(false);
	const [info, setInfo] = useState([]);
	const [val, setVal] = useState("");
	useEffect(() => {
		for (let key in token) {
			// if(key!=="chainId" && key!== "tokenID" && key!== "contractAddress" && key!=='image')
			if (
				![
					"chainId",
					"tokenID",
					"contractAddress",
					"image",
					"interaction",
					"tokenURI",
					"isSpam",
				].includes(key)
			)
				setInfo((prev) => [...prev, [key, token[key]]]);
		}
	}, []);
	const handleChange = (e, item) => {
		if (item.params) {
			item.params = { ...item.params, [e.target.name]: e.target.value };
		} else {
			item.params = { [e.target.name]: e.target.value };
		}
	};
	const call = (item) => {
		const args = paramOrder(item);
		const contract = new library.eth.Contract([item], token.contractAddress);
		contract.methods[item.name](...args)
			.call()
			.then((res) => setVal({ res, sig: item.signature }));
	};
	const write = (item) => {
		const args = paramOrder(item);
		const contract = new library.eth.Contract([item], token.contractAddress);
		contract.methods[item.name](...args)
			.send({ from: account })
			.then((res) => console.log(res));
	};
	const paramOrder = (item) => {
		const arr = [];
		for (let i = 0; i < item.inputs.length; i++)
			arr.push(item.params[item.inputs[i].name]);
		return arr;
	};
	return (
		<div style={{ width: "275px" }}>
			<div style={{ backgroundColor: "#C4C4C4" }}>
				<DropDownComponent
					token={token}
					setShow={setShow}
					setModalToken={setModalToken}
					getToken={getToken}
					setSpamToken={setSpamToken}
					setUnspamToken={setUnspamToken}
				/>
			</div>
			<div
				style={{ width: "275px", height: "225px", backgroundColor: "#C4C4C4" }}
			>
				<img
					className="w-100 h-100"
					onLoad={handleLoad}
					style={{
						objectFit: "contain",
						display: loading ? "none" : "initial",
					}}
					src={checkLink(token.image)}
					alt=""
				/>
				{loading && <LazyImage className="w-100 h-100" />}
			</div>
			<div
				className="bg-white text-dark px-2 py-3"
				style={{ width: "275px", minHeight: "130px" }}
			>
				{info.map((property, index) => (
					<AccordionComponent key={index} property={property} />
				))}
				{token.interaction !== "noInteraction" && (
					<>
						<div>
							{token.interaction.read.map((item, index) => {
								return (
									<div key={index}>
										<div>
											<label htmlFor="">{item.name}</label>
										</div>
										{item.inputs.map((element, index2) => {
											return (
												<input
													key={index2 * 1000}
													type="text"
													placeholder={element.name}
													name={element.name}
													onChange={(e) => handleChange(e, item)}
												/>
											);
										})}
										<button className="rounded" onClick={() => call(item)}>
											call
										</button>
										{val && val.sig === item.signature && <div>{val.res}</div>}
									</div>
								);
							})}
						</div>
						<div>
							{token.interaction.write.map((item, index) => {
								return (
									<div key={index * -1}>
										<label htmlFor="">{item.name}</label>
										{item.inputs.map((element, index2) => {
											return (
												<input
													key={index2 * 1000}
													type="text"
													placeholder={element.name}
													name={element.name}
													onChange={(e) => handleChange(e, item)}
												/>
											);
										})}
										<button onClick={() => write(item)}>write</button>
									</div>
								);
							})}
						</div>
					</>
				)}
			</div>
		</div>
	);
};
export default NFTCard;
