import { useSDK } from "@metamask/sdk-react";
import React, { useState } from "react";
import "./App.css";

function App() {
  const { sdk, connected, connecting, provider, chainId, account, balance } =
    useSDK();

  const languages = sdk?.availableLanguages ?? ["en"];

  const [currentLanguage, setCurrentLanguage] = useState("en");

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

  const [response, setResponse] = useState<unknown>("");
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
      </div>
    </div>
  );
}

export default App;
