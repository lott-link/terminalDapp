import { useState, useContext } from "react";
import { useWeb3React } from "@web3-react/core";

import Button from "../../../Components/styled/Button";
import Input from "../../../Components/styled/input";
import styles from "../../CrossChainNFT/SelectNFT.module.css";
import useWidth from "../../../Hooks/useWidth";
import { context } from "../../../App";
import { referralABI } from "./referralAbi";

const Referral = () => {
  const width = useWidth();

  const { active, account, library: web3 } = useWeb3React();

  const [referralInput, setReferralInput] = useState("");
  const [referralResult, setReferralResult] = useState({
    referralCode: "",
    referralLink: "",
  });
  const [noReferral, setNoReferral] = useState(false)

  const data = useContext(context);

  const getReferralCode = async () => {
    if (!active) return;

    const contract = new web3.eth.Contract(
      referralABI,
      data.addresses[data.network]["lottWhiteList"]
    );
    const result = await contract.methods.referrals(referralInput).call();

    if (
      result ===
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      setNoReferral(true)
      console.log("there is no referral");
    } else {
      setReferralResult({
        referralCode: window.btoa(result),
        referralLink: `https://dapp.lott.link/invest/buy_token?ref=${window.btoa(
          result
        )}`,
      });
    }
    console.log(result);
  };

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
          Get Referral Code
        </div>{" "}
        <div
          className="d-flex flex-column p-3"
          style={{ position: "relative", flexGrow: "1" }}
        >
          <div>You must have 10000 Lott Token to be a referrer</div>
          <div className="py-4">
            <div className=" ">
              <Input
                type="text"
                name="referral code"
                title={"referral code"}
                style={{ width: "100%" }}
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
              />
            </div>
            <div className="w-100  mt-4">
              <Button className="w-100 m-0" onClick={getReferralCode} primary>
                Get Referral Code
              </Button>
            </div>
            <div className="w-100  mt-4">
              {referralResult.referralCode !== "" ? (
                <div>your referal code is: {referralResult.referralCode}</div>
              ) : null}
              {referralResult.referralLink !== "" ? (
                <div>
                  your referal link is:
                  <a href={referralResult.referralLink}>
                    {referralResult.referralLink}
                  </a>
                </div>
              ) : null}
            {noReferral ? <div className="text-danger">You don't have any referrals</div> : null}
            </div>
          </div>
          <div
            className="px-4 text-center mb-4 d-flex align-items-end"
            style={{ color: "#FF00FF", flexGrow: "1" }}
          >
            info text goes here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
