import { useState, useContext } from "react";
import { useWeb3React } from "@web3-react/core";

import Button from "../../../Components/styled/Button";
import { buyTokenABI } from "./buyTokenAbi";
import { context } from "../../../App";

const Step3 = ({
  setSteps,
  selectedToken,
  amount,
  balance,
  receiveAmount,
  referral,
}) => {
  const data = useContext(context);

  const { active, account, library: web3 } = useWeb3React();

  const swap = () => {
    if (!active) return;
    const contract = new web3.eth.Contract(
      buyTokenABI,
      data.addresses[data.network]["lottIo"]
    );

    console.log(
      { tokenAddress: selectedToken.address },
      { amount: web3.utils.toWei(amount) },
      { referral }
    );

    contract.methods
      .swap(selectedToken.address, web3.utils.toWei(amount), referral)
      .send({ from: account })
      .then((res) => {
        console.log(res);
        setSteps("step4");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="p-3">
      <div className="w-100 px-4 mt-5">
        <div>Selected Token is : {selectedToken.address}</div>
      </div>
      <div className="px-4">
        <div>You Send:</div>
        <div
          className="text-center"
          style={{ width: "100%", border: "7px double white" }}
        >
          <div>{amount}</div>
        </div>
      </div>
      <div className="px-4 d-flex justify-content-end">
        <div>Your balance:{balance && web3.utils.fromWei(balance)}</div>
      </div>
      <div className="px-4">
        <div>You Receive:</div>
        <div className="">
          <div
            className="text-center"
            style={{ width: "100%", border: "7px double white" }}
          >
            {receiveAmount && web3.utils.fromWei(receiveAmount)}
          </div>
        </div>
      </div>
      <div className="w-100 px-4 mt-4">
        <Button className="w-100 m-0" primary onClick={swap}>
          Swap
        </Button>
      </div>
    </div>
  );
};

export default Step3;
