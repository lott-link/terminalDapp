export const messengerABI = [
    {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "publicKey",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "string", name: "subject", type: "string" },
            { internalType: "string", name: "message", type: "string" },
        ],
        name: "sendMessage",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "string", name: "_publicKey", type: "string" }],
        name: "setPublicKey",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
]