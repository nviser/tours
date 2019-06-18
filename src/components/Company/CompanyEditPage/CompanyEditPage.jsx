import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import withAuth from '../../../services/withAuth/withAuth';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import CompanyAboutSection from './CompanyAboutSection/CompanyAboutSection';
import CompanyContactSection from './CompanyContactSection/CompanyContactSection';
import ApiService from '../../../services/ApiService/ApiService';
import InfoPannel from '../../../components/InfoPannel/InfoPannel';
import { setLoader } from '../../../actions/loaderActions';
import { setCompanyForEdit } from '../../../actions/editAction';
import { setCompanyData } from '../../../actions/companyActions';
import { companiesPath } from '../../../utils/paths';
import './CompanyEditPage.css';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';

const mapStateToProps = state => ({
  posts: state.posts,
  company_data: state.company,
  postTypes: state.postTypes,
  selectedRoutePoints: state.routes.selectedRoutePoints,
  allRoutes: state.routes.allRoutes,
  companyEdit: state.edit.company,
  companyData: state.company,
});

const mapDispatchToProps = {
  setCompanyForEdit,
  setCompanyData,
  setLoader,
};

const CompanyEditPage = withRouter(props => (
  <CompanyEditPageComponent {...props} />
));

class CompanyEditPageComponent extends Component {
  componentDidMount() {
    this.setCompanyDataForEditing();
  }

  setCompanyDataForEditing = () => {
    this.props.setLoader(true);
    this.Api.getComponent(`${companiesPath}/1`)
      .then(res => {
        this.props.setCompanyForEdit(res.data);
        this.props.setCompanyData(res.data);
        this.props.setLoader(false);
      })
      .catch(() => {
        this.props.setLoader(false);
      });
  };

  Api = new ApiService();

  createNotification = (type, data) => {
    switch (type) {
      case 'success':
        NotificationManager.success('Successfully saved');
        break;
      case 'error':
        NotificationManager.error(data, 'Server error');
        break;
      default:
    }
  };

  saveCompanyData = name => {
    const editedCompany = this.props.companyEdit;
    let data = {};
    switch (name) {
      case 'about':
        data = {
          name: editedCompany.name,
          summary: editedCompany.summary,
          google_plus_url: editedCompany.google_plus_url,
          facebook_url: editedCompany.facebook_url,
          linkedin_url: editedCompany.linkedin_url,
          twitter_url: editedCompany.twitter_url,
          website_url: editedCompany.website_url,
          established_at: editedCompany.established_at,
          closed_at: editedCompany.closed_at,
        };
        break;
      case 'contact':
        data = {
          phone_number: editedCompany.phone_number,
          contact_email: editedCompany.contact_email,
          primary_address: editedCompany.primary_address,
        };
        break;
      default:
        return;
    }

    this.props.setLoader(true);
    this.Api.patchComponent(data, `${companiesPath}/${editedCompany.id}`)
      .then(res => {
        this.props.setCompanyData(res.data);
        this.props.setLoader(false);
        this.createNotification('success');
      })
      .catch(err => {
        let newErr;
        this.props.setLoader(false);
        if (err && err.response && err.response.data.errors) {
          const obj = err.response.data.errors;
          if (typeof obj === 'object') {
            for (const key in obj) {
              newErr = obj[key].msg;
            }
          }
          this.createNotification('error', newErr);
        }
      });
  };

  render() {
    return (
      <div className="home-logged routes">
        <HeaderMobile />
        <Header />
        <div className="logged-wrap company-settings">
          <NotificationContainer />
          <Grid>
            <Row className="show-grid align-grid">
              <Col lg={7} md={7} sm={7} xs={7}>
                <h1 className="company-settings-header">About The Company</h1>
                <CompanyAboutSection
                  saveCompany={name => this.saveCompanyData(name)}
                />
                <CompanyContactSection
                  saveCompany={name => this.saveCompanyData(name)}
                />
              </Col>
              <Col lg={5} md={5} sm={5} xs={5} className="logged-right-panel">
                <InfoPannel itIsEditCompanyPage />
              </Col>
            </Row>
          </Grid>
          <div className="logged-empty" />
        </div>
        <Footer />
      </div>
    );
  }
}

CompanyEditPageComponent.defaultProps = {
  companyEdit: null,
};

CompanyEditPageComponent.propTypes = {
  setCompanyForEdit: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  setCompanyData: PropTypes.func.isRequired,
  companyEdit: PropTypes.instanceOf(Object),
};
export default withAuth(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CompanyEditPage)
);
