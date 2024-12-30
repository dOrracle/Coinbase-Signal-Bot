import PropTypes from 'prop-types';

export function LastSignal({ signal }) {
    return (
        <div>
            <p>Last Signal: {JSON.stringify(signal)}</p>
        </div>
    );
}

// PropTypes for validation
LastSignal.propTypes = {
    signal: PropTypes.object.isRequired,
};