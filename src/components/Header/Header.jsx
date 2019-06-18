import React, { Component, Fragment } from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import ReactImageFallback from 'react-image-fallback';
import {
  setIsAuthorized,
  setUserProfile,
  setUserAvatar,
} from '../../actions/authAction';
import { setUserForEdit } from '../../actions/editAction';
import {
  showSignInDialog,
  showSignUpDialog,
} from '../../actions/dialogActions';
import {
  setRoutes,
  setEditedRouteId,
  setRouteTitle,
  selectRoutes,
} from '../../actions/routes';
import {
  setTotalRouteStop,
  setTotalDistance,
  setWaypoints,
  setProperties,
  setRouteStopParams,
} from '../../actions/mapActions';
import { setLoader } from '../../actions/loaderActions';
import { setCompanyData } from '../../actions/companyActions';
import { companiesPath } from '../../utils/paths';
import noImg from '../../assets/img/icons/no-photo.png';
import loader from '../../assets/img/loading.gif';
import { API_URL } from '../../config';
import MenuUserDropDown from '../../components/MenuUserDropDown/MenuUserDropDown';
import ModalSignIn from '../../components/ModalSignIn/ModalSignIn';
import ModalSignUp from '../../components/ModalSignUp/ModalSignUp';
import AuthService from '../../services/AuthService/AuthService';
import ApiService from '../../services/ApiService/ApiService';
import GroupSearchForm from '../Search/GroupSearchForm/GroupSearchForm';
import LogOutConfirm from './LogOutConfirm/LogOutConfirm';
import './Header.css';
import logo from '../../assets/img/light.png';
import logoSmall from '../../assets/img/light_small.png';
import { setEditableUserData } from '../../actions/editTourOperatorForm';
import { setSelectedSignUpSuggestions } from '../../actions/suggestActions';
import NavPanel from './NavPanel/NavPanel';
import Modal from '../UI/Modal/Modal';

const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.auth.userData,
  modalDialog: state.modalDialog,
  isLoggedIn: state.auth.isLoggedIn,
  isUserActive: state.auth.isUserActive,
  isActiveSignInDialog: state.modalDialog.isActiveSignInDialog,
  isActiveSignUpDialog: state.modalDialog.isActiveSignUpDialog,
  avatar: state.auth.avatar,
});

const mapDispatchToProps = {
  setIsAuthorized,
  setUserProfile,
  showSignInDialog,
  showSignUpDialog,
  setLoader,
  setRoutes,
  setEditedRouteId,
  setRouteTitle,
  selectRoutes,
  setTotalRouteStop,
  setTotalDistance,
  setWaypoints,
  setProperties,
  setRouteStopParams,
  setUserForEdit,
  setEditableUserData,
  setSelectedSignUpSuggestions,
  setUserAvatar,
  setCompanyData,
};

