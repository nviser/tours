import React from 'react';
import PropTypes from 'prop-types';
import './inputErrors.css';

const InputErrors = props => (
  <div className="input-errors">
    {props.errors &&
      props.errors.length > 0 &&
      props.errors.map((error, index) => (
        <div className="input-error" key={index}>
          {error.message || error.msg}
        </div>
      ))}
  </div>
);

InputErrors.defaultProps = {
  errors: [],
};

InputErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
};
export default InputErrors;
