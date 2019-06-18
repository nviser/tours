import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import './NavItem.css';

const NavItem = withRouter(props => <NavItemComponent {...props} />);

const goTo = (props, path) => {
  path && props.history.push(path);
};

const setActive = (props, path) => props.history.location.pathname === path;

const NavItemComponent = props => (
  <li
    className={`menu-item ${props.classNames} ${
      setActive(props, props.route) ? 'activated' : ''
    }`}
    onClick={() => goTo(props, props.route)}
  >
    <div className="nav-img">
      <img
        src={setActive(props, props.route) ? props.imageActive : props.image}
        alt="navigation item"
      />
    </div>
    <span>{props.title}</span>
  </li>
);

NavItemComponent.defaultProps = {
  image: null,
  classNames: null,
  title: null,
  route: null,
};

NavItemComponent.propTypes = {
  image: PropTypes.string,
  classNames: PropTypes.string,
  title: PropTypes.string,
  route: PropTypes.string,
};

export default NavItem;
