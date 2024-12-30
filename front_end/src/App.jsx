import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import Dashboard from './components/Dashboard';
import WebSocketManager from './services/WebSocketManager';
import { theme } from './theme';
import './App.css';

function App() {
  const [botState, setBotState] = useState({
    isTrading: false,
    error: null,
    balances: {},
    currentPair: '',
    trades: [],
    tradeInfo: null
  });

  useEffect(() => {
    const ws = new WebSocketManager();
    ws.connect();
    ws.onMessage(handleWebSocketData);
    return () => ws.disconnect();
  }, []);

  const handleWebSocketData = (data) => {
    switch (data.type) {
      case 'TRADE_CONFIRMATION':
        setBotState(prev => ({
          ...prev,
          tradeInfo: data.payload,
          trades: [data.payload, ...prev.trades]
        }));
        break;
      case 'BOT_STATUS':
        setBotState(prev => ({
          ...prev,
          isTrading: data.payload.isActive,
          currentPair: data.payload.tradingPair
        }));
        break;
      case 'ERROR':
        setBotState(prev => ({...prev, error: data.payload}));
        break;
      default:
        console.log('Unhandled message type:', data.type);
    }
  };

  const handleBotControl = async (action) => {
    try {
      const response = await fetch(`/api/bot/${action}`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to control bot');
      
      const data = await response.json();
      setBotState(prev => ({
        ...prev,
        isTrading: data.isActive
      }));
    } catch (error) {
      setBotState(prev => ({
        ...prev,
        error: error.message
      }));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        <Dashboard 
          botState={botState}
          setTradeInfo={(info) => setBotState(prev => ({...prev, tradeInfo: info}))}
          onBotControl={handleBotControl}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
