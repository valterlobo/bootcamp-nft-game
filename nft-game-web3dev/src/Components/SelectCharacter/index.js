import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import LoadingIndicator from "../LoadingIndicator";



/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [mintingCharacter, setMintingCharacter] = useState(false);
  // UseEffect
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      /*
       * This is the big difference. Set our gameContract in state.
       */
      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);


  //
  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Trazendo personagens do contrato para mintar");

        
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log("charactersTxn:", charactersTxn);

        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        const characterNFT = await gameContract.checkIfUserHasNFT();
        if (characterNFT.name) {
          console.log("User has character NFT");
          setCharacterNFT(transformCharacterData(characterNFT));
        }else {
          setCharacters(characters);
        }   

       
      } catch (error) {
        console.error("Algo deu errado ao trazer personagens:", error);
      }
    };

    /*
     * Adiciona um método callback que vai disparar quando o evento for recebido
     */
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      /*
       * Uma vez que nosso personagem for mintado, podemos buscar os metadados a partir do nosso contrato e configurar no estado para se mover para a Arena.
       */
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("CharacterNFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };

    if (gameContract) {
      getCharacters();

      /*
       * Configurar NFT Minted Listener
       */
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      /*
       * Quando seu componente se desmonta, vamos limpar esse listener
       */
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [gameContract]);
  //

  // Render Methods
  const renderCharacters = () =>
    characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img
          src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`}
          alt={character.name} />
        <button
          type="button"
          className="character-mint-button"
          onClick={() => mintCharacterNFTAction(index)}
        >{`Mintar ${character.name}`}</button>
      </div>
    ));


  // Actions
  const mintCharacterNFTAction = async (characterId) => {
    try {
      if (gameContract) {
        setMintingCharacter(true);
        console.log('Minting character in progress...');
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn); //mintTxn
        setMintingCharacter(false);
      }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
    }
    setMintingCharacter(false);
  };

  return (
    <div className="select-character-container">
      <h2>Escolha o seu personagen para a  batalha 👨⚔️🧑</h2>
      {/* Only show this when there are characters in state */}
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
      {}
      {mintingCharacter && (
      <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Mintando personagem...</p>
        </div>
        <img
          src="http://pa1.narvii.com/6623/1d810c548fc9695d096d54372b625d207373130a_00.gif"
          alt="Indicador de Mintagem"
        />
      </div>
    )}
    </div>
  );
};

export default SelectCharacter;