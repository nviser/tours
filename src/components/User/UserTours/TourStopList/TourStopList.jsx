import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setLoader } from '../../../../actions/loaderActions';
import Header from '../../../../components/Header/Header';
import { setTourEditable } from '../../../../actions/routes';
//import Footer from '../../../../components/Footer/Footer';
import TourSteps from '../TourSteps/TourSteps';
import TourPoint from './TourPoint/TourPoint';
import MapPanel from '../../../MapPanel/MapPanel';
import ApiService from '../../../../services/ApiService/ApiService';
import {
  userToursPath,
  tourStopPath,
  routesApiPath,
  postsPath,
  tourPreview,
  routesPath,
  waypointsApiPath,
  tourInfoPath,
} from '../../../../utils/paths';
import './TourStopList.css';
import Modal from '../../../UI/Modal/Modal';
import {
  setWaypoints,
  setPoint,
  setRouteStopMarker,
} from '../../../../actions/mapActions';
import { setPosts } from '../../../../actions/postActions';
import TourPointMeasure from './TourPointMeasure/TourPointMeasure';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';
import BottomNavigationPanel from '../BottomNavigationPanel/BottomNavigationPanel';
import ModalContent from '../FavoriteTours/ModalContent/ModalContent';
import HeaderMobile from '../../../HeaderMobile/HeaderMobile';

const mapStateToProps = state => ({
  auth: state.auth,
  editedRouteId: state.routes.editedRouteId,
  totalRouteStop: state.map.totalRouteStop,
  points: state.map.points,
  properties: state.map.properties,
  routeStopParams: state.map.routeStopParams,
  waypoints: state.map.waypoints,
  totalDistance: state.map.totalDistance,
  posts: state.posts,
  routeTitle: state.routes.routeTitle,
  selectedSingleRoute: state.routes.selectedSingleRoute,
});

const mapDispatchToProps = {
  setLoader,
  setWaypoints,
  setPosts,
  setPoint,
  setRouteStopMarker,
  setTourEditable,
};

const SortableRouteStopItem = SortableElement(
  ({ value, instance, count, lastEl, posts, index, removePoint }) => (
    <div
      className={`route-sortable-element ${
        lastEl ? 'last-sortable-element' : ''
      }`}
    >
      <TourPoint
        key={value.postId || value.id}
        number={count + 1}
        postData={value}
        getAllData={instance.getAllData}
        resetSelectedProperty={instance.resetSelectedProperty}
        editRouteStop={instance.editRouteStop}
        posts={posts}
        removePoint={id => removePoint(id)}
      />
      <TourPointMeasure posts={posts} number={count} key={index} />
    </div>
  )
);

const SortableRouteStopPoints = SortableContainer(
  ({ items, instance, removePoint }) => (
    <div className="route-sortable">
      {items.map((item, index) => (
        <SortableRouteStopItem
          key={`item-${index}`}
          index={index}
          count={index}
          value={item}
          lastEl={items.length === index}
          instance={instance}
          posts={items}
          removePoint={id => removePoint(id)}
        />
      ))}
    </div>
  )
);

const TourStopList = withRouter(props => <TourStopListComponent {...props} />);

class TourStopListComponent extends Component {
  state = {
    posts: [],
    modal: false,
    postId: 0,
    route: null,
  };

  componentDidMount() {
    this.prepareInitData();
  }

  prepareInitData = async () => {
    const draftTourData = localStorage.getItem('draftTourCreateData');
    // console.log('Draft', draftTourData);
    if (draftTourData) {
      this.DRAFT_TOUR_DATA = JSON.parse(draftTourData);
      this.getRouteData();
    }
    await this.getPointStops();
    this.refreshWaypoints();

    setTimeout(() => {
      const arr = [];
      this.props.posts.forEach((post, i) => {
        this.props.properties.forEach(val => {
          if (post.property_id === val.id) {
            arr.push({
              id: i,
              lat: val.coords[1],
              lng: val.coords[0],
            });
          }
        });
        return post;
      });
      this.props.setWaypoints(arr);
    }, 1000);
  };

