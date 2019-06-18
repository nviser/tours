import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import UserSummary from './UserSummary/UserSummary';
import UserSocialLinks from './UserSocialLinks/UserSocialLinks';
import './UserAboutSection.css';

const mapStateToProps = state => ({
  userData: state.edit.user,
  userDataAuth: state.auth.userData,
});

const isSaveDisabled = props => {
  if (
    props.userData &&
    props.userDataAuth &&
    props.userData.summary === props.userDataAuth.summary &&
    props.userData.google_plus_url === props.userDataAuth.google_plus_url &&
    props.userData.facebook_url === props.userDataAuth.facebook_url &&
    props.userData.linkedin_url === props.userDataAuth.linkedin_url &&
    props.userData.twitter_url === props.userDataAuth.twitter_url
  ) {
    return true;
  }
  return false;
};

const saveAboutData = (e, props) => {
  e.preventDefault();
  props.saveUser('about');
};

const UserAboutSection = props => (
  <div className="user-about-section user-edit-section">
    <form onSubmit={e => saveAboutData(e, props)} className="user-edit-form">
      <UserSummary />
      <UserSocialLinks />
      <Grid>
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

export default connect(mapStateToProps)(UserAboutSection);
