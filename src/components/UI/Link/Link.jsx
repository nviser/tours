import React from 'react';
import './Link.css';
import PropTypes from 'prop-types';

const Link = ({ title, iconClass, handleClick }) => {
  return (
    <div className="print-history-link" onClick={() => handleClick()}>
      <i className={iconClass} aria-hidden="true" />
      <span>{title}</span>
    </div>
  );
};
export default Link;

Link.defaultProps = {
  icon: null,
};

Link.propTypes = {
  title: PropTypes.string.isRequired,
  iconClass: PropTypes.string,
};
