import React, { Component } from 'react';
import Header from '../../../../components/Header/Header';
//import Footer from '../../../../components/Footer/Footer';
import { Grid, Row, Col } from 'react-bootstrap';
import TourSteps from '../TourSteps/TourSteps';
import MapPanel from '../../../MapPanel/MapPanel';
import { connect } from 'react-redux';
import RouteInfo from './RouteInfo/RouteInfo';
import {
  routesApiPath,
  tourStopListPath,
  tourCreateSuccess,
} from '../../../../utils/paths';
import ApiService from '../../../../services/ApiService/ApiService';
import TourPoint from '../TourStopList/TourPoint/TourPoint';
import './TourPreview.css';
import TourPointMeasure from '../TourStopList/TourPointMeasure/TourPointMeasure';
import PostInfo from './PostInfo/PostInfo';
import { resetMapData } from '../../../../actions/mapActions';
import { setPosts } from '../../../../actions/postActions';
import { setEditedRouteId, setTourEditable } from '../../../../actions/routes';
import BottomNavigationPanel from '../BottomNavigationPanel/BottomNavigationPanel';
import { setLoader } from '../../../../actions/loaderActions';
import HeaderMobile from '../../../HeaderMobile/HeaderMobile';

class TourPreview extends Component {
  state = {
    posts: [],
    postId: 0,
  };
  componentDidMount = () => {
    const draftTourData = localStorage.getItem('draftTourCreateData');
    // console.log('Draft', draftTourData);
    if (draftTourData) {
      this.DRAFT_TOUR_DATA = JSON.parse(draftTourData);
      this.getPointStops();
    }
  };

  ApiService = new ApiService();
  getPointStops = () => {
    if (this.DRAFT_TOUR_DATA) {
      const { tourId } = this.DRAFT_TOUR_DATA;
      this.props.setLoader(true);
      this.ApiService.getComponent(`${routesApiPath}/${tourId}`)
        .then(res => {
          this.props.setLoader(false);
          this.setState({
            posts: res.data.posts,
          });
        })
        .catch(() => this.props.setLoader(false));
    }
  };

  clickHandler = id => {
    this.setState(prevState => {
      return {
        postId: prevState.postId !== id ? id : 0,
      };
    });
  };

  calculateAndUpdateDistances = () => {
    let propsParams = [...this.props.routeStopParams];
    let posts = [...this.state.posts];
    let distances = propsParams.map((prop, index) => {
      return {
        post_id: posts[index]['id'],
        distance: prop.distance.value, // value is always in meters
        time: prop.duration.value, // ? always in seconds ?
      };
    });
    this.props.setLoader(true);
    const { tourId } = this.DRAFT_TOUR_DATA;
    return this.ApiService.sendComponent(
      { distances: distances },
      `${routesApiPath}/${tourId}/update-distances`
    );
  };

  goTo = path => {
    this.calculateAndUpdateDistances()
      .then(() => {
        return this.changeRouteStatus();
      })
      .then(() => {
        this.props.setLoader(false);
        this.props.resetMapData();
        this.props.setPosts([]);
        this.props.setEditedRouteId(null);
        this.props.setTourEditable(false);
        this.props.history.push(path);
      })
      .catch(err => {
        this.props.setLoader(false);
        console.log(err);
      });
  };
  goBack = path => {
    this.props.history.push(path);
  };

  changeRouteStatus = () => {
    const { tourId } = this.DRAFT_TOUR_DATA;
    localStorage.removeItem('draftTourCreateData');
    return this.ApiService.patchComponent(
      { is_completed: true },
      `/routes/${tourId}`
    );
  };
  render() {
    return (
      <div className="stop-page">
        <div className="stop-wrap">
          <HeaderMobile />
          <Header hideSearch />
          <div className="stop-container container">
            <Grid componentClass="container-fluid">
              <Row className="show-grid">
                <Col lg={6} md={6} sm={12} className="left-block">
                  <div className="left-panel">
                    <div className="stop-list-main-block">
                      <TourSteps stepActive="3" />
                      <RouteInfo />
                      <div className="stop-list-posts">
                        {this.state.posts &&
                          this.state.posts.map((item, index) => (
                            <React.Fragment key={item.id}>
                              <div
                                className={
                                  this.state.postId === item.id
                                    ? 'tour-point-wrapper-show'
                                    : 'tour-point-wrapper-hide'
                                }
                              >
                                <TourPoint
                                  posts={this.state.posts}
                                  index={index}
                                  number={index + 1}
                                  postData={item}
                                  active={this.state.postId === item.id}
                                  notEditable
                                  clickHandler={id => this.clickHandler(id)}
                                  // removePoint={(id) => this.removePoint(id)}
                                />
                                <div
                                  className={
                                    this.state.postId === item.id
                                      ? 'tour-point-more-show'
                                      : 'tour-point-more-hide'
                                  }
                                >
                                  <PostInfo
                                    post={item}
                                    active={this.state.postId === item.id}
                                  />
                                </div>
                              </div>
                              <TourPointMeasure
                                posts={this.state.posts}
                                number={index}
                                key={index}
                              />
                            </React.Fragment>
                          ))}
                      </div>
                      {/* <div className="stop-bottom">
                                            <button className="btn-back button-main" onClick={() => this.goBack(tourStopListPath)}>back</button>
                                            <button className="btn-next button-main" onClick={() => this.goTo(tourCreateSuccess)}> publish </button>
                                        </div> */}
                    </div>
                  </div>
                  <BottomNavigationPanel
                    backHandler={() => this.goBack(tourStopListPath)}
                    path={'/tours'}
                    nextHandler={() => this.goTo(tourCreateSuccess)}
                    btnName="publish"
                    btnCancelTitle="Back"
                  />
                </Col>
                <Col lg={6} md={6} sm={12} className="right-panel">
                  <MapPanel routeStop={false} />
                </Col>
              </Row>
            </Grid>
          </div>
          {/*<Footer /> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    editedRouteId: state.routes.editedRouteId,
    routeStopParams: state.map.routeStopParams,
  };
};
const mapDispatchToProps = {
  setLoader,
  resetMapData,
  setEditedRouteId,
  setPosts,
  setTourEditable,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TourPreview);
