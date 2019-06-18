import React, { Component } from 'react';
import SplitFields from '../SplitFields/SplitFields';
import { StripeProvider, Elements } from 'react-stripe-elements';
class SplitFieldsDemo extends Component {
  render() {
    return (
      <StripeProvider apiKey={'pk_test_4ZAyqVskrxCzYx3zojYIrQyC'}>
        <Elements>
          <SplitFields handleResult={this.props.handleResult} />
        </Elements>
      </StripeProvider>
    );
  }
}

export default SplitFieldsDemo;
