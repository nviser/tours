import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <footer className="static-footer">
        <div className="static-footer-wrap">
          <div className="term-item">
            <a href="/about">About Us</a>
          </div>
          <ul className="static-footer-terms">
            <li className="term-item">
              <a href="/terms">Terms & conditions</a>
            </li>
            <li className="term-item">
              <a href="/policy">Privacy policy</a>
            </li>
          </ul>
        </div>
      </footer>
    );
  }
}
export default Footer;
