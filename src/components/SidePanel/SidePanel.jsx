import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import ReactImageFallback from 'react-image-fallback';
import noImg from '../../assets/img/icons/no-photo.png';
import loader from '../../assets/img/loading.gif';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setLoader } from '../../actions/loaderActions';
import {
  setIsAuthorized,
  setUserProfile,
  setUserAvatar,
} from '../../actions/authAction';
import { setUserForEdit } from '../../actions/editAction';
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
import AuthService from '../../services/AuthService/AuthService';
import NavItem from './NavItem/NavItem';
import './SidePanel.css';
import { userEditAccount, tourInfoPath } from '../../utils/paths';
import { API_URL } from '../../config';
import { setPosts } from '../../actions/postActions';

const mapStateToProps = state => ({
  auth: state.auth,
  company: state.company,
  userData: state.auth.userData,
  isLoggedIn: state.auth.isLoggedIn,
  avatar: state.auth.avatar,
  isUserActive: state.auth.isUserActive,
});

const mapDispatchToProps = {
  setLoader,
  setIsAuthorized,
  setUserProfile,
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
  setUserAvatar,
  resetMapData,
  setPosts,
  setTourEditable,
};

const UserSidePanel = withRouter(props => (
  <UserSidePanelComponent {...props} />
));

class UserSidePanelComponent extends Component {
  state = {
    width: 125,
    avatar: null,
  };

  componentDidUpdate(next) {
    if (
      this.props.userData &&
      this.props.userData.role !== next.userData.role
    ) {
      this.setUserImage();
    }
  }
  detectAvatar = () => {
    if (this.canAddTour()) {
      return 'merchant-avatar';
    }
    return 'avatar';
  };
  setUserImage = width =>
    this.props.setUserAvatar(
      `${API_URL}/me/avatar?avatar_type=${this.detectAvatar()}&token=${this.Auth.getToken()}&width=${width}&${new Date().getTime()}`
    );

  tourRegistrationHandler = () => {
    this.props.history.push('/tour_operator_register');
  };
  Auth = new AuthService();
  goTo = () => {
    this.props.history.push(userEditAccount);
  };

  createTour = () => {
    this.props.resetMapData();
    this.props.setPosts([]);
    this.props.setEditedRouteId(null);
    this.props.setTourEditable(false);
    this.props.history.push(tourInfoPath);
  };

  canAddTour = () => {
    switch (this.props.history.location.pathname) {
      case '/dashboard':
      case '/favorites-tours':
      case '/tours/purchased':
      case '/user-journal':
      case '/edit_user_account':
      case '/create_payment_method':
      case '/payment_methods': {
        return false;
      }
      default: {
        return this.props.userData.role === 2;
      }
    }
  };
  setAddress = () => {
    if (!this.props.isUserActive) {
      const addr = this.props.userData.primary_address;
      if (
        this.props.company &&
        Object.keys(this.props.company).length > 0 &&
        this.props.company.primary_address
      ) {
        return this.props.company.primary_address.short_address;
      } else if (this.props.userData && addr && Object.keys(addr).length > 0) {
        return addr.short_address;
      }
    }
    return null;
  };

  checkActiveProfile = () => {
    if (!this.props.isUserActive) {
      return (
        this.props.userData &&
        (this.props.userData.display_name || this.props.company.display_name)
      );
    }
    return (
      this.props.userData &&
      `${this.props.userData.first_name} ${this.props.userData.last_name}`
    );
  };
  render() {
    return (
      <div className="side-panel">
        <div className="side-container">
          <div className="user-info-block">
            <Row>
              <Col lg={3} md={4} sm={4} xs={3}>
                <div className="static-user-img">
                  {this.props.userData.role && (
                    <ReactImageFallback
                      src={this.props.avatar}
                      initialImage={loader}
                      fallbackImage={noImg}
                      alt="user_photo"
                    />
                  )}
                </div>
              </Col>
              <Col lg={9} md={8} sm={8} xs={9}>
                <div className="user-info">
                  <div className="user-name">
                    {this.canAddTour() ? (
                      <span>{this.checkActiveProfile()}</span>
                    ) : (
                      <span>
                        {this.props.userData.first_name || 'Loading...'}{' '}
                        {this.props.userData.last_name || ''}
                      </span>
                    )}
                  </div>
                  <div className="user-location">
                    {!!this.setAddress() && (
                      <Glyphicon glyph="map-marker" className="map-marker" />
                    )}
                    <span>{this.setAddress()}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <div className="menu-list">
            <ul>
              {this.props.items &&
                this.props.items.map(item => (
                  <NavItem
                    key={item.id}
                    image={item.image}
                    imageActive={item.imageActive}
                    title={item.title}
                    classNames={item.classNames}
                    route={item.route}
                  />
                ))}
            </ul>
          </div>
          <button
            onClick={this.tourRegistrationHandler}
            className={`btn-merchant-register ${
              !this.props.register ? 'hidden' : ''
            }`}
          >
            Register to create tours
          </button>

          <button
            onClick={this.createTour}
            className={`btn-create-tour ${!this.canAddTour() ? 'hidden' : ''}`}
          >
            Create new tour
          </button>
        </div>
      </div>
    );
  }
}

UserSidePanelComponent.defaultProps = {
  userData: null,
  item: null,
  register: null,
  lastItem: null,
};

UserSidePanelComponent.propTypes = {
  setUserProfile: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  setLoader: PropTypes.func.isRequired,
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
  history: ReactRouterPropTypes.history,
  item: PropTypes.instanceOf(Array),
  register: PropTypes.bool,
  lastItem: PropTypes.instanceOf(Object),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSidePanel);
