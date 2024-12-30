// src/components/BotControls/index.jsx
import { Box, Paper, Typography } from '@mui/material';
import { BotToggle } from './BotToggle';
import { EmergencyStop } from './EmergencyStop';

export function BotControls({ status, onToggle, onEmergencyStop }) {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Bot Controls
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <BotToggle 
          isActive={status.isTrading}
          onToggle={onToggle}
          isLoading={status.isLoading} 
        />
        
        <EmergencyStop 
          onStop={onEmergencyStop}
          disabled={!status.isTrading || status.isLoading}
        />

        <Typography 
          color={status.error ? 'error' : 'textSecondary'}
          sx={{ ml: 2 }}
        >
          {status.error || (status.isTrading ? 'Bot is running' : 'Bot is stopped')}
        </Typography>
      </Box>
    </Paper>
  );
}

BotControls.propTypes = {
  status: PropTypes.shape({
    isTrading: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onEmergencyStop: PropTypes.func.isRequired
};