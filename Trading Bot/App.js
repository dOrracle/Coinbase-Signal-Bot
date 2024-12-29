import React, { useState, useEffect } from 'react';
import { ThemeProvider, defaultTheme, Box, Heading, Toggle, Text, TextField, Select, Button, Alert, AlertIcon, AlertTitle, AlertDescription, Spinner, Table, Thead, Tr, Th, Tbody, Td, Divider } from '@coinbase/onchainkit';
import { BalanceDisplay } from './components/BalanceDisplay';
import { LastSignal } from './components/LastSignal';
import { OrderHistory } from './components/OrderHistory';
import { Settings } from './components/Settings';
import { BotToggle } from './components/BotToggle';
import { PanicButton } from './components/PanicButton';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleBot = async () => {
    try {
      const response = await fetch('/api/toggle', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setData({ ...data, bot_on: !data.bot_on });
      // You may want to update other parts of the state based on the response
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePanic = async () => {
    try {
        const response = await fetch('/api/panic', { method: 'POST' });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to initiate panic stop.');
        }
        // Assuming the backend sends the updated bot status
        const responseData = await response.json();
        setData(prevData => ({
            ...prevData,
            bot_on: responseData.status && responseData.status.includes('ON') ? true : false
        }));
    } catch (error) {
        setError(error.message);
    }
};

  const handleSaveSettings = async (newSettings) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setData(prevData => ({ ...prevData, settings: { ...prevData.settings, ...newSettings } }));
      console.log(responseData.message);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Error!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
      <ThemeProvider theme={defaultTheme}>
          <Box padding="4">
              <Heading as="h1" size="lg">Trading Bot Dashboard</Heading>

              <Toggle isChecked={data.bot_on} onChange={handleToggleBot}>
                  Bot Status: {data.bot_on ? 'ON' : 'OFF'}
              </Toggle>

              <PanicButton onPanic={handlePanic} />

              <BalanceDisplay balances={data.balances} activeTradingPair={data.active_trading_pair} />

              <LastSignal signal={data.last_signal} />

              <OrderHistory orderHistory={data.order_history} />

              <Settings settings={data.settings} onSave={handleSaveSettings} />

          </Box>
      </ThemeProvider>
  );
}

export default App;