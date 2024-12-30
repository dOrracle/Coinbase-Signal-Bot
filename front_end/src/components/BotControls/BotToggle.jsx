import PropTypes from 'prop-types';
import { Button } from '@mui/material';

export function BotToggle({ isActive, onToggle, isLoading }) {
  return (
    <Button 
      variant="contained"
      color={isActive ? "error" : "success"}
      onClick={onToggle}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : isActive ? 'Stop Bot' : 'Start Bot'}
    </Button>
  );
}

BotToggle.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

BotToggle.defaultProps = {
  isLoading: false
};