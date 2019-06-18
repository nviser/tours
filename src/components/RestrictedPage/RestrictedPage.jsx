import React, { Component } from 'react';
import Header from '../../components/Header/Header';

class RestrictedPage extends Component {
  render() {
    return (
      <div className="not-found">
        <Header />
        <div className="not-found-wrap">
          <h2 className="not-found-header">
            You have not added any payment methods yet.
          </h2>
          <div className="not-found-body">
            <h5 className="not-found-sub-header">
              You can register as tour operator and this page will be accessible
            </h5>
          </div>
        </div>
      </div>
    );
  }
}
export default RestrictedPage;
