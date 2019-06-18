import React from 'react';
import './AddPaymentMethod.css';
import plus from '../../../assets/img/plus.png';

const AddPaymentMethod = props => {
  return (
    <div className="add-payment-method" onClick={props.addPaymentHandler}>
      {props.isAdd ? (
        <img src={plus} alt="add payment  " />
      ) : (
        <i className="icon-three-dots" />
      )}
      <div className="add-payment-title">
        {props.title || 'ADD PAYMENT METHOD'}
      </div>
    </div>
  );
};
export default AddPaymentMethod;
