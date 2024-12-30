import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import TradeHistory from './TradeHistory';
import BotControls from './BotControls';
import BalanceDisplay from './BalanceDisplay';
import ErrorAlert from './ErrorAlert';

// Define the props type for the Dashboard component
interface DashboardProps {
  tradeInfo: any; // Replace 'any' with a more specific type if known
  setTradeInfo: React.Dispatch<React.SetStateAction<any>>; // Replace 'any' with a more specific type if known
  botState: any; // Replace 'any' with a more specific type if known
  onBotControl: (control: any) => void; // Replace 'any' with a more specific type if known
}

const Dashboard: React.FC<DashboardProps> = ({ tradeInfo, setTradeInfo, botState, onBotControl }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');

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
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {botState.error && (
        <ErrorAlert 
          error={botState.error} 
          onClose={() => setBotState(prev => ({ ...prev, error: null }))}
        />
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <BotControls 
              isTrading={botState.isTrading}
              onControl={onBotControl}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <BalanceDisplay 
              balances={botState.balances}
              currentPair={botState.currentPair}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <TradeHistory 
              trades={botState.trades}
              timeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
