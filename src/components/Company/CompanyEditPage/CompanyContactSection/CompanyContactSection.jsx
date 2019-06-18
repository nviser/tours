import React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FieldGroup from '../FieldGroup/FieldGroup';
import { editCompany } from '../../../../actions/editAction';
import './CompanyContactSection.css';

const mapStateToProps = state => ({
  companyEdit: state.edit.company,
  companyData: state.company,
});

const mapDispatchToProps = {
  editCompany,
};

const isSaveDisabled = props => {
  if (
    props.companyEdit &&
    props.companyData &&
    props.companyData.phone_number === props.companyEdit.phone_number &&
    props.companyData.contact_email === props.companyEdit.contact_email &&
    props.companyData.primary_address === props.companyEdit.primary_address
  ) {
    return true;
  }
  return false;
};

const saveContactData = (e, props) => {
  e.preventDefault();
  props.saveCompany('contact');
};

const addNewAddress = (e, props) => {
  e.preventDefault();
  console.log(props);
};

const CompanyContactSection = props => (
  <div className="company-contact-section company-edit-section">
    <h1 className="company-settings-header">Company Contact Information</h1>
    <form
      className="company-edit-form"
      onSubmit={e => saveContactData(e, props)}
    >
      <Grid>
        <Row className="show-grid">
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="phone number"
              name="phone_number"
              placeholder="Add Your Phone Number"
              title={props.companyEdit.phone_number}
              disabled
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
              title={props.companyEdit.contact_email}
              disabled
              data={props}
            />
          </Col>
          <Col lg={9} md={9} sm={9} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="primary address"
              name="primary_address"
              placeholder="Enter your address here"
              title={props.companyEdit.primary_address}
              disabled
              data={props}
            />
          </Col>
          <Col lg={3} md={3} sm={3} xs={12}>
            <Button
              bsClass="btn btn-default button-main add-new-input pull-right"
              onClick={e => addNewAddress(e, props)}
            >
              add new address
            </Button>
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

CompanyContactSection.defaultProps = {
  companyEdit: null,
};
CompanyContactSection.propTypes = {
  companyEdit: PropTypes.instanceOf(Object),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyContactSection);
