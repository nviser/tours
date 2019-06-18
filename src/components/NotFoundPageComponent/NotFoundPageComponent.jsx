import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';
import HeaderMobile from '../HeaderMobile/HeaderMobile';

class NotFoundPageComponent extends Component {
  render() {
    return (
      <div className="not-found">
        <HeaderMobile />
        <Header />
        <div className="not-found-wrap">
          <div className="not-found-body">
            <h2 className="not-found-header">404</h2>
            <h5 className="not-found-sub-header">
              Ops, looks like you've lost your way.
            </h5>
            <Link to="/" className="tour-btn">
              click here for a tour
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
export default NotFoundPageComponent;
