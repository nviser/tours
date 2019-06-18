import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FieldGroup from '../../FieldGroup/FieldGroup';
import { editCompany } from '../../../../../actions/editAction';
import './CompanySocialLinks.css';

const mapDispatchToProps = {
  editCompany,
};

const mapStateToProps = state => ({
  companyEdit: state.edit.company,
});

const CompanySocialLinks = props => (
  <div className="company-social-links">
    <span className="company-settings-label title">company social links</span>
    <div className="links-grid">
      <Grid>
        <Row className="show-grid">
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="linkedin"
              name="linkedin_url"
              placeholder="linked in link"
              title={props.companyEdit.linkedin_url}
              data={props}
            />
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="facebook"
              name="facebook_url"
              placeholder="facebook link"
              title={props.companyEdit.facebook_url}
              data={props}
            />
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="google+"
              name="google_plus_url"
              placeholder="google+ link"
              title={props.companyEdit.google_plus_url}
              data={props}
            />
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="twitter"
              name="twitter_url"
              placeholder="twitter link"
              title={props.companyEdit.twitter_url}
              data={props}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  </div>
);

CompanySocialLinks.defaultProps = {
  companyEdit: null,
};
CompanySocialLinks.propTypes = {
  companyEdit: PropTypes.instanceOf(Object),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanySocialLinks);
