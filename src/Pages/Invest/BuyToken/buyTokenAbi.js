export const buyTokenABI = [
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "bytes", name: "referral", type: "bytes" },
    ],
    name: "swap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x39aca1c1",
  },
  {
    inputs: [],
    name: "tokensIn",
    outputs: [{ internalType: "address[]", name: "temp", type: "address[]" }],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0xd3b82b7c",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
    ],
    name: "amountLott",
    outputs: [
      { internalType: "uint256", name: "_amountLott", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x0a47abea",
  },
];
