import React, { Component } from 'react';
import './LogOutConfirm.css';

class LogOutConfirm extends Component {
  render() {
    return (
      <div className="tour-stop-delete">
        <h1 className="tour-stop-delete-title">
          ARE YOU SURE WANT TO LOG OUT?
        </h1>
        <div className="stop-bottom" id="stop-bottom">
          <button className="btn-back" onClick={this.props.onCancel}>
            cancel
          </button>
          <button className="btn-next" onClick={this.props.onLogOut}>
            {' '}
            Log Out
          </button>
        </div>
      </div>
    );
  }
}

export default LogOutConfirm;
