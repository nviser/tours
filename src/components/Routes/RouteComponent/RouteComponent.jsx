import React, { Component } from 'react';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import withAuth from '../../../services/withAuth/withAuth';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import InfoPannel from '../../../components/InfoPannel/InfoPannel';
import RouteTitle from '../RouteTitle/RouteTitle';
import RouteStopForm from '../RouteStopForm/RouteStopForm';
import RouteStopPoint from '../RouteStopPoint/RouteStopPoint';
import ApiService from '../../../services/ApiService/ApiService';
import { setPosts, setPostTypes } from '../../../actions/postActions';
import { setPropertyData } from '../../../actions/propertyActions';
import { setCompanyData } from '../../../actions/companyActions';
import { setLoader } from '../../../actions/loaderActions';
import { setSelectedPropertySuggestions } from '../../../actions/suggestActions';
import {
  selectSingleRoute,
  selectRoutes,
  setEditedRouteId,
  setRouteTitle,
} from '../../../actions/routes';
import { setWaypoints, setProperties } from '../../../actions/mapActions';
import { propertiesPath, postsPath, postTypesPath } from '../../../utils/paths';
import '../Routes.css';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';

const mapStateToProps = state => ({
  posts: state.posts,
  company_data: state.company,
  property_data: state.property,
  postTypes: state.postTypes,
  selectedRoutePoints: state.routes.selectedRoutePoints,
  editedRouteId: state.routes.editedRouteId,
  waypoints: state.map.waypoints,
  properties: state.map.properties,
});

const mapDispatchToProps = {
  setCompanyData,
  setPosts,
  setLoader,
  setPostTypes,
  setPropertyData,
  setSelectedPropertySuggestions,
  selectSingleRoute,
  setWaypoints,
  selectRoutes,
  setProperties,
  setEditedRouteId,
  setRouteTitle,
};

const SortableRouteStopItem = SortableElement(
  ({ value, instance, count, lastEl }) => (
    <div
      style={{ overflow: 'hidden' }}
      className={`route-sortable-element ${
        lastEl ? 'last-sortable-element' : ''
      }`}
    >
      <RouteStopPoint
        key={value.postId || value.id}
        number={count}
        point={value}
        getAllData={instance.getAllData}
        resetSelectedProperty={instance.resetSelectedProperty}
        editRouteStop={instance.editRouteStop}
      />
    </div>
  )
);

const SortableRouteStopPoints = SortableContainer(({ items, instance }) => (
  <div className="route-sortable">
    {items.map((item, index) => (
      <SortableRouteStopItem
        key={`item-${index}`}
        index={index}
        count={index}
        value={item}
        lastEl={items.length === index + 1}
        instance={instance}
      />
    ))}
  </div>
));

const Route = withRouter(props => <RouteComponent {...props} />);

class RouteComponent extends Component {
  state = {
    routeStopForm: true,
  };

  componentDidMount() {
    this.handleShowRouteStopForm();
  }

  componentWillUnmount() {
    this.props.setSelectedPropertySuggestions({});
    this.props.selectRoutes([]);
    this.props.setProperties([]);
    this.props.setRouteTitle('');
    this.props.setWaypoints([]);
    this.props.selectSingleRoute({});
    this.props.setEditedRouteId(null);
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.props.selectRoutes(
      arrayMove(this.props.selectedRoutePoints, oldIndex, newIndex)
    );
    const ar = [];
    this.props.selectedRoutePoints.forEach((item, i) => {
      this.props.properties.forEach(val => {
        if (item.propertyId === val.id) {
          ar.push({
            id: i,
            lat: val.coords[0],
            lng: val.coords[1],
          });
        }
      });
      return item;
    });

    this.props.setWaypoints(ar);
  };

  getAllData = (propertyId, selectedPostId) => {
    this.getData(propertyId, selectedPostId);
    this.getPostTypes();
  };

  setSelectedPost = (selectedPostId, posts) => {
    const changedPosts = posts.map(item => {
      if (item.id === selectedPostId) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return item;
    });
    this.props.setPosts(changedPosts);
  };

  getData = (propertyId, selectedPostId) => {
    this.props.setLoader(true);
    Promise.all([
      this.getPropertyData(`${propertiesPath}/${propertyId}`),
      this.getPropertyPosts(`${propertiesPath}/${propertyId}/posts`),
    ])
      .then(values => {
        this.props.setPropertyData(values[0].data);
        window.scrollTo(0, 0);
        if (selectedPostId) {
          this.setSelectedPost(selectedPostId, values[1].data);
        } else {
          this.props.setPosts(values[1].data);
        }
        this.props.setLoader(false);
        this.props.setSelectedPropertySuggestions({
          value: this.props.property_data.name,
        });
      })
      .catch(err => {
        if (err && err.response && err.response.data.errors) {
        }
        this.props.setLoader(false);
      });
  };

