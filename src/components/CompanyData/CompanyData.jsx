import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import companyBackgroundImage from '../../assets/img/company_bg.jpg';
import companyImg from '../../assets/img/company.jpg';
import socialsSprite from '../../assets/img/socials.jpg';

const mapStateToProps = state => ({
  company_data: state.company,
});

const CompanyData = props => {
  return (
    <div className="user-data">
      <div className="logged-background">
        <Image
          className="logged-bg-img"
          responsive
          src={companyBackgroundImage}
          alt="user_background_image"
        />
      </div>
      <div className="logged-info-block">
        <Grid>
          <Row className="show-grid">
            <Col lg={3} md={3} sm={3} xs={3} className="grid-blocks">
              <Image className="user-img" rounded responsive src={companyImg} />
            </Col>
            <Col lg={6} md={6} sm={6} xs={6} className="grid-blocks">
              <div className="logged-info">
                <h3 className="info-header">{props.company_data.name}</h3>
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
                      props.company_data.linkedin_url ? '' : 'hidden'
                    }`}
                  >
                    <a href={`${props.company_data.linkedin_url}`}>
                      <Image
                        className="social-img social-linked"
                        src={socialsSprite}
                      />
                    </a>
                  </div>
                  <div
                    className={`social-for-img ${
                      props.company_data.facebook_url ? '' : 'hidden'
                    }`}
                  >
                    <a href={`${props.company_data.facebook_url}`}>
                      <Image
                        className="social-img social-facebook"
                        src={socialsSprite}
                      />
                    </a>
                  </div>
                  <div
                    className={`social-for-img ${
                      props.company_data.twitter_url ? '' : 'hidden'
                    }`}
                  >
                    <a href={`${props.company_data.twitter_url}`}>
                      <Image
                        className="social-img social-twitter"
                        src={socialsSprite}
                      />
                    </a>
                  </div>
                  <div
                    className={`social-for-img ${
                      props.company_data.google_plus_url ? '' : 'hidden'
                    }`}
                  >
                    <a href={`${props.company_data.google_plus_url}`}>
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
    </div>
  );
};
export default connect(mapStateToProps)(CompanyData);
