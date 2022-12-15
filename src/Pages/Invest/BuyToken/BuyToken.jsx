import { useState, useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

import styles from "../../CrossChainNFT/SelectNFT.module.css";

import useWidth from "../../../Hooks/useWidth";

const BuyToken = () => {
  const width = useWidth();

  const [steps, setSteps] = useState("step1");

  const [selectedToken, setSelectedToken] = useState({ address: "", name: "" });

  const [amount, setAmount] = useState("");

  const [receiveAmount, setReceiveAmount] = useState(0);

  const [balance, setBalance] = useState(0);

  const [referral, setReferral] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    const referralCode = urlParams.get("ref");
    console.log({ referralCode });
    if (referralCode) {
      try {
        setReferral(window.atob(referralCode));
      } catch (err) {
        console.log(err);
      }
      setSteps("step2");
    }
  }, []);

  return (
    <div
      className={`${width < 992 ? "w-100" : "w-50"} h-100 p-2 mx-auto ${
        styles["animation-in"]
      }`}
      style={{
        borderRight: "1px solid white",
        borderLeft: "1px solid white",
        position: "relative",
      }}
    >
      <div
        className="w-100 h-100 d-flex flex-column"
        style={{ border: "1px solid white" }}
      >
        <div
          className="text-center py-4"
          style={{ borderBottom: "1px solid white", fontSize: "22px" }}
        >
          Buy Lott Token
        </div>
        <div
          className="d-flex flex-column"
          style={{ position: "relative", flexGrow: "1" }}
        >
          <div className="py-4">
            <div>
              {steps === "step1" ? (
                <Step1
                  setSteps={setSteps}
                  referral={referral}
                  setReferral={setReferral}
                />
              ) : null}
              {steps === "step2" ? (
                <Step2
                  setSteps={setSteps}
                  selectedToken={selectedToken}
                  setSelectedToken={setSelectedToken}
                  amount={amount}
                  setAmount={setAmount}
                  receiveAmount={receiveAmount}
                  setReceiveAmount={setReceiveAmount}
                  balance={balance}
                  setBalance={setBalance}
                />
              ) : null}
              {steps === "step3" ? (
                <Step3
                  setSteps={setSteps}
                  selectedToken={selectedToken}
                  amount={amount}
                  receiveAmount={receiveAmount}
                  balance={balance}
                  referral={referral}
                />
              ) : null}
              {steps === "step4" ? <Step4 setSteps={setSteps} /> : null}
            </div>
          </div>
          {/* <div
            className="px-4 text-center mb-4 d-flex align-items-end"
            style={{ color: "#FF00FF", flexGrow: "1" }}
          >
            info text goes here
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BuyToken;
