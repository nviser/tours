import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import withAuth from '../../../services/withAuth/withAuth';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import RouteStopPoint from '../RouteStopPoint/RouteStopPoint';
import ApiService from '../../../services/ApiService/ApiService';
import {
  setRoutes,
  setEditedRouteId,
  setRouteTitle,
  selectRoutes,
} from '../../../actions/routes';
import {
  setTotalRouteStop,
  setTotalDistance,
  setWaypoints,
  setProperties,
  setRouteStopParams,
  setTravelMode,
} from '../../../actions/mapActions';
import { setLoader } from '../../../actions/loaderActions';
import { routesApiPath, routePath } from '../../../utils/paths';
import '../Routes.css';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';

const mapStateToProps = state => ({
  posts: state.posts,
  company_data: state.company,
  postTypes: state.postTypes,
  selectedRoutePoints: state.routes.selectedRoutePoints,
  allRoutes: state.routes.allRoutes,
  userData: state.auth.userData,
});

const mapDispatchToProps = {
  setRoutes,
  setLoader,
  setEditedRouteId,
  setRouteTitle,
  selectRoutes,
  setTotalRouteStop,
  setTotalDistance,
  setWaypoints,
  setProperties,
  setRouteStopParams,
  setTravelMode,
};

const Routes = withRouter(props => <RoutesComponent {...props} />);

class RoutesComponent extends Component {
  componentDidMount() {
    this.getAllRoutes();
  }

  getAllRoutes = () => {
    if (this.props.userData && this.props.userData.id) {
      this.props.setLoader(true);
      this.Api.getComponent(
        `${routesApiPath}?user_id=${this.props.userData.id}`
      )
        .then(res => {
          this.props.setRoutes(res.data);
          this.props.setLoader(false);
        })
        .catch(err => {
          this.props.setLoader(false);
        });
    }
  };

  Api = new ApiService();

  editTour = (routeId, routeName) => {
    this.props.setEditedRouteId(routeId);
    this.props.setRouteTitle(routeName);
    this.props.setProperties([]);
    this.goToCreateRoute();
  };

  goToCreateRoute = () => {
    this.props.history.push(routePath);
  };

  clearEditedRoute = () => {
    this.props.selectRoutes([]);
    this.props.setEditedRouteId(null);
    this.props.setRouteTitle('');
    this.props.setTotalRouteStop(0);
    this.props.setTotalDistance('0');
    this.props.setWaypoints([]);
    this.props.setProperties([]);
    this.props.setRouteStopParams([]);
    this.props.setTravelMode('DRIVING');
    this.goToCreateRoute();
  };

  createTour = () => {
    this.clearEditedRoute();
  };

  render() {
    const { props } = this;
    return (
      <div className="home-logged routes">
        <HeaderMobile />
        <Header />
        <div className="logged-wrap">
          <Grid>
            <Row className="show-grid">
              <Col lg={7} md={7} sm={7} xs={7}>
                <h1 className="routes-header">Tours</h1>
                {props.allRoutes.map(item => (
                  <RouteStopPoint
                    key={item.id}
                    point={item}
                    itIsRoutes
                    editRoute={() => this.editTour(item.id, item.name)}
                  />
                ))}
                <div className="route-point-add" onClick={this.createTour}>
                  +
                </div>
              </Col>
              <Col lg={5} md={5} sm={5} xs={5} className="logged-right-panel" />
            </Row>
          </Grid>
          <div className="logged-empty" />
        </div>
        <Footer />
      </div>
    );
  }
}

RoutesComponent.defaultProps = {
  userData: null,
};

RoutesComponent.propTypes = {
  setRoutes: PropTypes.func.isRequired,
  userData: PropTypes.instanceOf(Object),
  setLoader: PropTypes.func.isRequired,
  setEditedRouteId: PropTypes.func.isRequired,
  selectRoutes: PropTypes.func.isRequired,
  setProperties: PropTypes.func.isRequired,
  setRouteStopParams: PropTypes.func.isRequired,
  setTotalDistance: PropTypes.func.isRequired,
  setTotalRouteStop: PropTypes.func.isRequired,
  setWaypoints: PropTypes.func.isRequired,
  setTravelMode: PropTypes.func.isRequired,
  setRouteTitle: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};
export default withAuth(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Routes)
);
