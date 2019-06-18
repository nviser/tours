import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { routesApiPath } from '../../../../utils/paths';
import moment from 'moment';
import Toggle from 'react-toggle';
import ApiService from '../../../../services/ApiService/ApiService';
import 'react-toggle/style.css';
import './TourBottom.css';

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
});

class TourBottom extends Component {
  state = {
    toggler: this.props.route.is_active,
  };

  handleToggleChange = (e, id) => {
    const routeState = e.target.checked,
      data = { is_active: routeState };
    if (id) {
      this.ApiService.patchComponent(data, `${routesApiPath}/${id}`)
        .then(() => {
          this.setState({
            toggler: routeState,
          });
        })
        .catch(err => console.log(err));
    }
  };

  setStatus = () => {
    if (this.props.route && this.props.route.review_status) {
      switch (this.props.route.review_status) {
        case 'in-review':
          return <div className="in-review-block">In Review</div>;
        case 'rejected':
          return <div className="in-review-block rejected">Rejected</div>;
        default:
      }
    }
  };

  ApiService = new ApiService();
  render() {
    const { route } = this.props;
    return (
      <div className="tours-block-bottom">
        <div className="bottom-dates">
          <div className="create-date">
            <p className="date-title">Created:</p>
            <p>{moment(new Date()).format('MM/DD/YY')}</p>
          </div>
          <div className="update-date">
            <p className="date-title">Updated:</p>
            <p>{moment(new Date()).format('MM/DD/YY')}</p>
          </div>
        </div>
        <div className="bottom-toggle">
          {route.review_status === 'approved' ? (
            <div className="toggle-block">
              <span className={`${this.state.toggler ? 'active' : ''}`}>
                off
              </span>
              <Toggle
                defaultChecked={this.state.toggler}
                icons={false}
                onChange={e => this.handleToggleChange(e, route.id)}
              />
              <span className={`${this.state.toggler ? 'active' : ''}`}>
                on
              </span>
            </div>
          ) : (
            this.setStatus()
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(TourBottom));
