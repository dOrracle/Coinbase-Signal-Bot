import PropTypes from 'prop-types';

export function BotToggle({ isOn, onToggle }) {
    return (
        <button onClick={onToggle}>
            {isOn ? 'Turn Off' : 'Turn On'}
        </button>
    );
}

// PropTypes for validation
BotToggle.propTypes = {
    isOn: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};