import React, { useState, useRef } from 'react'
import { create } from 'ipfs-http-client'
import { useWeb3React } from "@web3-react/core";
import axios from 'axios';
import { context } from '../App'
import { useContext } from 'react';
import EthCrypto, { recover } from 'eth-crypto'
import { encrypt,  recoverTypedSignature_v4, TypedDataUtils  } from 'eth-sig-util'
import buffer from 'buffer'
import { publicKeyConvert } from 'ethereum-cryptography/secp256k1'
const contractAddress = "0x165B4cEAd9377079A05Be08DFe0881CF79879C0C"
const contractABI = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"print","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"redeem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const client = create('https://ipfs.infura.io:5001/api/v0')
const Dev = () => {
  const data = useContext(context);
  console.log(data);
  const { library, active, account } = useWeb3React();
  const [file, setFile] = useState();
  const [hash, setHash] = useState();
  const send = async ()=>{
    const added = await client.add();
    console.log(added)
    const fileUrl = `https://ipfs.infura.io/ipfs/${added.path}`;
    setHash(fileUrl);
  }
  const sendFile = async () => {
    try {
      // const size = file.size
      console.log(file.name.split(".")[1]);
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        console.log(img.width, img.height);
      };
      console.log(file);
      //********uploading ipfs******
      const added = await client.add(file);
      console.log(added);
      const fileUrl = `https://ipfs.infura.io/ipfs/${added.path}`;
      setHash(fileUrl);
      //********uploading ipfs******
      //*****************************//
      //********uploading locally******
      const formData = new FormData();
      formData.append("hash", added.path + file.name.split(".")[1]);
      formData.append("file", file);
      axios
        .post("https://files.lott.link/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => console.log("uploaded to server"));
      //********uploading locally******
    } catch (error) {
      console.log("error occured whilte uploading the file!", error);
    }
  };
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

 
  const metadata = {
    contractAddress: "0xd2Ad56D684A211b5Ee5a2aFb6e8E7a6e6F642d67",
    interaction: {
      read: [
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "isApprovedForAll",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      write: [
        {
          inputs: [],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        ,
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
    },
  };
  const call = (item) => {
    const args = paramOrder(item);
    console.log(args, item);
    const contract = new library.eth.Contract([item], metadata.contractAddress);
    contract.methods[item.name](...args)
      .call()
      .then((res) => console.log(res));
  };
  const write = (item) => {
    const contract = new library.eth.Contract([item], metadata.contractAddress);
    contract.methods[item.name]()
      .send({ from: account })
      .then((res) => console.log(res));
  };
  const handleChange = (e, item) => {
    if (item.params) {
      item.params = { ...item.params, [e.target.name]: e.target.value };
    } else {
      item.params = { [e.target.name]: e.target.value };
    }
  };
  const paramOrder = (item) => {
    const arr = [];
    for (let i = 0; i < item.inputs.length; i++)
      arr.push(item.params[item.inputs[i].name]);
    return arr;
  };
  const [link,setLink] = useState()
  const [view,setView] = useState(false)
  const encryptTest = async () => {
    //create two identities
    const alice = EthCrypto.createIdentity();
    const bob = EthCrypto.createIdentity();
    const secretMessage = 'My name is Satoshi Buterin';
    /* > {
    address: '0x3f243FdacE01Cfd9719f7359c94BA11361f32471',
    privateKey: '0x107be946709e41b7895eea9f2dacf998a0a9124acbb786f0fd1a826101581a07',
    publicKey: 'bf1cc3154424dc22191941d9f4f50b063a2b663a2337e5548abea633c1d06ece...'
    } */

    //encrypt and sign message
    const signature = EthCrypto.sign(
      alice.privateKey,
      EthCrypto.hash.keccak256(secretMessage)
      );
      const payload = {
          message: secretMessage,
          signature
      };
      const encrypted = await EthCrypto.encryptWithPublicKey(
          bob.publicKey, // by encryping with bobs publicKey, only bob can decrypt the payload with his privateKey
          JSON.stringify(payload) // we have to stringify the payload before we can encrypt it
      );
      /*  { iv: 'c66fbc24cc7ef520a7...',
        ephemPublicKey: '048e34ce5cca0b69d4e1f5...',
        ciphertext: '27b91fe986e3ab030...',
        mac: 'dd7b78c16e462c42876745c7...'
          }
      */

      // we convert the object into a smaller string-representation
      const encryptedString = EthCrypto.cipher.stringify(encrypted);
      // > '812ee676cf06ba72316862fd3dabe7e403c7395bda62243b7b0eea5eb..'

      // now we send the encrypted string to bob over the internet.. *bieb, bieb, blob*




      // we parse the string into the object again
      const encryptedObject = EthCrypto.cipher.parse(encryptedString);
              
      const decrypted = await EthCrypto.decryptWithPrivateKey(
          bob.privateKey,
          encryptedObject
      );
      const decryptedPayload = JSON.parse(decrypted);
      
      // check signature
      const senderAddress = EthCrypto.recover(
          decryptedPayload.signature,
          EthCrypto.hash.keccak256(decryptedPayload.message)
      );
      
      console.log(
          'Got message from ' +
          senderAddress +
          ': ' +
          decryptedPayload.message
      );
      // > 'Got message from 0x19C24B2d99FB91C5...: "My name is Satoshi Buterin" Buterin'
  }
  const metamaskSign = ()=>{
    
  const msgParams = JSON.stringify({
    domain: {
      // Defining the chain aka Rinkeby testnet or Ethereum Main Net
      chainId: 4,
      // Give a user friendly name to the specific contract you are signing for.
      name: 'Ether Mail',
      // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      // Just let's you know the latest version. Definitely make sure the field name is correct.
      version: '1',
    },

    // Defining the message signing data content.
    message: {
      /*
       - Anything you want. Just a JSON Blob that encodes the data you want to send
       - No required fields
       - This is DApp Specific
       - Be as explicit as possible when building out the message schema.
      */
      contents: 'Hello, Bob!',
      attachedMoneyInEth: 4.2,
      from: {
        name: 'Cow',
        wallets: [
          '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
        ],
      },
      to: [
        {
          name: 'Bob',
          wallets: [
            '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
            '0xB0B0b0b0b0b0B000000000000000000000000000',
          ],
        },
      ],
    },
    // Refers to the keys of the *types* object below.
    primaryType: 'Mail',
    types: {
      // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      // Not an EIP712Domain definition
      Group: [
        { name: 'name', type: 'string' },
        { name: 'members', type: 'Person[]' },
      ],
      // Refer to PrimaryType
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person[]' },
        { name: 'contents', type: 'string' },
      ],
      // Not an EIP712Domain definition
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallets', type: 'address[]' },
      ],
    },
  });



  library.currentProvider.sendAsync(
    {
      method: 'eth_signTypedData_v4',
      params:[account, msgParams],
      from:account,
    },
    function (err, result) {
      if (err) return console.dir(err);
      if (result.error) {
        alert(result.error.message);
      }
      if (result.error) return console.error('ERROR', result);
      console.log('TYPED SIGNED:' + JSON.stringify(result.result));
      
      const recovered = recoverTypedSignature_v4({
        data: JSON.parse(msgParams),
        sig: result.result,
      });

      console.log(result)
      console.log(recovered)

      // if (
      //   ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(account)
      // ) {
      //   alert('Successfully recovered signer as ' + account);
      // } else {
      //   alert(
      //     'Failed to verify signer when comparing ' + result + ' to ' + account
      //   );
      // }
    }

  );
  }
  const [randData,setRandData] = useState()
  const encryptFunc = async (publicEncryptionKey)=>{
    //encrypting
    //requesting for public key
    // const publicEncryptionKey = await window.ethereum.request({
    //   method: 'eth_getEncryptionPublicKey',
    //   params: [account],
    // });
    

    // console.log("public key",publicEncryptionKey)
    // console.log("public key hex",library.utils.toHex(publicEncryptionKey))


    const encryptedMsgPlain = encrypt( publicEncryptionKey, 
      { data: msg },'x25519-xsalsa20-poly1305')
    const encryptedMsgHex = library.utils.toHex(encryptedMsgPlain)
    // console.log("plain",encryptedMsgPlain)
    console.log("hex",encryptedMsgHex)
    setRandData(encryptedMsgHex)
  }
  const decryptFunc = async (address)=>{
    //decrypting
    const decryptedMsg = await window.ethereum.request({
      method: 'eth_decrypt',
      params: [randData, address],
    });
    console.log(decryptedMsg)
  }
  const account1 = {
    address:"0x8C97769D2Fc3e18967375B9E6e4214f1A393A862",
    publicKey:"d285S/dDcERpyOXTiI4ydWrDC+K2uo54iPXDF5HRj1A="
  }
  const account2 = {
    address:"0x80197C1b1d7521919768cc518983640E5Ec4e2ad",
    publicKey:"T6nrDjIaSsthHlAIK1iVRtspsHQW1qVxZSAQgW81NwQ="
  }
  const [msg,setMsg] = useState("")
  return (
    <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{overflow:'auto'}}>
      <div>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" />
        <button onClick={sendFile}>send</button>
        {hash && <div>{hash}</div>}
      </div>
      <div>
        <button onClick={signTransferPermit}>sign</button>
      </div>
      <div>
        {metadata.interaction.read.map((item, index) => {
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
              <button onClick={() => call(item)}>call</button>
            </div>
          );
        })}
      </div>
      <div>
        {metadata.interaction.write.map((item, index) => {
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
      
      <button onClick={()=>setView(!view)}>view profile</button>
      <button onClick={send}>send</button>
      <div><input type="text" onChange={(e)=>setMsg(e.target.value)} /></div>
      <div>
        <button onClick={()=>encryptFunc(account2.publicKey)}>send enctypted message to user2 from user1</button>
        <button onClick={()=>decryptFunc(account1.address)}>decrypt User2 message</button>
      </div>
      <div>
        <button onClick={()=>encryptFunc(account1.publicKey)}>send enctypted message to user1 from user2</button>
        <button onClick={()=>decryptFunc(account2.address)}>decrypt User1 message</button>
      </div>
    </div>
  );
};

export default Dev;