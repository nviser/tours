import React from 'react';
import './BottomNavigationPanel.css';

const BottomNavigationPanel = ({
  backHandler,
  path,
  nextHandler,
  btnName,
  disabled,
  infoString,
  btnCancelTitle,
}) => (
  <div className="stop-bottom">
    {infoString && <span className="info-string">{infoString}</span>}
    <div className="cancel-btn" onClick={() => backHandler(path)}>
      {btnCancelTitle || 'Cancel'}
    </div>
    <button className="success-btn" onClick={nextHandler} disabled={disabled}>
      {btnName}
    </button>
  </div>
);
export default BottomNavigationPanel;
