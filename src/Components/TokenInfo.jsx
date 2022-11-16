import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const TokenInfo = ({ setShow, modalToken }) => {
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
								onClick={() => navigator.clipboard.writeText(modalToken.image)}
							>
								{modalToken.image.length < 40
									? modalToken.image
									: modalToken.image.slice(0, 40) + "..."}
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
									: modalToken.tokenURI.slice(0, 40) + "..."}
							</div>
						</OverlayTrigger>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TokenInfo;
