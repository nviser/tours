import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FieldGroup from '../../FieldGroup/FieldGroup';
import { editUser } from '../../../../../actions/editAction';
import './UserSocialLinks.css';

const mapDispatchToProps = {
  editUser,
};

const mapStateToProps = state => ({
  userEdit: state.edit.user,
});

const UserSocialLinks = props => (
  <div className="user-social-links">
    <span className="user-settings-label title">your social links</span>
    <div className="links-grid">
      <Grid>
        <Row className="show-grid">
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="linkedin"
              name="linkedin_url"
              placeholder="Your linked in link"
              title={props.userEdit.linkedin_url}
              data={props}
            />
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="facebook"
              name="facebook_url"
              placeholder="Your facebook link"
              title={props.userEdit.facebook_url}
              data={props}
            />
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="google+"
              name="google_plus_url"
              placeholder="Your google+ link"
              title={props.userEdit.google_plus_url}
              data={props}
            />
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="twitter"
              name="twitter_url"
              placeholder="Your twitter link"
              title={props.userEdit.twitter_url}
              data={props}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  </div>
);

UserSocialLinks.defaultProps = {
  userEdit: null,
};
UserSocialLinks.propTypes = {
  userEdit: PropTypes.instanceOf(Object),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSocialLinks);
