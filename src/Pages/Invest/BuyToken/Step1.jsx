import { useState } from "react";
import Web3 from "web3";

import Input from "../../../Components/styled/input";
import Button from "../../../Components/styled/Button";

const Step1 = ({ setSteps, referral, setReferral }) => {
  const [noReferral, setNoReferral] = useState(false);

  const submit = () => {
    try {
      if (window.atob(referral)) {
        console.log(window.atob(referral));
        setReferral(window.atob(referral));
        setSteps("step2");
      } else {
        setNoReferral(true);
      }
    } catch (err) {
      setNoReferral(true);
      console.log(err);
    }
  };
  return (
    <div className="p-3">
      <div>
        <div>
          Buying Lott token in this phase just possible with referral code,
          please enter referral code from trusted referral.
        </div>
      </div>
      <div className="px-4 mt-5">
        <Input
          type="text"
          name="referral code"
          title={"referral code"}
          style={{ width: "100%" }}
          value={referral}
          onChange={(e) => setReferral(e.target.value)}
        />
      </div>
      <div className="w-100 px-4 mt-4">
        <Button className="w-100 m-0" onClick={submit} primary>
          Submit
        </Button>
      </div>
      {noReferral ? (
        <div className="text-danger px-4 mt-3">
          You don't have any referrals
        </div>
      ) : null}
    </div>
  );
};

export default Step1;
