import React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FieldGroup from '../FieldGroup/FieldGroup';
import { editUser, setChangePassPopup } from '../../../../actions/editAction';
import './UserContactSection.css';

const mapStateToProps = state => ({
  userEdit: state.edit.user,
  userData: state.auth.userData,
});

const mapDispatchToProps = {
  editUser,
  setChangePassPopup,
};

const isSaveDisabled = props => {
  if (
    props.userData &&
    props.userEdit &&
    props.userData.phone_number === props.userEdit.phone_number &&
    props.userData.contact_email === props.userEdit.contact_email &&
    props.userData.primary_address === props.userEdit.primary_address
  ) {
    return true;
  }
  return false;
};

const saveContactData = (e, props) => {
  e.preventDefault();
  props.saveUser('contact');
};

const UserContactSection = props => (
  <div className="user-contact-section user-edit-section">
    <h1 className="user-settings-header">Your Contact Information</h1>
    <form className="user-edit-form" onSubmit={e => saveContactData(e, props)}>
      <Grid>
        <Row className="show-grid">
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="phone number"
              name="phone_number"
              placeholder="Add Your Phone Number"
              title={props.userEdit.phone_number}
              data={props}
            />
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="email"
              label="contact email"
              name="contact_email"
              placeholder="The same of Sign in"
              title={props.userEdit.contact_email}
              data={props}
            />
          </Col>
          <Col lg={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="primary address"
              name="primary_address"
              placeholder="Enter your address here"
              title={props.userEdit.primary_address}
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

UserContactSection.defaultProps = {
  userEdit: null,
};
UserContactSection.propTypes = {
  userEdit: PropTypes.instanceOf(Object),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserContactSection);
