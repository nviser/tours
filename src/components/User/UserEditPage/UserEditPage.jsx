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
import UserAccountSection from './UserAccountSection/UserAccountSection';
import UserAboutSection from './UserAboutSection/UserAboutSection';
import UserContactSection from './UserContactSection/UserContactSection';
import ApiService from '../../../services/ApiService/ApiService';
import ModalChangePass from './Modals/ModalChangePass/ModalChangePass';
import InfoPannel from '../../../components/InfoPannel/InfoPannel';
import { setLoader } from '../../../actions/loaderActions';
import { setUserProfile } from '../../../actions/authAction';
import { setUserForEdit } from '../../../actions/editAction';
import { usersPath } from '../../../utils/paths';
import './UserEditPage.css';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';

const mapStateToProps = state => ({
  posts: state.posts,
  company_data: state.company,
  postTypes: state.postTypes,
  selectedRoutePoints: state.routes.selectedRoutePoints,
  allRoutes: state.routes.allRoutes,
  userData: state.auth.userData,
  userEdit: state.edit.user,
});

const mapDispatchToProps = {
  setUserForEdit,
  setUserProfile,
  setLoader,
};

const UserEditPage = withRouter(props => <UserEditPageComponent {...props} />);

class UserEditPageComponent extends Component {
  componentDidMount() {
    this.setUserDataForEditing();
  }

  setUserDataForEditing = () => {
    this.props.setUserForEdit(this.props.userData);
  };

  createNotification = (type, data) => {
    switch (type) {
      case 'info':
        NotificationManager.info('Info message');
        break;
      case 'success':
        NotificationManager.success('Successfully saved');
        break;
      case 'warning':
        NotificationManager.warning('Warning message', 'Close after 3000ms');
        break;
      case 'error':
        NotificationManager.error(data, 'Server error');
        break;
      default:
    }
  };

  savePersonalData = name => {
    const editedUser = this.props.userEdit;
    let data = {};
    switch (name) {
      case 'account':
        data = {
          first_name: editedUser.first_name,
          last_name: editedUser.last_name,
          // email: editedUser.email,
        };
        break;
      case 'about':
        data = {
          summary: editedUser.summary,
          google_plus_url: editedUser.google_plus_url,
          facebook_url: editedUser.facebook_url,
          linkedin_url: editedUser.linkedin_url,
          twitter_url: editedUser.twitter_url,
        };
        break;
      case 'contact':
        data = {
          phone_number: editedUser.phone_number,
          contact_email: editedUser.contact_email,
          primary_address: editedUser.primary_address,
        };
        break;
      default:
        return;
    }

    this.props.setLoader(true);
    this.Api.patchComponent(data, `${usersPath}/${editedUser.id}`)
      .then(res => {
        this.props.setUserProfile(res.data);
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

  Api = new ApiService();

  render() {
    return (
      <div className="home-logged routes">
        <HeaderMobile />
        <Header />
        <div className="logged-wrap user-settings">
          <NotificationContainer />
          <Grid>
            <Row className="show-grid align-grid">
              <Col lg={7} md={7} sm={7} xs={7}>
                <h1 className="user-settings-header">Your Account</h1>
                <ModalChangePass
                  createNotification={(type, data) =>
                    this.createNotification(type, data)
                  }
                />
                <UserAccountSection
                  saveUser={name => this.savePersonalData(name)}
                />
                <UserAboutSection
                  saveUser={name => this.savePersonalData(name)}
                />
                <UserContactSection
                  saveUser={name => this.savePersonalData(name)}
                />
              </Col>
              <Col lg={5} md={5} sm={5} xs={5} className="logged-right-panel">
                <InfoPannel itIsEditUserPage />
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

UserEditPageComponent.defaultProps = {
  userEdit: null,
  userData: null,
};

UserEditPageComponent.propTypes = {
  setUserForEdit: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  setUserProfile: PropTypes.func.isRequired,
  userEdit: PropTypes.instanceOf(Object),
  userData: PropTypes.instanceOf(Object),
};
export default withAuth(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserEditPage)
);
