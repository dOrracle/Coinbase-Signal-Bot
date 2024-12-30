import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { BotControls } from './BotControls';
import { BalanceDisplay } from './BalanceDisplay';
import { ErrorAlert } from './ErrorAlert';
import { TradeHistory } from './TradeHistory';

interface TradeInfo {
  pair: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  timestamp: number;
  status: string;
}

interface BotState {
  isTrading: boolean;
  error: string | null;
  balances: Record<string, number>;
  currentPair: string;
  trades: TradeInfo[];
}

interface DashboardProps {
  tradeInfo: TradeInfo | null;
  setTradeInfo: (info: TradeInfo | null) => void;
  botState: BotState;
  onBotControl: (action: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  tradeInfo, 
  setTradeInfo, 
  botState, 
  onBotControl 
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');

  const handleTradeConfirmation = (info: TradeInfo) => {
    console.log('Trade confirmed:', info);
    // Add any additional trade processing logic here
    setTradeInfo(null); // Clear after processing
  };

  useEffect(() => {
    if (tradeInfo) {
      handleTradeConfirmation(tradeInfo);
    }
  }, [tradeInfo, setTradeInfo]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {botState.error && (
        <ErrorAlert 
          error={botState.error} 
          onClose={() => onBotControl('clearError')}
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
};

export default Dashboard;