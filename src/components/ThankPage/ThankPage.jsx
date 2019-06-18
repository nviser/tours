import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import './ThankPage.css';
import HeaderMobile from '../HeaderMobile/HeaderMobile';

class ThankPage extends Component {
  render() {
    return (
      <div className="static-pages thank-page">
        <HeaderMobile />
        <Header />
        <div className="static-pages-wrap">
          <div className="static-pages-body text-center">
            <h5 className="not-found-sub-header">Thanks!</h5>
            <Link to="/" className="back-btn">
              back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
export default ThankPage;
