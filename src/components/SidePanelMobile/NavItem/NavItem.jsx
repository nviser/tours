import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import './NavItem.css';

const NavItem = withRouter(props => <NavItemComponent {...props} />);

const goTo = (props, path) => {
  path && props.history.push(path);
};

const clickHandler = (props, path) => {
  props.clickCallback();
  goTo(props, path);
};

const setActive = (props, path) => props.history.location.pathname === path;

const NavItemComponent = props => (
  <li
    className={`side-panel-nav-item ${
      setActive(props, props.route) ? 'active' : ''
    }`}
    onClick={() => {
      props.clickCallback(() => {
        clickHandler(props, props.route);
      });
    }}
  >
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