const HeaderComponent = withRouter(props => <Header {...props} />);

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toThankPage: false,
      toStartPage: false,
      serverErr: false,
      width: 125,
      modal: false,
      isCompany: this.props.userData.staff,
    };
  }
  componentWillMount() {
    if (this.Auth.loggedIn()) {
      this.props.setIsAuthorized(true);
    }
    if (this.Auth.loggedIn()) {
      this.getUserData();
    }
    this.linkedInCheckIn();
  }

  detectAvatar = () => {
    if (this.props.userData.role === 2) {
      return 'merchant-avatar';
    }
    return 'avatar';
  };

  setUserImage = type => {
    if (type === undefined && this.props.isUserActive) type = true;
    this.props.setUserAvatar(
      `${API_URL}/me/avatar?avatar_type=${
        type ? 'avatar' : this.detectAvatar()
      }&token=${this.Auth.getToken()}&width=${
        this.state.width
      }&${new Date().getTime()}`
    );
  };

  getA2 = inCode => {
    this.props.setLoader(true);
    this.Auth.loginLinkedIn2(inCode)
      .then(res => {
        if (res.data.access_token) {
          this.Auth.loginLinkedIn(res.data.access_token)
            .then(() => {
              this.props.setLoader(false);
              this.getAuthUserData();
            })
            .catch(() => this.props.setLoader(false));
        }
      })
      .catch(() => this.props.setLoader(false));
  };

  setUserData = userData => {
    this.props.setUserProfile(userData);
    this.props.setIsAuthorized(true);
    this.props.setLoader(false);
    if (userData.zip && userData.role.id === 2) {
      let editUserData = {
        name: userData.name,
        zip: userData.zip,
        ssn: userData.ssn,
        summary: userData.summary,
        website_url: userData.website_url,
        facebook_account: userData.facebook_account,
        linkedin_account: userData.linkedin_account,
        instagram_account: userData.instagram_account,
        twitter_account: userData.twitter_account,
        primary_address: userData.primary_address,
      };
      if (Object.keys(userData.primary_address).length > 0) {
        let address = JSON.parse(userData.primary_address);
        this.props.setSelectedSignUpSuggestions({ value: address.description });
      }

      this.props.setEditableUserData(editUserData);
    }

    this.props.setUserForEdit(userData);
    if (userData.id) this.setUserImage();
  };

  getCompany = () => {
    this.ApiService.getComponent(companiesPath)
      .then(res => this.props.setCompanyData(res.data))
      .catch(err => console.log(err));
  };

  getUserData = () => {
    if (
      Object.keys(this.props.userData).length === 0 &&
      this.props.userData.constructor === Object
    ) {
      this.props.setLoader(true);
      this.Auth.getUserData()
        .then(res => {
          this.setUserData(res.data);
          if (res.data.staff && res.data.staff.company) this.getCompany();
        })
        .catch(err => {
          this.props.setLoader(false);
        });
    }
  };

  getUserId = () => {
    const user = this.Auth.getProfile();
    this.props.history.push(`/users/${user.id}`);
  };

  getAuthUserData = () => {
    this.hideSignInPopUp();
    this.getUserData();
    this.getUserId();
  };

  linkedInCheckIn = () => {
    const { search } = this.props.location;

    if (search.indexOf('code') > -1) {
      const f = search.indexOf('=');
      const e = search.indexOf('&');
      const inCode = search.substring(f + 1, e);
      this.getA2(inCode);
    }
  };

  hideSignInPopUp = () => {
    this.props.showSignInDialog(false);
  };

  hideSignUpPopUp = () => {
    this.props.showSignUpDialog(false);
  };

  goToLogInScreen = () => {
    this.props.history.push('/login');
  };

  goToSignUpScreen = () => {
    this.props.history.push('/sign_up');
  };

  Auth = new AuthService();
  ApiService = new ApiService();

  logOut = () => {
    this.props.setIsAuthorized(false);
    this.props.setUserProfile({});
    this.props.setCompanyData({});
    this.setState({
      toStartPage: true,
    });
    this.clearUserData();
    this.Auth.logout();
  };

  clearUserData = () => {
    this.props.setRoutes([]);
    this.props.selectRoutes([]);
    this.props.setEditedRouteId(null);
    this.props.setRouteTitle('');
    this.props.setTotalRouteStop(0);
    this.props.setTotalDistance('0');
    this.props.setWaypoints([]);
    this.props.setProperties([]);
    this.props.setRouteStopParams([]);
    //this.props.setUserAvatar('');
  };

  goToMap = () => {
    this.props.history.push('/map');
  };

  handleFormSubmit = (e, credentials) => {
    e.preventDefault();
    this.props.setLoader(true);
    this.Auth.login(credentials.logEmail, credentials.logPass)
      .then(() => {
        this.getAuthUserData();
        this.props.setLoader(false);
      })
      .catch(err => {
        this.props.setLoader(false);
        this.setState({
          serverErr: true,
        });
        if (err && err.response && err.response.data.errors) {
          this.setState({
            serverErrorsLogin: err.response.data.errors,
          });
        }
      });
  };

  handleFormSignUpSubmit = (e, credentials) => {
    e.preventDefault();
    this.props.setLoader(true);
    this.Auth.registration(
      credentials.regFirstName,
      credentials.regLastName,
      credentials.regEmail,
      credentials.regPass,
      credentials.regConfirmPass
    )
      .then(() => {
        this.setState({
          toThankPage: true,
        });
        this.hideSignUpPopUp();
        this.props.setLoader(false);
      })
      .catch(err => {
        this.props.setLoader(false);
        this.setState({
          serverErr: true,
        });
        if (err && err.response && err.response.data.errors) {
          this.setState({
            serverErrors: err.response.data.errors,
          });
        }
      });
  };

  logOutHandler = () => {
    this.setState({ modal: false });
    this.logOut();
  };

  closeModalHandler = () => {
    this.setState({ modal: false });
  };
  openModalHandler = () => {
    this.setState({ modal: true });
  };

  render() {
    const {
      isLoggedIn,
      isActiveSignInDialog,
      isActiveSignUpDialog,
      userData,
    } = this.props;
    const { serverErr, serverErrors, serverErrorsLogin } = this.state;
    if (this.state.toStartPage && this.props.match.path !== '/') {
      return <Redirect to="/" />;
    } else if (this.state.toThankPage) {
      return <Redirect to="/thank_page" />;
    }
    return (
      <Fragment>
        <header className="static-header">
          <div className="static-header-wrap">
            <div className="static-header-left">
              <Link to="/">
                <img
                  className="static-logo hidden-sm hidden-xs"
                  src={logo}
                  alt="logo"
                />
                <img
                  className="static-logo hidden-md hidden-lg"
                  src={logoSmall}
                  alt="logo"
                />
              </Link>
              <div
                className={`static-header-form ${
                  this.props.hideSearch ? 'hidden' : ''
                }`}
              >
                <GroupSearchForm />
              </div>
            </div>
            <div className="rigth-block">
              <NavPanel />
              <nav className="static-nav">
                <ul className="static-auth">
                  <li
                    className={`auth-item static-login ${
                      isLoggedIn ? 'logged-in' : ''
                    }`}
                    onClick={this.goToLogInScreen}
                  >
                    sign in
                  </li>
                  <li
                    className={`auth-item static-account ${
                      isLoggedIn ? 'logged-in' : ''
                    }`}
                    onClick={this.goToSignUpScreen}
                  >
                    sign up
                  </li>
                  {/* <li className="auth-item static-map logged-in" onClick={this.goToMap}>map</li> */}
                  <li
                    className={`auth-item static-user ${
                      isLoggedIn ? 'logged-in' : ''
                    }`}
                  >
                    <div className="static-user-img">
                      <ReactImageFallback
                        src={this.props.avatar}
                        initialImage={loader}
                        fallbackImage={noImg}
                        alt="user-avatar"
                      />
                    </div>
                    <div className="static-user-name">
                      <MenuUserDropDown
                        setUserImg={isUser => this.setUserImage(isUser)}
                        onClick={this.openModalHandler}
                        userData={userData}
                      />
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <ModalSignIn
          show={isActiveSignInDialog}
          onHide={this.hideSignInPopUp}
          onClick={this.loggingIn}
          onFormSubmit={this.handleFormSubmit}
          onError={serverErr}
          serverErrors={serverErrorsLogin}
          getAuthUserData={this.getAuthUserData}
        />
        <ModalSignUp
          show={isActiveSignUpDialog}
          onHide={this.hideSignUpPopUp}
          onClick={this.loggingIn}
          onFormSignUpSubmit={this.handleFormSignUpSubmit}
          serverErrors={serverErrors}
        />
        <Modal show={this.state.modal}>
          <LogOutConfirm
            onCancel={this.closeModalHandler}
            onLogOut={this.logOutHandler}
          />
        </Modal>
      </Fragment>
    );
  }
}

Header.defaultProps = {
  userData: null,
  hideSearch: false,
};
Header.propTypes = {
  setUserProfile: PropTypes.func.isRequired,
  setUserForEdit: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isActiveSignInDialog: PropTypes.bool.isRequired,
  isActiveSignUpDialog: PropTypes.bool.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  showSignInDialog: PropTypes.func.isRequired,
  showSignUpDialog: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  setIsAuthorized: PropTypes.func.isRequired,
  userData: PropTypes.instanceOf(Object),
  setRoutes: PropTypes.func.isRequired,
  setEditedRouteId: PropTypes.func.isRequired,
  selectRoutes: PropTypes.func.isRequired,
  setProperties: PropTypes.func.isRequired,
  setTotalDistance: PropTypes.func.isRequired,
  setRouteStopParams: PropTypes.func.isRequired,
  setTotalRouteStop: PropTypes.func.isRequired,
  setWaypoints: PropTypes.func.isRequired,
  setRouteTitle: PropTypes.func.isRequired,
  hideSearch: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent);
