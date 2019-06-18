import React from 'react';
import './ModalContent.css';
import PropTypes from 'prop-types';

const ModalContent = ({
  cancelHandler,
  doneHandler,
  modalClass,
  modalTitle,
}) => {
  return (
    <div className={`favorite-tours-modal ${modalClass ? modalClass : ''}`}>
      <div className="favorite-tours-title">{modalTitle}</div>
      <div className="favorite-tours-bottom">
        <div className="cancel-btn" onClick={cancelHandler}>
          Cancel
        </div>
        <div className="success-btn" onClick={doneHandler}>
          Done
        </div>
      </div>
    </div>
  );
};

ModalContent.propTypes = {
  cancelHandler: PropTypes.func.isRequired,
  doneHandler: PropTypes.func.isRequired,
};
export default ModalContent;
