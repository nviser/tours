import React from 'react';
import './TourOperatorRegisterSuccess.css';
import successImg from '../../../../assets/img/success.png';

const TourOperatorRegisterSuccess = ({ continueHandler }) => {
  return (
    <div className="tour-operator-register-success-block">
      <div className="tour-operator-img">
        <img src={successImg} alt="success" />
      </div>

      <h3 className="tour-operator-title">
        Your have been register as Tour Operator
      </h3>
      <div className="tour-operator-btn--container-center">
        <button
          onClick={continueHandler}
          className="tour-operator-btn--continue button-main"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};
export default TourOperatorRegisterSuccess;
