export const signinABI = [
	{
		inputs: [{ internalType: "address", name: "_owner", type: "address" }],
		name: "primaryToken",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "tokenURI",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "_userId", type: "uint256" }],
		name: "username",
		outputs: [{ internalType: "string", name: "_username", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
			{ internalType: "string", name: "_tokenURI", type: "string" },
		],
		name: "setTokenURI",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		"inputs": [
			{ "internalType": "string", "name": "_username", "type": "string" }
		],
		"name": "userId",
		"outputs": [{ "internalType": "uint256", "name": "Id", "type": "uint256" }],
		"stateMutability": "view",
		"type": "function"
	},
]
