import React from 'react';
import './NotItems.css';
import PropTypes from 'prop-types';

const NotItems = ({ img, description, btnTitle, clickHandler, clName }) => (
  <div className="not-items">
    <div className={`${clName}-img not-items-img`}>
      <img src={img} alt="Item" />
    </div>
    <div className={`${clName}-description not-items-description`}>
      {description}
    </div>
    <div className="not-items-btn" onClick={clickHandler}>
      {btnTitle}
    </div>
  </div>
);

NotItems.propTypes = {
  img: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
  clName: PropTypes.string.isRequired,
};

export default NotItems;
