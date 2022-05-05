export const factoryContractABI = [
    {
        inputs: [],
        name: "registerContract",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    }
]
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
            { internalType: "string", name: "_username", type: "string" },
            { internalType: "string", name: "uri", type: "string" },
            { internalType: "uint256[]", name: "referralIds", type: "uint256[]" },
            {
                internalType: "uint256[]",
                name: "commissionPercents",
                type: "uint256[]",
            },
        ],
        name: "signIn",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
		"inputs": [
			{ "internalType": "string", "name": "_username", "type": "string" }
		],
		"name": "usernamePrice",
		"outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
		"stateMutability": "view",
		"type": "function"
	},
    {
		"inputs": [
			{ "internalType": "address", "name": "_owner", "type": "address" }
		],
		"name": "primaryUsername",
		"outputs": [{ "internalType": "string", "name": "", "type": "string" }],
		"stateMutability": "view",
		"type": "function"
	},
]
export const interaction = {
    read:[
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "userId",
                    "type": "uint256"
                }
            ],
            "name": "balanceInWei",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        } 
    ],
    write:[
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
}
