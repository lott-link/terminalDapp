export const factoryContractABI = [
	{
		inputs: [],
		name: "registerContract",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
];
export const registerContractABI = [
	{
		inputs: [{ internalType: "uint256", name: "Id", type: "uint256" }],
		name: "registered",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "charAddr_", type: "address" },
			{ internalType: "string", name: "charName_", type: "string" },
			{ internalType: "string", name: "charInfo_", type: "string" },
			{ internalType: "uint256", name: "refId_", type: "uint256" },
			{ internalType: "uint256", name: "dappId", type: "uint256" },
		],
		name: "register",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [{ internalType: "string", name: "charName", type: "string" }],
		name: "charNamePrice",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
];
export const interaction = {
	read: [
		{
			inputs: [
				{
					internalType: "uint256",
					name: "userId",
					type: "uint256",
				},
			],
			name: "balanceInWei",
			outputs: [
				{
					internalType: "uint256",
					name: "",
					type: "uint256",
				},
			],
			stateMutability: "view",
			type: "function",
		},
	],
	write: [
		{
			inputs: [],
			name: "withdraw",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
	],
};
