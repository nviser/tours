import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
import NavItem from './NavItem/NavItem';
import './SidePanelMobile.css';
import { tourInfoPath } from '../../utils/paths';
import { setPosts } from '../../actions/postActions';
import { setFullScreen } from '../../actions/modalFullscreenActions';
import { setLoader } from '../../actions/loaderActions';
const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.auth.userData,
  isLoggedIn: state.auth.isLoggedIn,
  avatar: state.auth.avatar,
});

const mapDispatchToProps = {
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
  setFullScreen,
  setLoader,
};

const UserSidePanelMobile = withRouter(props => (
  <UserSidePanelMobileComponent {...props} />
));

class UserSidePanelMobileComponent extends Component {
  state = {
    menuVisible: false,
  };
  wrapperRef = null;

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        menuVisible: false,
      });
      this.props.setFullScreen(false);
      this.props.setLoader(false);
    }
  };

  tourRegistrationHandler = () => {
    this.props.setFullScreen(false);
    this.props.setLoader(false);
    this.props.history.push('/tour_operator_register');
  };

  resolveCurrentLocationTitle = pathName => {
    const current = this.props.items.filter(item => {
      return item.route === pathName;
    })[0];
    return current ? current.title : '';
  };

  toggleMenu = callback => {
    this.setState(
      {
        menuVisible: !this.state.menuVisible,
      },
      () => {
        this.props.setFullScreen(this.state.menuVisible);
        typeof callback === 'function' ? callback() : null;
      }
    );
  };

  createTour = () => {
    this.props.setFullScreen(false);
    this.props.setLoader(false);
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
      case '/payment_methods': {
        return false;
      }
      default: {
        return this.props.userData.role === 2;
      }
    }
  };
  render() {
    return (
      <div className="side-panel-mobile-group">
        <div
          className={`side-panel-backdrop ${
            this.state.menuVisible ? 'visible' : ''
          }`}
        />
        <div className="side-panel-mobile" ref={this.setWrapperRef}>
          <div
            className="side-panel-nav-item toggle-menu"
            onClick={this.toggleMenu}
          >
            <span>
              {this.resolveCurrentLocationTitle(
                this.props.history.location.pathname
              )}
            </span>
            <i
              className={`fa ${
                this.state.menuVisible ? 'fa-caret-up' : 'fa-caret-down'
              }`}
            />
          </div>
          <ul
            className={`panel-mobile-options ${
              this.state.menuVisible ? 'visible' : ''
            }`}
          >
            {this.props.items &&
              this.props.items.map(item => (
                <NavItem
                  key={item.id}
                  image={item.image}
                  imageActive={item.imageActive}
                  title={item.title}
                  classNames={item.classNames}
                  clickCallback={this.toggleMenu}
                  route={item.route}
                />
              ))}
            <li
              className={`side-panel-nav-item merchant-register ${
                !this.props.register ? 'hidden' : ''
              }`}
              onClick={this.tourRegistrationHandler}
            >
              Register to create tours
            </li>
            <li
              className={`side-panel-nav-item create-tour ${
                !this.canAddTour() ? 'hidden' : ''
              }`}
              onClick={this.createTour}
            >
              Create tour
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

UserSidePanelMobileComponent.defaultProps = {
  userData: null,
  item: null,
  register: null,
  lastItem: null,
};

UserSidePanelMobileComponent.propTypes = {
  setUserProfile: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
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
)(UserSidePanelMobile);
