import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './NavItem.css';

const mapStateToProps = state => ({
  isUserActive: state.auth.isUserActive,
  isLoggedIn: state.auth.isLoggedIn,
});

const NavItem = ({ item, isUserActive, isLoggedIn }) => (
  <div className={`nav-item ${isLoggedIn && !isUserActive ? '' : 'hidden'}`}>
    <Link to={item.link}>{item.name}</Link>
  </div>
);
export default withRouter(connect(mapStateToProps)(NavItem));
