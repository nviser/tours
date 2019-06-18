import React, { Component } from 'react';
import './PaymentCardDelete.css';

class PaymentCardDelete extends Component {
  render() {
    return (
      <div className="tour-stop-delete">
        <h1 className="tour-stop-delete-title">ARE YOU SURE?</h1>
        <div className="tour-stop-delete-description">
          <span>
            This action can't be cancelled. Are you sure you want to continue?
          </span>
        </div>
        <div className="stop-bottom" id="stop-bottom">
          <button className="btn-back" onClick={this.props.onCancel}>
            cancel
          </button>
          <button className="btn-next" onClick={this.props.onDeleteCard}>
            {' '}
            delete
          </button>
        </div>
      </div>
    );
  }
}

export default PaymentCardDelete;
