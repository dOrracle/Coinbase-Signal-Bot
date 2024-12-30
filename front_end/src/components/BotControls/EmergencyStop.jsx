// src/components/BotControls/EmergencyStop.jsx
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export function EmergencyStop({ onStop, disabled }) {
  return (
    <Button
      variant="contained"
      color="error"
      startIcon={<ErrorIcon />}
      onClick={onStop}
      disabled={disabled}
      sx={{ 
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: 'error.dark'
        }
      }}
    >
      Emergency Stop
    </Button>
  );
}

EmergencyStop.propTypes = {
  onStop: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

EmergencyStop.defaultProps = {
  disabled: false
};