  getPostTypes = () => {
    if (this.props.postTypes && !this.props.postTypes.length) {
      this.ApiService.getComponent(`${postsPath}${postTypesPath}`).then(res => {
        this.props.setPostTypes(res.data);
      });
    }
  };

  getPropertyData = url => this.ApiService.getComponentPosts(url);

  getPropertyPosts = url => this.ApiService.getComponentPosts(url);

  editRouteStop = postId => {
    const editedRouteStops = this.props.selectedRoutePoints.map(item => {
      if (postId === item.postId) {
        return {
          ...item,
          editModeEnabled: true,
        };
      }
      return {
        ...item,
        editModeEnabled: false,
      };
    });
    this.props.selectRoutes(editedRouteStops);
    this.setState({
      routeStopForm: false,
    });
  };

  ApiService = new ApiService();

  handleShowRouteStopForm() {
    if (
      this.props.selectedRoutePoints &&
      this.props.selectedRoutePoints.length
    ) {
      this.setState({
        routeStopForm: false,
      });
    }
  }

  turnOffRouteForm = () => {
    this.setState({
      routeStopForm: false,
    });
  };

  turnOnRouteForm = () => {
    this.editRouteStop(-1);
    this.props.setSelectedPropertySuggestions({});
    this.props.selectSingleRoute({});
    this.setState({
      routeStopForm: true,
    });
  };

  resetSelectedProperty = () => {
    this.props.setPropertyData({});
  };

  resetSelectedPoint = () => {
    this.props.selectSingleRoute({});
  };

  shouldCancelStart = () => {
    for (let i = 0; i < this.props.selectedRoutePoints.length; i++) {
      if (this.props.selectedRoutePoints[i].editModeEnabled) {
        return true;
      }
    }
    return false;
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
                <RouteTitle />
                <SortableRouteStopPoints
                  items={props.selectedRoutePoints}
                  instance={this}
                  onSortEnd={this.onSortEnd}
                  distance={5}
                  helperClass="draggable"
                  lockToContainerEdges
                  shouldCancelStart={this.shouldCancelStart}
                  lockAxis="y"
                />
                {this.state.routeStopForm && (
                  <RouteStopForm
                    className={`${this.state.routeStopForm ? '' : 'hidden'}`}
                    turnOffRouteForm={this.turnOffRouteForm}
                    getAllData={this.getAllData}
                    resetSelectedProperty={this.resetSelectedProperty}
                    resetSelectedPoint={this.resetSelectedPoint}
                  />
                )}
                <div
                  className={`route-point-add ${
                    props.selectedRoutePoints.length &&
                    !this.state.routeStopForm
                      ? ''
                      : 'hidden'
                  }`}
                  onClick={this.turnOnRouteForm}
                >
                  +
                </div>
              </Col>
              <Col lg={5} md={5} sm={5} xs={5} className="logged-right-panel">
                <InfoPannel isItRouteComponent />
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

RouteComponent.defaultProps = {
  postTypes: [],
  selectedRoutePoints: [],
  markersRaw: [],
  waypoints: [],
  properties: [],
  editedRouteId: null,
  property_data: null,
};
RouteComponent.propTypes = {
  setPosts: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  setPropertyData: PropTypes.func.isRequired,
  setWaypoints: PropTypes.func.isRequired,
  setEditedRouteId: PropTypes.func.isRequired,
  setSelectedPropertySuggestions: PropTypes.func.isRequired,
  selectRoutes: PropTypes.func.isRequired,
  setProperties: PropTypes.func.isRequired,
  setRouteTitle: PropTypes.func.isRequired,
  selectSingleRoute: PropTypes.func.isRequired,
  postTypes: PropTypes.instanceOf(Array),
  property_data: PropTypes.instanceOf(Object),
  waypoints: PropTypes.instanceOf(Array),
  selectedRoutePoints: PropTypes.instanceOf(Array),
  markersRaw: PropTypes.instanceOf(Array),
  properties: PropTypes.instanceOf(Array),
  setPostTypes: PropTypes.func.isRequired,
  editedRouteId: PropTypes.number,
};
export default withAuth(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Route)
);
