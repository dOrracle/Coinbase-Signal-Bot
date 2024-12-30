import React, { useEffect } from 'react';

// Define the props type for the Dashboard component
interface DashboardProps {
  tradeInfo: any; // Replace 'any' with a more specific type if known
  setTradeInfo: React.Dispatch<React.SetStateAction<any>>; // Replace 'any' with a more specific type if known
}

const Dashboard: React.FC<DashboardProps> = ({ tradeInfo, setTradeInfo }) => {
  // Logic to handle trade confirmation and pass data to components
  const handleTradeConfirmation = (info: any) => { // Replace 'any' with a more specific type if known
    // Process the trade confirmation info
    console.log('Trade confirmed:', info);
    // Update state or perform actions based on trade confirmation
  };

  useEffect(() => {
    if (tradeInfo) {
      handleTradeConfirmation(tradeInfo);
    }
  }, [tradeInfo]);

  return (
    <div>
      <h2>Dashboard</h2>
      {tradeInfo ? (
        <div>
          <h3>Trade Confirmation</h3>
          <p>{JSON.stringify(tradeInfo)}</p>
        </div>
      ) : (
        <p>No trade confirmation yet.</p>
      )}
    </div>
  );
}

export default Dashboard;
