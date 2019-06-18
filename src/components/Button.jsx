import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Button = ({ text, className, type, onClick }) => (
  <Fragment>
    <button type={type} onClick={onClick} className={`btn ${className}`}>
      <span className="btn-content">{text}</span>
    </button>
  </Fragment>
);

Button.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  text: null,
  type: '',
  className: null,
  onClick: null,
};

export default Button;
