import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockDetails, setBlockDetails] = useState(null);

  useEffect(() => {
    async function getBlockDetails() {
      try {
        const latestBlockNumber = await alchemy.core.getBlockNumber();
        setBlockNumber(latestBlockNumber);

        const block = await alchemy.core.getBlockWithTransactions(latestBlockNumber);
        setBlockDetails(block);
      } catch (error) {
        console.error("Error fetching block details:", error);
      }
    }

    getBlockDetails();
  }, []);

  const handleTransactionClick = async (transactionHash) => {
    try {
      const transactionReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
      alert(JSON.stringify(transactionReceipt, null, 2));
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  return (
    <div className="App">
      <h1>Block Explorer</h1>
      <div>Block Number: {blockNumber}</div>
      {blockDetails && (
        <div>
          <h2>Block Details</h2>
          <pre>{JSON.stringify(blockDetails, null, 2)}</pre>
          <h3>Transactions</h3>
          <ul>
            {blockDetails.transactions.map(tx => (
              <li key={tx.hash} onClick={() => handleTransactionClick(tx.hash)}>
                {tx.hash}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
