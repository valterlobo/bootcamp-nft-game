import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import SelectCharacter from "./Components/SelectCharacter";
import { CONTRACT_ADDRESS } from "./constants";
import myEpicGame from "./utils/MyEpicGame.json";
import { ethers } from "ethers";
import Arena from "./Components/Arena";
import LoadingIndicator from "./Components/LoadingIndicator";
// Constants
const TWITTER_HANDLE = "valterlobo1";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Só uma variável de estado que vamos usar para armazenar a carteira pública do usuário.
   */
  const [currentAccount, setCurrentAccount] = useState(null);
  /*
 * Logo abaixo da conta, configure essa propriedade de novo estado.
 */
  const [characterNFT, setCharacterNFT] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  /*
   * Já que esse método vai levar um tempo, lembre-se de declará-lo como async
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Eu acho que você não tem a metamask!");
        setIsLoading(false);
        return;
      } else {
        console.log("Nós temos o objeto ethereum", ethereum);

        /*
         * Checa se estamos autorizados a acessar a carteira do usuário.
         */
        const accounts = await ethereum.request({ method: "eth_accounts" });

        /*
         * Usuário pode ter múltiplas contas autorizadas, pegamos a primeira se estiver ali!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Carteira conectada::", account);
          setCurrentAccount(account);
        } else {
          console.log("Não encontramos uma carteira conectada");
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  /*
   * Implementa o seu método connectWallet aqui
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Instale a MetaMask!");
        return;
      }

      /*
       * Método chique para pedir acesso para a conta.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! Isso deve escrever o endereço público uma vez que autorizarmos Metamask.
       */
      console.log("Contectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // Métodos de renderização
  const renderContent = () => {
   
    if (isLoading) {
      return <LoadingIndicator />;
    }
    /*
     * cenário #1
     */
    if (!currentAccount) {
      console.log(characterNFT);
      return (
        <div className="connect-wallet-container">
          <img src="/banner-game.gif" alt="GAME STAR WAR" />
          {/*
         * Botão que vamos usar para disparar a conexão da carteira. Não esqueça de adicionar o evento onClick para chamar seu método!
         */}
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Conecte sua carteira para começar
          </button>
        </div>
      );
      /*
       * cenário #2
       */
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
  };

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "5") {
        alert("Please connect to Goerli!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
    checkNetwork();
  }, []);



  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ STAR WAR METAVERSO 🔫 ⚔️</p>
          <p className="sub-text">Que a Força esteja com você </p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`construído por @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
