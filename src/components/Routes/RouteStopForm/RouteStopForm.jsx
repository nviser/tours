import React, { Component } from 'react';
import { Grid, Row, Col, ButtonToolbar, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactRouterPropTypes from 'react-router-prop-types';
import AutosuggestComponent from '../../AutosuggestComponent/AutosuggestComponent';
import PropertyData from '../../../components/PropertyData/PropertyData';
import DateFilter from '../../../components/DateFilter/DateFilter';
import PostList from '../../../components/Post/PostList/PostList';
import AddPost from '../../../components/Post/AddPost/AddPost';
import AlertComponent from '../../../components/AlertComponent/AlertComponent';
import { setPosts, setPostTypes } from '../../../actions/postActions';
import { setPropertyData } from '../../../actions/propertyActions';
import { setLoader } from '../../../actions/loaderActions';
import { selectRoutes } from '../../../actions/routes';
import { setWaypoints, setProperties } from '../../../actions/mapActions';
import './RouteStopForm.css';

const mapStateToProps = state => ({
  posts: state.posts,
  property_data: state.property,
  postTypes: state.postTypes,
  selectedRoutePoints: state.routes.selectedRoutePoints,
  selectedSingleRoute: state.routes.selectedSingleRoute,
  waypoints: state.map.waypoints,
  properties: state.map.properties,
});

const mapDispatchToProps = {
  setPropertyData,
  setPosts,
  setLoader,
  setPostTypes,
  selectRoutes,
  setWaypoints,
  setProperties,
};

class RouteStop extends Component {
  componentDidMount() {
    this.initRoutes();
  }

  setProp = (id, coords) => {
    let isRepeated = false;
    let newPropForMap = [];
    if (this.props.properties.length) {
      newPropForMap = this.props.properties.map(item => {
        if (item.id === id) {
          isRepeated = true;
        }
        return item;
      });
    }
    if (!isRepeated) {
      newPropForMap.push({ id, coords });
      this.props.setProperties(newPropForMap);
    }
  };

  initRoutes = () => {
    this.props.setPropertyData({});
  };

  saveRouteStop = () => {
    if (!this.checkForSamePoint()) {
      const propData = this.props.property_data;
      const selectedRoutes = this.props.selectedRoutePoints.concat([
        this.props.selectedSingleRoute,
      ]);
      const selectedWaypoints = this.props.waypoints.concat([
        this.prepareGeoData(this.props.waypoints.length),
      ]);
      this.props.setWaypoints(selectedWaypoints);
      this.props.selectRoutes(selectedRoutes);
      this.props.turnOffRouteForm();
      this.setProp(propData.id, propData.geo_location.geometry.coordinates);
    }
  };

  changeRouteStop = () => {
    if (!this.checkForSamePoint()) {
      let index = -1;
      const propData = this.props.property_data;
      const selectedRoutes = this.props.selectedRoutePoints.map((item, i) => {
        if (item.postId === this.props.point.postId) {
          index = i;
        }
        return item;
      });
      selectedRoutes.splice(index, 1, this.props.selectedSingleRoute);
      const selectedWaypoints = this.props.waypoints.map((item, i) => {
        if (i === index) {
          return this.prepareGeoData(index);
        }
        return item;
      });
      this.props.setWaypoints(selectedWaypoints);
      this.props.selectRoutes(selectedRoutes);
      this.props.exitEditMode();
      this.setProp(propData.id, propData.geo_location.geometry.coordinates);
    }
  };

  prepareGeoData = index => {
    const coord = this.props.property_data.geo_location.geometry.coordinates;
    return {
      id: index,
      lat: coord[0],
      lng: coord[1],
    };
  };

  checkForSamePoint = () => {
    let samePoint = false;
    this.props.selectedRoutePoints.forEach(item => {
      if (item.postId === this.props.selectedSingleRoute.postId) {
        samePoint = true;
      }
    });
    if (samePoint) {
      this.child.handleShow(
        'You are trying to add the same route stop. Please, choose another one!'
      );
    }
    return samePoint;
  };

  resetRouteForm = () => {
    if (this.props.selectedRoutePoints.length) {
      this.props.turnOffRouteForm();
    }
    this.props.resetSelectedProperty();
    this.props.resetSelectedPoint();
  };

  render() {
    return (
      <div className="route-stop">
        <div className="route-stop-header">
          <h1 className="routes-header">Insert Route Stop</h1>
          <ButtonToolbar>
            <Button
              bsSize="large"
              onClick={this.props.exitEditMode}
              className={`button-main ${this.props.editMode ? '' : 'hidden'}`}
            >
              cancel
            </Button>
            <Button
              bsSize="large"
              onClick={this.resetRouteForm}
              disabled={!this.props.property_data.id}
              className={`button-main ${this.props.editMode ? 'hidden' : ''}`}
            >
              cancel
            </Button>
            <Button
              bsSize="large"
              disabled={!this.props.selectedSingleRoute.postId}
              onClick={this.saveRouteStop}
              className={`button-main ${this.props.editMode ? 'hidden' : ''}`}
            >
              save
            </Button>
            <Button
              bsSize="large"
              disabled={!this.props.selectedSingleRoute.postId}
              onClick={this.changeRouteStop}
              className={`button-main ${this.props.editMode ? '' : 'hidden'}`}
            >
              save
            </Button>
          </ButtonToolbar>
        </div>
        <AlertComponent
          ref={instance => {
            this.child = instance;
          }}
        />
        <form className="route-stop-form">
          <Grid>
            <Row className="show-grid">
              <Col lg={12} md={12} sm={12} xs={12}>
                <label htmlFor="autosuggest" className="routes-label">
                  building name
                </label>
                <div className="insert-building">
                  <AutosuggestComponent
                    id="autosuggest"
                    suggestionType="property"
                    placeholder="Insert building"
                    getAllData={this.props.getAllData}
                  />
                </div>
              </Col>
            </Row>
          </Grid>
        </form>
        <div className={`${this.props.property_data.id ? '' : 'hidden'}`}>
          <h2 className="routes-header color-main text-center">
            Select moment in time line or post your moment
          </h2>
          <PropertyData property_data={this.props.property_data} />
          <DateFilter />
          <AddPost urlData={this.props.match} isItRoutes />
          <PostList isItRoutes />
        </div>
      </div>
    );
  }
}

RouteStop.defaultProps = {
  postId: null,
  selectedRoutePoints: [],
  waypoints: [],
  properties: [],
  selectedSingleRoute: null,
  property_data: null,
  turnOffRouteForm: null,
  exitEditMode: null,
  editMode: null,
  getAllData: null,
  resetSelectedProperty: null,
  resetSelectedPoint: null,
  point: null,
  match: null,
};
RouteStop.propTypes = {
  setPropertyData: PropTypes.func.isRequired,
  selectRoutes: PropTypes.func.isRequired,
  getAllData: PropTypes.func,
  turnOffRouteForm: PropTypes.func,
  exitEditMode: PropTypes.func,
  setWaypoints: PropTypes.func.isRequired,
  setProperties: PropTypes.func.isRequired,
  postId: PropTypes.number,
  editMode: PropTypes.bool,
  resetSelectedProperty: PropTypes.func,
  resetSelectedPoint: PropTypes.func,
  selectedRoutePoints: PropTypes.instanceOf(Array),
  properties: PropTypes.instanceOf(Array),
  waypoints: PropTypes.instanceOf(Array),
  selectedSingleRoute: PropTypes.instanceOf(Object),
  property_data: PropTypes.instanceOf(Object),
  point: PropTypes.instanceOf(Object),
  match: ReactRouterPropTypes.match,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteStop);
