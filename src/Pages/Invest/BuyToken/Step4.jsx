import Button from "../../../Components/styled/Button";

const Step4 = () => {
  const addToken = async () => {

    const tokenAddress = "0xc86CAA33EcaFDD65951F9F809CBaf3D67eeB64bd";
    const tokenSymbol = "Lott";
    const tokenDecimals = 18;
    // const tokenImage = "http://placekitten.com/200/300";

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            // image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="w-100 px-4 mt-4">
        <Button className="w-100 m-0" onClick={addToken} primary>
          Add token
        </Button>
      </div>
    </div>
  );
};

export default Step4;
