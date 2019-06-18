import React from 'react';
import { FaUser, FaFlag, FaEyeSlash, FaRss, FaGlobe } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './UserEditMenu.css';

const mapStateToProps = state => ({
  userData: state.auth.userData,
});

const goTo = (path, props) => {
  props.goTo(path);
};

const UserEditMenu = props => (
  <ul className="user-edit-menu">
    <li
      className={`edit-menu-item ${props.itIsEditUserPage ? 'selected' : ''}`}
      onClick={() => goTo(`/users/${props.userData.id}/edit`, props)}
    >
      <FaUser className="edit-menu-icon" />
      {`${props.userData.first_name} ${props.userData.last_name} Account`}
    </li>
    <li
      className={`edit-menu-item ${
        props.itIsEditCompanyPage ? 'selected' : ''
      }`}
      onClick={() => goTo('/companies/1/edit', props)}
    >
      <FaFlag className="edit-menu-icon" />
      Architecture+ Account
    </li>
    <li className="edit-menu-item">
      <FaEyeSlash className="edit-menu-icon" />
      Privacy
    </li>
    <li className="edit-menu-item">
      <FaRss className="edit-menu-icon" />
      Following
    </li>
    <li className="edit-menu-item">
      <FaGlobe className="edit-menu-icon" />
      Language
    </li>
  </ul>
);

UserEditMenu.defaultProps = {
  userData: null,
  itIsEditUserPage: null,
  itIsEditCompanyPage: null,
};

UserEditMenu.propTypes = {
  userData: PropTypes.instanceOf(Object),
  itIsEditUserPage: PropTypes.bool,
  itIsEditCompanyPage: PropTypes.bool,
};

export default connect(mapStateToProps)(UserEditMenu);
