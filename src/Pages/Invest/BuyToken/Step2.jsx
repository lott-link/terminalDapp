import { useState, useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";

import Input from "../../../Components/styled/input";
import Button from "../../../Components/styled/Button";
import { context } from "../../../App";
import { buyTokenABI } from "./buyTokenAbi";
import { tokenABI } from "./tokenAbi";

const Step2 = ({
  setSteps,
  selectedToken,
  setSelectedToken,
  amount,
  setAmount,
  receiveAmount,
  setReceiveAmount,
  balance,
  setBalance,
}) => {
  const { active, account, library: web3 } = useWeb3React();

  const data = useContext(context);

  const [tokensList, setTokensList] = useState([]);

  const debouncedValue = useDebounce(amount, 300);

  const approve = async () => {
    if (!active) return;
    const tokenContract = new web3.eth.Contract(
      tokenABI,
      selectedToken.address
    );
    tokenContract.methods
      .approve(selectedToken.address, amount)
      .send({ from: account })
      .then((res) => {
        setSteps("step3");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAmount = async (value) => {
    if (selectedToken.address === "") return;
    const contract = new web3.eth.Contract(
      buyTokenABI,
      data.addresses[data.network]["lottMatic"]
    );
    const amount = await contract.methods
      .amountLott(selectedToken.address, value)
      .call();
    setReceiveAmount(amount);
    console.log(amount);
  };

  useEffect(() => {
    console.log({ debouncedValue });
    getAmount(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    if (selectedToken.address === "") return;
    (async () => {
      const tokenContract = new web3.eth.Contract(
        tokenABI,
        selectedToken.address
      );
      const balanceOf = await tokenContract.methods.balanceOf(account).call();
      setBalance(balanceOf);
    })();
  }, [selectedToken]);

  useEffect(() => {
    (async () => {
      if (!active) return;
      const contract = new web3.eth.Contract(
        buyTokenABI,
        data.addresses[data.network]["lottMatic"]
      );
      const list = await contract.methods.tokensIn().call();
      console.log(list);
      const tokenContracts = [];
      list.forEach(async (item) => {
        const tokenContract = new web3.eth.Contract(tokenABI, item);
        const tokenName = await tokenContract.methods.name().call();
        tokenContracts.push({ name: tokenName, address: item });
        setTokensList((prev) => [...prev, { name: tokenName, address: item }]);
        console.log(tokenContracts);
      });
      console.log(tokenContracts);
    })();
  }, []);
  return (
    <div className="p-3">
      <div className="w-100 px-4 mt-5">
        <select
          name=""
          id=""
          className="w-100 text-center py-1 position-relative"
          style={{
            background: "#020227",
            color: "white",
            border: "7px double white",
          }}
          onChange={(e) => setSelectedToken(JSON.parse(e.target.value))}
        >
          <option value="">select</option>
          {tokensList.map((item) => (
            <option key={item.address} value={JSON.stringify(item)}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="px-4 mt-1">
        <Input
          type="text"
          name="You Send"
          title={"You Send"}
          style={{ width: "100%" }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div
        className="px-4 d-flex justify-content-end"
        style={{ transform: "translateY(-8px)" }}
      >
        <div>Your balance:{balance}</div>
      </div>
      <div className="px-4 mt-1">
        <div
          className="text-center"
          style={{ width: "100%", border: "7px double white" }}
        >
          {receiveAmount}
        </div>
      </div>
      <div className="w-100 px-4 mt-4">
        <Button className="w-100 m-0" onClick={approve} primary>
          Approve
        </Button>
      </div>
    </div>
  );
};

export default Step2;

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timeoutId);
  }, [value]);

  return debouncedValue;
};
