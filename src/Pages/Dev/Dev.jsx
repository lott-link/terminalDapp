import React from 'react'
import { useWeb3React } from "@web3-react/core";
import { context } from '../../App'
import { useContext } from 'react';
const contractAddress = "0x165B4cEAd9377079A05Be08DFe0881CF79879C0C"
const contractABI = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"print","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"redeem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const Dev = () => {
  const data = useContext(context);
  console.log(data);
  const { library, active, account } = useWeb3React();
    
  const fromAddress = account;
  const expiry = Date.now() + 120;
  const spender = "0x80197C1b1d7521919768cc518983640E5Ec4e2ad";
  const createPermitMessageData = function (nonce) {
    const message = {
      owner: fromAddress,
      spender: spender,
      value: 100,
      nonce: nonce,
      deadline: expiry,
    };

    const typedData = JSON.stringify({
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      },
      primaryType: "Permit",
      domain: {
        name: "MyToken",
        version: "1",
        chainId: 80001,
        verifyingContract: contractAddress,
      },
      message: message,
    });

    return {
      typedData,
      message,
    };
  };
  const signData = async function (web3, fromAddress, typeData) {
    return new Promise(function (resolve, reject) {
      web3.currentProvider.sendAsync(
        {
          id: 1,
          method: "eth_signTypedData_v3",
          params: [fromAddress, typeData],
          from: fromAddress,
        },
        function (err, result) {
          if (err) {
            reject(err); //TODO
          } else {
            const r = result.result.slice(0, 66);
            const s = "0x" + result.result.slice(66, 130);
            const v = Number("0x" + result.result.slice(130, 132));
            resolve({
              v,
              r,
              s,
            });
          }
        }
      );
    });
  };
  const signTransferPermit = async function () {
    if (active) {
      const contract = new library.eth.Contract(contractABI, contractAddress);
      const nonces = await contract.methods
        .nonces(account)
        .call()
        .then((res) => res);
      console.log("nonce", nonces);
      const { typedData, message } = createPermitMessageData(nonces);
      console.log(typedData, message);
      const sig = await signData(library, account, typedData);
      console.log(Object.assign({}, sig, message));
      sendTx(
        contract,
        account,
        "0x80197C1b1d7521919768cc518983640E5Ec4e2ad",
        100,
        message.deadline,
        sig.v,
        sig.r,
        sig.s
      );
    }
  };
  const sendTx = (contract, owner, spender, value, deadline, v, r, s) => {
    const walletPrivateKey =
      "709f6849f80df7429832a2c6f048aff06f31f070d407e191755c9b2e4c645dda";
    const encodedABI = contract.methods
      .permit(owner, spender, value, deadline, v, r, s)
      .encodeABI();
    const tx = {
      from: "0x80197C1b1d7521919768cc518983640E5Ec4e2ad",
      to: contractAddress,
      gas: 2000000,
      data: encodedABI,
    };
    library.eth.accounts
      .signTransaction(tx, walletPrivateKey)
      .then((signed) => {
        const tran = library.eth.sendSignedTransaction(signed.rawTransaction);
        tran.then((receipt) => {
          console.log("in then" + receipt);
          library.eth.getAccounts((res) => console.log("accounts", res));
        });
        tran.on("confirmation", (confirmationNumber, receipt) => {
          console.log("confirmation: " + confirmationNumber);
        });
        tran.on("transactionHash", (hash) => {
          console.log("hash");
          console.log(hash);
        });
        tran.on("receipt", (receipt) => {
          console.log("reciept");
          console.log(receipt);
        });
        tran.once("receipt", function (receipt) {
          console.log("this is in receipt", receipt);
        });
        tran.once("sending", function (payload) {
          console.log("this is in sending", payload);
        });
        tran.once("sent", function (payload) {
          console.log("this is in sent", payload);
        });
        tran.on("error", console.error);
      });
  };


  return (
    <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{overflow:'auto'}}>
      <div>
        <button onClick={signTransferPermit}>sign</button>
      </div>
    </div>
  );
};

export default Dev;
