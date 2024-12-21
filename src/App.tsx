import { useSDK } from "@metamask/sdk-react";
import React, { useState } from "react";
import "./App.css";

function App() {
  const { sdk, connected, connecting, provider, chainId, account, balance } =
    useSDK();

  const languages = sdk?.availableLanguages ?? ["en"];

  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [response, setResponse] = useState<unknown>("");

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrentLanguage(event.target.value);
  };

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  console.log("chainId", chainId);

  const connectAndSign = async () => {
    try {
      const signResult = await sdk?.connectAndSign({
        msg: "Connect + Sign message",
      });
      setResponse(signResult);
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  const terminate = () => {
    sdk?.terminate();
  };

  const selectedAddress = () => {
    const selectedAddress = provider?.getSelectedAddress();
    console.log("selectedAddress:", selectedAddress);
  };

  const transferEth = async () => {
    const selectedAddress = provider?.getSelectedAddress();
    const to = "0x0F887d3D24222409Ce54499d07AF594380B84D8F";

    const transactionParameters = {
      to, // Required except during contract publications.
      from: selectedAddress, // must match user's active address.
      value: "0x5AF3107A4000", // Only required to send ether to the recipient from the initiating external account.
    };

    try {
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = (await provider?.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      })) as string;

      setResponse(txHash);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <div className={"Info-Status"}>
        <p>{`Connected account: ${account}`}</p>
        <p>{`Connected: ${connected}`}</p>
      </div>

      <div className="language-dropdown">
        <label htmlFor="language-select">Language: </label>
        <select
          id="language-select"
          value={currentLanguage}
          onChange={handleLanguageChange}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button
          className={"Button-Normal"}
          style={{ padding: 10, margin: 10 }}
          onClick={connect}
        >
          Connect
        </button>

        <button
          className={"Button-Normal"}
          style={{ padding: 10, margin: 10 }}
          onClick={connectAndSign}
        >
          Connect w/ Sign
        </button>

        <button
          className={"Button-Danger"}
          style={{ padding: 10, margin: 10 }}
          onClick={terminate}
        >
          Terminate
        </button>

        <button
          className={"Button-Danger"}
          style={{ padding: 10, margin: 10 }}
          onClick={selectedAddress}
        >
          SelectedAddress
        </button>

        <button
          className={"Button-Danger"}
          style={{ padding: 10, margin: 10 }}
          onClick={transferEth}
        >
          Transfer
        </button>
      </div>
    </div>
  );
}

export default App;
