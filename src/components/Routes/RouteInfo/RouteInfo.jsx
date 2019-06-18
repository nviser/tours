import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ButtonToolbar, Button } from 'react-bootstrap';
import ApiService from '../../../services/ApiService/ApiService';
import {
  selectRoutes,
  setRouteTitle,
  setEditedRouteId,
  selectSingleRoute,
} from '../../../actions/routes';
import {
  routesApiPath,
  routesPath,
  waypointsApiPath,
  searchUserNotFoundPath,
} from '../../../utils/paths';
import './RouteInfo.css';

const mapStateToProps = state => ({
  selectedRoutePoints: state.routes.selectedRoutePoints,
  routeTitle: state.routes.routeTitle,
  editedRouteId: state.routes.editedRouteId,
  totalRouteStop: state.map.totalRouteStop,
  totalDistance: state.map.totalDistance,
  waypoints: state.map.waypoints,
  userData: state.auth.userData,
});

const mapDispatchToProps = {
  selectRoutes,
  setRouteTitle,
  setEditedRouteId,
  selectSingleRoute,
};

const Api = new ApiService();

const goToRoutes = props => {
  props.selectRoutes([]);
  props.setRouteTitle('');
  props.selectSingleRoute({});
  props.history.push(routesPath);
};

const prepareWaypointsData = props => ({
  points: props.waypoints.map(item => [item.lat, item.lng]),
});

const setWaypoints = (id, props) => {
  Api.sendComponent(
    prepareWaypointsData(props),
    `${routesApiPath}/${id}${waypointsApiPath}`
  ).then(() => {
    goToRoutes(props);
  });
};

const sendRoute = (data, url, props) => {
  Api.sendComponent(data, url).then(res => {
    setWaypoints(res.data.id, props);
  });
};

const updateRoute = (data, props) => {
  Api.putComponent(data, `${routesPath}/${props.editedRouteId}`)
    .then(res => {
      props.setEditedRouteId(null);
      setWaypoints(res.data.id, props);
    })
    .catch(err => {
      if (err && err.response && err.response.status === 401) {
        props.history.push(searchUserNotFoundPath);
      }
    });
};

const prepareRouteData = props => {
  const ids = props.selectedRoutePoints.map(item => item.postId);
  const data = {
    posts: ids,
    name: props.routeTitle,
    summary: 'test',
  };
  if (props.editedRouteId) {
    updateRoute(data, props);
  } else {
    sendRoute(data, routesApiPath, props);
  }
};

const RouteInfoComponent = withRouter(props => <RouteInfo {...props} />);

const RouteInfo = props => (
  <div className="route-info">
    <div className="info-block">
      <h4 className="info-header">total route stop</h4>
      <p className="info-content">{props.selectedRoutePoints.length}</p>
    </div>
    <div className="info-block">
      <h4 className="info-header">total distance</h4>
      <p className="info-content">{props.totalDistance}</p>
    </div>
    <div className="route-info-buttons">
      <ButtonToolbar>
        <Button
          bsSize="large"
          /* onClick={this.resetRouteForm} */
          className="button-main"
          disabled
        >
          cancel
        </Button>
        <Button
          bsSize="large"
          disabled={!props.selectedRoutePoints.length}
          onClick={() => {
            prepareRouteData(props);
          }}
          className="button-main"
        >
          save
        </Button>
      </ButtonToolbar>
    </div>
  </div>
);

RouteInfo.defaultProps = {
  selectedRoutePoints: [],
  totalDistance: '',
};
RouteInfo.propTypes = {
  selectedRoutePoints: PropTypes.instanceOf(Array),
  totalDistance: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteInfoComponent);
