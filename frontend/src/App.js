import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const contractAddress = "0x1Af35f6180B7e3680595C3C33cB7e741f04B0D72";

function App() {

  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  const [isMinting, setIsMinting] = useState(false);


  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    const initNFTContract = () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress, contractABI.abi, signer));
    }
    initNFTContract();
  }, [account]);


  const connectWallet = async () => {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setAccount(accounts[0]);
      })
      .catch((error) => {
        alert("Something went wrong");
      });
  }


  const data = [
    {
      image: "https://www.liveabout.com/thmb/rkFZRh7wSN8BjubVvIkrdsh2tGo=/1367x875/filters:no_upscale():max_bytes(150000):strip_icc()/powerpuff_girls-56a00bc45f9b58eba4aea61d.jpg",
      url: "https://gateway.pinata.cloud/ipfs/QmQFHVc59KuDpEQXs65cea4HQeHd19kozkFeJN692hA4mD/1",
    },
    {
      image: "https://www.liveabout.com/thmb/b_XjAEyjRIBb-loREyq24Dmg4Sg=/1000x1000/filters:no_upscale():max_bytes(150000):strip_icc()/bart-simpson-58fe1f773df78ca159b60cc2.jpg",
      url: 'https://gateway.pinata.cloud/ipfs/QmQFHVc59KuDpEQXs65cea4HQeHd19kozkFeJN692hA4mD/2'
    }
  ];

  const withdrawMoney = async () => {
    try {

      const response = await NFTContract.withdrawMoney();
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }

  }

  const handleMint = async (tokenURI) => {
    setIsMinting(true);
    try {
      const options = { value: ethers.utils.parseEther("0.01") };
      const response = await NFTContract.mintNFT(tokenURI, options);
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }
    finally {
      setIsMinting(false);
    }
  }

  if (account === null) {
    return (
      <>
        <div className="container">
          <br />
          <h1>  minting on ethereum</h1>
          <h2>NFT Marketplace</h2>
          <p>Buy an NFT from our marketplace.</p>

          {isWalletInstalled ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <p>Install Metamask wallet</p>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container">
        <br />
        <h1>Minting on ethereum</h1>

        <h2>NFT Marketplace</h2>
        {data?.map((item, index) => (
          <div className="imgDiv">
            <img
              src={item?.image}
              key={index}
              alt="images"
              width={250}
              height={250}
            />
            <button isLoading={isMinting}
              onClick={() => {
                handleMint(item?.url);
              }}
            >
              Mint - 0.01 eth
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            withdrawMoney();
          }}
        >
          Withdraw Money from Contract
        </button>
      </div>
    </>
  );
}

export default App;