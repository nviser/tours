import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import AuthService from '../../services/AuthService/AuthService';
import {
  setEditedRouteId,
  setRouteTitle,
  selectRoutes,
} from '../../actions/routes';
import { setUserActive } from '../../actions/authAction';
import {
  setTotalRouteStop,
  setTotalDistance,
  setWaypoints,
  setProperties,
  setRouteStopParams,
  setTravelMode,
} from '../../actions/mapActions';
import { setUserAvatar } from '../../actions/authAction';
import {
  routePath,
  dashboardPath,
  creatorDashboard,
  agentProfile,
  userEditAccount,
} from '../../utils/paths';
import { FAQ_PAGE, USER_HEADER_NAME_LENGTH } from '../../utils/const';
import './MenuUserDropDown.css';
import accountImg from '../../assets/img/menu/account.png';
import merchantImg from '../../assets/img/menu/merchant.png';
import settingsImg from '../../assets/img/menu/settings.png';
import faqImg from '../../assets/img/menu/faq.png';
import logoutImg from '../../assets/img/menu/logout.png';

const MenuUserDropDownComponent = withRouter(props => (
  <MenuUserDropDown {...props} />
));

const mapDispatchToProps = {
  setEditedRouteId,
  setRouteTitle,
  selectRoutes,
  setTotalRouteStop,
  setTotalDistance,
  setWaypoints,
  setProperties,
  setRouteStopParams,
  setTravelMode,
  setUserAvatar,
  setUserActive,
};

const mapStateToProps = state => ({
  user_data: state.auth.userData,
  isUserActive: state.auth.isUserActive,
  company: state.company,
});

class MenuUserDropDown extends Component {
  Auth = new AuthService();

  goToUserDashboard = () => {
    // const user = this.Auth.getProfile();
    this.props.history.push(dashboardPath);
    this.props.setUserImg(true);
  };

  goToEditUser = () => {
    let path = userEditAccount;
    if (this.props.userData.role === 2 && !this.props.isUserActive) {
      path = agentProfile;
      this.props.setUserActive(false);
    }
    this.props.history.push(path);
  };

  goTo = path => {
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
    this.props.setUserImg(false);
  };

  checkActiveProfile = () => {
    if (!this.props.isUserActive) {
      return (
        this.props.user_data &&
        (this.props.user_data.display_name || this.props.company.display_name)
      );
    }
    return (
      this.props.user_data &&
      `${this.props.user_data.first_name || 'Loading...'} ${this.props.user_data
        .last_name || ''}`
    );
  };

  trimName = () => {
    if (
      this.checkActiveProfile() &&
      this.checkActiveProfile().length > USER_HEADER_NAME_LENGTH
    ) {
      return (
        this.checkActiveProfile().substr(0, USER_HEADER_NAME_LENGTH) + '...'
      );
    }
    return this.checkActiveProfile();
  };

  render() {
    return (
      <DropdownButton
        bsStyle="default"
        title={this.trimName() || ''}
        key={1}
        id="dropdown-basic"
        className="dropdown-button"
      >
        <li className="triangle" />
        <MenuItem className="my-dashboards" eventKey="1">
          My Dashboards:
        </MenuItem>
        {this.props.user_data && this.props.user_data.role === 1 ? (
          <MenuItem eventKey="2" onClick={this.goToUserDashboard}>
            <div>
              <img src={accountImg} alt="account" />
            </div>
            <span>Account dashboard</span>
          </MenuItem>
        ) : (
          <React.Fragment>
            <MenuItem eventKey="2" onClick={this.goToUserDashboard}>
              <div>
                <img src={accountImg} alt="account" />
              </div>
              <span>User dashboard</span>
            </MenuItem>
            <MenuItem eventKey="3" onClick={() => this.goTo(creatorDashboard)}>
              <div>
                <img src={merchantImg} alt="merchant" />
              </div>
              <span>Creator dashboard</span>
            </MenuItem>
          </React.Fragment>
        )}

        <MenuItem eventKey="4" onClick={this.goToEditUser}>
          <div>
            <img src={settingsImg} alt="settings" />
          </div>
          <span>Settings</span>
        </MenuItem>
        <MenuItem eventKey="6" onClick={() => window.open(FAQ_PAGE, '_blank')}>
          <div>
            <img src={faqImg} alt="faq" />
          </div>
          <span>FAQ</span>
        </MenuItem>

        <MenuItem eventKey="7" onClick={this.props.onClick}>
          <div>
            <img src={logoutImg} alt="faq" />
          </div>
          <span>Log Out</span>
        </MenuItem>
      </DropdownButton>
    );
  }
}

MenuUserDropDown.defaultProps = {
  first_name: '',
  last_name: '',
  user_data: null,
};

MenuUserDropDown.propTypes = {
  user_data: PropTypes.instanceOf(Object),
  onClick: PropTypes.func.isRequired,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  selectRoutes: PropTypes.func.isRequired,
  setEditedRouteId: PropTypes.func.isRequired,
  setRouteTitle: PropTypes.func.isRequired,
  setProperties: PropTypes.func.isRequired,
  setTotalDistance: PropTypes.func.isRequired,
  setTotalRouteStop: PropTypes.func.isRequired,
  setTravelMode: PropTypes.func.isRequired,
  setRouteStopParams: PropTypes.func.isRequired,
  setWaypoints: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuUserDropDownComponent);
