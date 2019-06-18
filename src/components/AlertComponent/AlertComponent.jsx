import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class AlertComponent extends Component {
  state = {
    show: false,
  };

  handleDismiss = () => {
    this.setState({
      show: false,
    });
  };

  handleShow = message => {
    this.setState({
      show: true,
      message,
    });
  };

  render() {
    if (this.state.show) {
      return (
        <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
          <h4>{this.state.message}</h4>
        </Alert>
      );
    }
    return null;
  }
}

export default AlertComponent;
