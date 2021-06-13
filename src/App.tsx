import "./App.css";
import { useState, useEffect } from "react";
import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";

function App() {
  const [deepLinkHref, setDeepLinkHref] = useState("");

  useEffect(() => {
    initTorus();
  }, []);

  const initTorus = async () => {
    const torus: Torus = new Torus({});
    try {
      // login
      await torus.init({});
      await torus.login({});
      const web3: Web3 = new Web3(torus.provider);
      // sign
      const signedMessage: string = await signMessage(web3);
      // update deep link
      const deepLinkHost: string =
        window.location.href.split("?")[1] || "web3Login";
      setDeepLinkHref(`unitydl://${deepLinkHost}?${signedMessage}`);
    } catch (err) {
      console.error(err);
      await torus.cleanUp();
      initTorus();
    }
  };

  const signMessage = async (web3: Web3): Promise<string> => {
    const from: string = (await web3.eth.getAccounts())[0];
    const expiration: number = Math.round(Date.now() / 1000 + 30);
    const message: string = `${from}-${expiration}`;
    const signature: string = await web3.eth.personal.sign(message, from, "");
    return `${signature}-${message}`;
  };

  return (
    <div className="App">
      {deepLinkHref === "" ? (
        <div></div>
      ) : (
        <a href={deepLinkHref}>
          <button className="App-button"> Continue to App </button>
        </a>
      )}
    </div>
  );
}

export default App;
