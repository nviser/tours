import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import userBackgroundImage from '../../assets/img/user_bg_img.jpg';
import userImg from '../../assets/img/user.jpg';
import socialsSprite from '../../assets/img/socials.jpg';
import './UserData.css';

const mapStateToProps = state => ({
  user_data: state.user,
});

const UserData = props => (
  <div className="user-data">
    <div className="logged-background">
      <Image
        className="logged-bg-img"
        responsive
        src={userBackgroundImage}
        alt="user_background_image"
      />
    </div>
    <div className="logged-info-block">
      <Grid>
        <Row className="show-grid">
          <Col lg={3} md={3} sm={3} xs={3} className="grid-blocks">
            <Image className="user-img" rounded responsive src={userImg} />
          </Col>
          <Col lg={6} md={6} sm={6} xs={6} className="grid-blocks">
            <div className="logged-info">
              <h3 className="info-header">
                {props.user_data.first_name} {props.user_data.last_name}
              </h3>
              <p>
                Civil Engineer at Architecture+ <br />
                University of Miami
              </p>
            </div>
          </Col>
          <Col lg={3} md={3} sm={3} xs={3} className="grid-blocks">
            <div className="logged-actions">
              <div className="logged-socials">
                <div
                  className={`social-for-img ${
                    props.user_data.linkedin_url ? '' : 'hidden'
                  }`}
                >
                  <a href={`${props.user_data.linkedin_url}`}>
                    <Image
                      className="social-img social-linked"
                      src={socialsSprite}
                    />
                  </a>
                </div>
                <div
                  className={`social-for-img ${
                    props.user_data.facebook_url ? '' : 'hidden'
                  }`}
                >
                  <a href={`${props.user_data.facebook_url}`}>
                    <Image
                      className="social-img social-facebook"
                      src={socialsSprite}
                    />
                  </a>
                </div>
                <div
                  className={`social-for-img ${
                    props.user_data.twitter_url ? '' : 'hidden'
                  }`}
                >
                  <a href={`${props.user_data.twitter_url}`}>
                    <Image
                      className="social-img social-twitter"
                      src={socialsSprite}
                    />
                  </a>
                </div>
                <div
                  className={`social-for-img ${
                    props.user_data.google_plus_url ? '' : 'hidden'
                  }`}
                >
                  <a href={`${props.user_data.google_plus_url}`}>
                    <Image
                      className="social-img social-pint"
                      src={socialsSprite}
                    />
                  </a>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    </div>
    <div className="logged-contact">
      <Grid>
        <Row className="show-grid">
          <Col lg={4} md={4} sm={4} xs={4} className="grid-blocks">
            location
            <br />
            <span>{props.user_data.primary_address}</span>
          </Col>
          <Col lg={4} md={4} sm={4} xs={4} className="grid-blocks">
            email
            <br />
            <span>{props.user_data.email}</span>
          </Col>
          <Col lg={4} md={4} sm={4} xs={4} className="grid-blocks">
            phone number
            <br />
            <span>{props.user_data.phone_number}</span>
          </Col>
        </Row>
      </Grid>
    </div>
  </div>
);

UserData.defaultProps = {
  user_data: null,
};
UserData.propTypes = {
  user_data: PropTypes.instanceOf(Object),
};
export default connect(mapStateToProps)(UserData);
