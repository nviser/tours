import React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FieldGroup from '../FieldGroup/FieldGroup';
import { editUser, setChangePassPopup } from '../../../../actions/editAction';
import './UserAccountSection.css';

const mapDispatchToProps = {
  editUser,
  setChangePassPopup,
};

const mapStateToProps = state => ({
  userData: state.edit.user,
  userDataAuth: state.auth.userData,
});

const isSaveDisabled = props => {
  if (
    props.userData &&
    props.userDataAuth &&
    props.userData.first_name === props.userDataAuth.first_name &&
    props.userData.last_name === props.userDataAuth.last_name &&
    props.userData.email === props.userDataAuth.email
  ) {
    return true;
  }
  return false;
};

const savePersonalData = (e, props) => {
  e.preventDefault();
  props.saveUser('account');
};

const UserAccountSection = props => (
  <div className="user-account-section user-edit-section">
    <form className="user-edit-form" onSubmit={e => savePersonalData(e, props)}>
      <Grid>
        <Row className="show-grid">
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="first name"
              name="first_name"
              placeholder="Your first name"
              title={props.userData.first_name}
              data={props}
            />
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="last name"
              name="last_name"
              placeholder="Your last name"
              title={props.userData.last_name}
              data={props}
            />
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="email"
              label="email"
              name="email"
              disabled
              placeholder="Email"
              title={props.userData.email}
              data={props}
            />
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="password"
              label="password"
              name="password"
              disabled
              placeholder="*************"
              data={props}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Button
              bsClass="btn btn-default button-main pull-right"
              disabled={isSaveDisabled(props)}
              type="submit"
            >
              save
            </Button>
          </Col>
        </Row>
      </Grid>
    </form>
  </div>
);

UserAccountSection.defaultProps = {
  userData: null,
};
UserAccountSection.propTypes = {
  userData: PropTypes.instanceOf(Object),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAccountSection);