  getRouteData = async () => {
    const { tourId } = this.DRAFT_TOUR_DATA;
    this.props.setLoader(true);
    this.ApiService.getComponent(`${routesPath}/${tourId}`)
      .then(response => {
        this.setState({ route: response.data });
        this.props.setLoader(false);
      })
      .catch(e => {
        this.props.setLoader(false);
      });
  };

  refreshWaypoints = () => {
    let waypoints = [...this.props.waypoints];
    if (waypoints.length) {
      this.props.setRouteStopMarker({
        coords: [waypoints[0]['lat'], waypoints[0]['lng']],
      });
    }
  };

  getPointStops = () => {
    return new Promise((resolve, reject) => {
      if (this.DRAFT_TOUR_DATA) {
        const { tourId } = this.DRAFT_TOUR_DATA;
        this.props.setLoader(true);
        this.ApiService.getComponent(`${routesApiPath}/${tourId}`)
          .then(res => {
            this.props.setLoader(false);
            this.setState({
              posts: res.data.posts,
            });

            this.props.setPosts(res.data.posts);
            resolve();
          })
          .catch(() => {
            this.props.setLoader(false);
            reject();
          });
      }
    });
  };

  createStopPoint = () => {
    this.props.history.push(tourStopPath);
  };

  goTo = path => {
    this.attachWayPointToTour();
  };
  goToBack = path => {
    this.props.history.push(path);
  };
  attachWayPointToTour = () => {
    const { tourId } = this.DRAFT_TOUR_DATA;
    const data = this.props.points;
    this.ApiService.sendComponent(
      { points: data },
      `${routesApiPath}/${tourId}/waypoints`
    )
      .then(response => {
        this.props.setLoader(false);
        this.props.history.push(tourPreview);
        // this.updateDistance()
      })
      .catch(() => {
        this.props.setLoader(false);
      });
  };
  updateDistance = () => {
    // let propsParams = [...this.props.routeStopParams];
    // let posts = [...this.props.posts]
    // let distances = propsParams.map((prop, index) => {
    //   return {
    //     post_id: posts[index]['id'],
    //     distance: prop.distance.text.slice(0, 1),
    //     time: prop.duration.text.slice(0, 1),
    //   }
    // })
    //   this.props.setLoader(true);
    // this.ApiService.sendComponent(distances, `${routesApiPath}/${this.props.editedRouteId}/update-distances`)
    //   .then((response) => {
    //     this.props.setLoader(false);
    //     this.props.history.push(tourPreview);
    //   })
    //   .catch((e) => {
    //     console.log(e)
    //     this.props.setLoader(false);
    //   });
  };

  ApiService = new ApiService();
  closeModalHandler = () => {
    this.setState({ modal: false });
  };
  deleteStopHandler = () => {
    this.props.setLoader(true);
    this.ApiService.deleteComponent(`${postsPath}/${this.state.postId}`)
      .then(response => {
        this.props.setLoader(false);
        let posts = [...this.state.posts];
        let newPosts = posts.filter(post => post.id !== this.state.postId);
        let waypoints = [...this.props.waypoints];
        let newWaypoints = waypoints.filter(
          waypoint => waypoint.id !== this.state.postId
        );
        this.props.setWaypoints(newWaypoints);
        let points = newWaypoints.map(point => {
          return [point.lng, point.lat];
        });
        this.props.setPoint(points);
        this.props.setPosts(newPosts);
        this.setState({ posts: newPosts, modal: false });
      })
      .catch(e => {
        this.props.setLoader(false);
      });
  };
  removePoint = id => {
    this.setState({ postId: id, modal: true });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.props.setPosts(arrayMove(this.props.posts, oldIndex, newIndex));
    const arr = [];
    this.props.posts.forEach((post, i) => {
      this.props.properties.forEach(val => {
        if (post.property_id === val.id) {
          arr.push({
            id: i,
            lat: val.coords[1],
            lng: val.coords[0],
          });
        }
      });
      return post;
    });
    this.props.setWaypoints(arr);
    let newPoints = this.createNewPoints(arr);
    this.props.setPoint(newPoints);
    this.prepareRouteData();
  };

