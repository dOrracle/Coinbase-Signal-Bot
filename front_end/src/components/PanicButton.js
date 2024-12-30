import PropTypes from 'prop-types';

export function PanicButton({ onPanic }) {
    return (
        <button onClick={onPanic}>Panic!</button>
    );
}

// PropTypes for validation
PanicButton.propTypes = {
    onPanic: PropTypes.func.isRequired,
};