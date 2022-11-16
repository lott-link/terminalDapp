export const NFTContractABI = [
	{
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
		],
		name: "safeTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];
export const abi = [
    {
		inputs: [
			{ internalType: "uint256", name: "wTokenId", type: "uint256" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "address", name: "dappAddr", type: "address" },
		],
		name: "requestReleaseLockedToken",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
    {
		inputs: [{ internalType: "uint256", name: "wTokenId", type: "uint256" }],
		name: "getLockedTokenData",
		outputs: [
			{ internalType: "uint256", name: "chainId", type: "uint256" },
			{ internalType: "address", name: "contAddr", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
			{ internalType: "uint256", name: "releaseGasFee", type: "uint256" },
		],
		stateMutability: "view",
		type: "function",
	},
    {
		inputs: [
			{ internalType: "address", name: "contAddr", type: "address" },
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "uint256", name: "targetChainId", type: "uint256" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
			{ internalType: "address", name: "dappAddr", type: "address" },
		],
		name: "requestTransferCrossChain",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
    {
		inputs: [
			{ internalType: "uint256", name: "targetChainId", type: "uint256" },
		],
		name: "mintFee",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
];
