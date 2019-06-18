import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  setIsAuthorized,
  setUserProfile,
  setUserAvatar,
  setUserActive,
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
  setTourEditable,
} from '../../actions/routes';
import {
  setTotalRouteStop,
  setTotalDistance,
  setWaypoints,
  setProperties,
  setRouteStopParams,
  resetMapData,
} from '../../actions/mapActions';
import { setCompanyData } from '../../actions/companyActions';
import { setLoader } from '../../actions/loaderActions';
import AuthService from '../../services/AuthService/AuthService';
import GroupSearchForm from '../Search/GroupSearchForm/GroupSearchForm';
import LogOutConfirm from './LogOutConfirm/LogOutConfirm';
import './HeaderMobile.css';
import logo from '../../assets/img/light.png';
import card from '../../assets/img/mobileMenu/card.png';
import info from '../../assets/img/mobileMenu/info.png';
import logOut from '../../assets/img/mobileMenu/log-out.png';
import user from '../../assets/img/mobileMenu/user.png';
import cog from '../../assets/img/mobileMenu/cog.svg';
import signIn from '../../assets/img/mobileMenu/sign-in.svg';
import signUp from '../../assets/img/mobileMenu/user-plus.svg';
import logoMobileMenu from '../../assets/img/light.svg';
import close from '../../assets/img/times_white.svg';
import { setEditableUserData } from '../../actions/editTourOperatorForm';
import { setSelectedSignUpSuggestions } from '../../actions/suggestActions';
import Modal from '../UI/Modal/Modal';
import { GET_IP_API, GET_LOCATION_API, AGENT_ROLE } from '../../utils/const';
import {
  searchQueryPath,
  tourInfoPath,
  tourOperatorRegister,
  routePath,
  logInPath,
  signUpPath,
  dashboardPath,
  creatorDashboard,
  userEditAccount,
  agentProfile,
} from '../../utils/paths';
import { FAQ_PAGE } from '../../utils/const';
import SearchService from '../../services/SearchService/SearchService';
import { setPosts } from '../../actions/postActions';
import { setFullScreen } from '../../actions/modalFullscreenActions';

const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.auth.userData,
  isUserActive: state.auth.isUserActive,
  modalDialog: state.modalDialog,
  isLoggedIn: state.auth.isLoggedIn,
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
  resetMapData,
  setPosts,
  setTourEditable,
  setFullScreen,
  setCompanyData,
  setUserActive,
};

const HeaderMobileComponent = withRouter(props => <HeaderMobile {...props} />);

class HeaderMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      menuVisible: false,
    };
  }

  Auth = new AuthService();
  Search = new SearchService();

  componentWillMount() {
    if (this.Auth.loggedIn()) {
      this.props.setIsAuthorized(true);
    }
  }

  goToExternalLink = path => {
    window.open(path, '_blank');
  };

  goTo = path => {
    this.toggleMenu();
    if (path === routePath && this.props.match.path !== routePath) {
      this.props.selectRoutes([]);
      this.props.setEditedRouteId(null);
      this.props.setRouteTitle('');
      this.props.setTotalRouteStop(0);
      this.props.setTotalDistance('0');
      this.props.setWaypoints([]);
      this.props.setProperties([]);
      this.props.setRouteStopParams([]);
      this.props.setTravelMode('DRIVING');
    }
    this.props.history.push(path);
  };

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
  };

  logOutHandler = () => {
    this.setState({ modal: false });
    this.logOut();
  };

  closeModalHandler = () => {
    this.setState({ modal: false });
  };
  openModalHandler = () => {
    this.setState({ modal: true, menuVisible: false });
  };

  getLocation = pos => {
    const country = pos.country_name,
      city = pos.city;
    this.props.history.push(`${searchQueryPath}${city},%20${country}`);
  };
  goToMap = () => {
    this.toggleMenu();
    this.props.setLoader(true);
    this.Search.getLocation(GET_IP_API)
      .then(res => {
        this.Search.getLocation(GET_LOCATION_API(res.data.ip))
          .then(res => {
            //res.data.ip
            this.props.setLoader(false);
            this.getLocation(res.data);
          })
          .catch(err => {
            this.props.setLoader(false);
          });
      })
      .catch(err => {
        this.props.setLoader(false);
      });
  };

  toggleMenu = () => {
    this.setState(
      {
        menuVisible: !this.state.menuVisible,
      },
      () => {
        this.props.setFullScreen(this.state.menuVisible);
      }
    );
  };

  resolveUserSettings = () => {
    let path = userEditAccount;
    if (this.props.userData.role === AGENT_ROLE && !this.props.isUserActive) {
      path = agentProfile;
      this.props.setUserActive(false);
    }
    return path;
  };

  createTour = () => {
    this.toggleMenu();
    this.props.resetMapData();
    this.props.setPosts([]);
    this.props.setEditedRouteId(null);
    this.props.setTourEditable(false);
    this.props.history.push(tourInfoPath);
  };

  render() {
    const { isLoggedIn, isUserActive } = this.props;
    if (this.state.toStartPage && this.props.match.path !== '/') {
      return <Redirect to="/" />;
    } else if (this.state.toThankPage) {
      return <Redirect to="/thank_page" />;
    }
    return (
      <div className="mobile-header">
        <div className="mobile-header--header">
          <i className="fa fa-bars" onClick={this.toggleMenu} />
          <img className="mobile-logo" src={logo} alt="logo" />
        </div>
        <div className="mobile-header--search">
          <GroupSearchForm />
        </div>
        <div
          className={`mobile-header--menu ${
            this.state.menuVisible ? 'active' : ''
          }`}
        >
          <div className="menu-header">
            {/*<i className="fa fa-close" onClick={this.toggleMenu}/>*/}
            <img
              src={close}
              alt="close-img"
              className="mobile-close"
              onClick={this.toggleMenu}
            />
            <img className="mobile-logo" src={logoMobileMenu} alt="logo" />
          </div>
          <div className="mobile-header--menu--items">
            <div
              onClick={this.goToMap}
              className="mobile-header--menu--item btn-map"
            >
              <span>Tour map</span>
            </div>
            <div
              onClick={() => {
                this.goTo(dashboardPath);
              }}
              className={`mobile-header--menu--item btn-user-dashboard ${
                !isLoggedIn ? 'hidden' : ''
              }`}
            >
              <span>User dashboard</span>
              <img src={user} alt="user" className="fa fa-user" />
            </div>
            <div
              onClick={() => {
                this.goTo(creatorDashboard);
              }}
              className={`mobile-header--menu--item btn-creator-dashboard ${
                this.props.userData.role !== AGENT_ROLE || !isLoggedIn
                  ? 'hidden'
                  : ''
              }`}
            >
              <span>Creator dashboard</span>
              <img src={card} alt="card" className="fa fa-credit-card" />
            </div>
            <div
              onClick={() => {
                this.goTo(this.resolveUserSettings());
              }}
              className={`mobile-header--menu--item btn-settings ${
                !isLoggedIn ? 'hidden' : ''
              }`}
            >
              <span>Settings</span>
              <img src={cog} alt="settings" className="fa fa-cog" />
            </div>
            <div
              onClick={() => {
                this.goToExternalLink(FAQ_PAGE);
              }}
              className={`mobile-header--menu--item`}
            >
              <span>Faq</span>
              <img src={info} alt="info" className="fa fa-question" />
            </div>
            <div
              onClick={() => {
                this.goTo(logInPath);
              }}
              className={`mobile-header--menu--item ${
                isLoggedIn ? 'hidden' : ''
              }`}
            >
              <span>Sign in</span>
              <img src={signIn} alt="sign-in" className="fa fa-sign-in" />
            </div>
            <div
              onClick={() => {
                this.goTo(signUpPath);
              }}
              className={`mobile-header--menu--item ${
                isLoggedIn ? 'hidden' : ''
              }`}
            >
              <span>Sign up</span>
              <img src={signUp} alt="sign-up" className="fa fa-signing" />
            </div>
            <div
              onClick={this.openModalHandler}
              className={`mobile-header--menu--item btn-logout ${
                !isLoggedIn ? 'hidden' : ''
              }`}
            >
              <span>Log out</span>
              <img src={logOut} alt="log-out" className="fa fa-sign-out" />
            </div>
            <div
              onClick={this.createTour}
              className={`mobile-header--menu--item btn-create-tour ${
                isLoggedIn && !isUserActive ? '' : 'hidden'
              }`}
            >
              Create tour
            </div>
            <div
              onClick={() => {
                this.goTo(tourOperatorRegister);
              }}
              className={`mobile-header--menu--item btn-merchant-register ${
                isLoggedIn && this.props.userData.role !== AGENT_ROLE
                  ? ''
                  : 'hidden'
              }`}
            >
              Register to create tours
            </div>
          </div>
        </div>
        <Modal show={this.state.modal}>
          <LogOutConfirm
            onCancel={this.closeModalHandler}
            onLogOut={this.logOutHandler}
          />
        </Modal>
      </div>
    );
  }
}

HeaderMobile.defaultProps = {
  userData: null,
  hideSearch: false,
};
HeaderMobile.propTypes = {
  setUserProfile: PropTypes.func.isRequired,
  setUserForEdit: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
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
)(HeaderMobileComponent);
