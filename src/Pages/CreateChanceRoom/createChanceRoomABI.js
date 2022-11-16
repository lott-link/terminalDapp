export const newChanceRoomABI = [
    {
        inputs: [
            { internalType: "string", name: "info", type: "string" },
            { internalType: "string", name: "baseURI", type: "string" },
            { internalType: "uint256", name: "gateFee", type: "uint256" },
            { internalType: "uint256", name: "percentCommission", type: "uint256" },
            { internalType: "uint256", name: "userLimit", type: "uint256" },
            { internalType: "uint256", name: "timeLimit", type: "uint256" },
        ],
        name: "newChanceRoom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    }
]