  createNewPoints = arr => {
    return arr.map(a => [a.lng, a.lat]);
  };
  prepareRouteData = () => {
    const { route } = this.state;
    const ids = this.props.posts.map(item => item.id);
    const data = {
      posts: ids,
      name: this.props.selectedSingleRoute.name,
      summary: this.props.selectedSingleRoute.summary,
      age_ids: this.props.selectedSingleRoute.age_ids,
      category_ids: this.props.selectedSingleRoute.category_ids,
    };
    if (route) {
      data.name = route.name;
      data.summary = route.summary;
    }

    this.updateRoute(data);
  };
  updateRoute = data => {
    const { tourId } = this.DRAFT_TOUR_DATA;
    // console.log('trying to update rout data', data, this.state);
    this.ApiService.putComponent(data, `${routesPath}/${tourId}`)
      .then(res => {
        this.setWaypoints();
      })
      .catch(err => {});
  };

  setWaypoints = () => {
    const { tourId } = this.DRAFT_TOUR_DATA;
    this.ApiService.sendComponent(
      this.prepareWaypointsData(),
      `${routesApiPath}/${tourId}${waypointsApiPath}`
    ).then(() => {});
  };

  prepareWaypointsData = () => ({
    points: this.props.waypoints.map(item => [item.lng, item.lat]),
  });

  render() {
    return (
      <div className="stop-list-page">
        <div className="stop-list-wrap">
          <HeaderMobile />
          <Header hideSearch />
          <div className="stop-list-container">
            <Grid componentClass="container-fluid">
              <Row className="show-grid no-margin">
                <Col lg={6} md={6} sm={12} className="left-block">
                  <div className="left-panel">
                    <div className="stop-list-main-block">
                      <TourSteps stepActive="2" />
                      <div className="stop-item-list">
                        <SortableRouteStopPoints
                          items={this.props.posts}
                          instance={this}
                          onSortEnd={this.onSortEnd}
                          distance={5}
                          helperClass="draggable"
                          lockToContainerEdges
                          lockAxis="y"
                          removePoint={id => this.removePoint(id)}
                        />
                      </div>
                      <div className="stop-title" />
                      <div
                        className="stop-point-add"
                        onClick={this.createStopPoint}
                      >
                        <span className="add-text">
                          {this.props.posts.length
                            ? 'Add stop'
                            : 'Add first stop'}
                        </span>
                        <i className="fa fa-plus-circle" />
                      </div>
                    </div>
                  </div>
                  <BottomNavigationPanel
                    backHandler={() => this.goToBack(tourInfoPath)}
                    path={'/tours'}
                    nextHandler={() => this.goTo(userToursPath)}
                    disabled={!this.props.totalRouteStop}
                    btnName="next"
                    btnCancelTitle="Back"
                  />
                </Col>
                <Col lg={6} md={6} sm={12} className="rigth-panel">
                  <MapPanel routeStop={false} />
                </Col>
              </Row>
            </Grid>
          </div>
          <Modal show={this.state.modal}>
            <ModalContent
              cancelHandler={this.closeModalHandler}
              doneHandler={this.deleteStopHandler}
              modalTitle="Are you sure you want to delete tour stop?"
            />
          </Modal>
        </div>
        {/*<Footer />*/}
      </div>
    );
  }
}
TourStopListComponent.defaultProps = {
  auth: null,
};

TourStopListComponent.propTypes = {
  auth: PropTypes.instanceOf(Object),
  setLoader: PropTypes.func.isRequired,
  editedRouteId: PropTypes.number,
  history: ReactRouterPropTypes.history.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TourStopList);
