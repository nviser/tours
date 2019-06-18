import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import ReactImageFallback from 'react-image-fallback';
import Modal from '../../../UI/Modal/Modal';
import ReviewItem from './ReviewItem/ReviewItem';
import WarnItem from './WarnItem/WarnItem';
import BuyBlock from './BuyBlock/BuyBlock';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { setLoader } from '../../../../actions/loaderActions';
import {
  setWaypoints,
  setRouteStopMarker,
} from '../../../../actions/mapActions';
import { setEditedRouteId, setTourEditable } from '../../../../actions/routes';
import Header from '../../../../components/Header/Header';
import AuthService from '../../../../services/AuthService/AuthService';
//import Footer from '../../../../components/Footer/Footer';
import MapPanel from '../../../MapPanel/MapPanel';
import TourDetailsItem from './TourDetailsItem/TourDetailsItem';
import ReactSVG from 'react-svg';
import StarsRating from '../../../UI/StarsRating/StarsRating';
import ApiService from '../../../../services/ApiService/ApiService';
import {
  routesApiPath,
  tourInfoPath,
  reviewsPath,
  addFavApiPath,
  removeFavApiPath,
} from '../../../../utils/paths';
import noImg from '../../../../assets/img/icons/no-photo.png';
import loader from '../../../../assets/img/loading.gif';
import { API_URL, REDIR_URL } from '../../../../config';
import backArrow from '../../../../assets/img/merchant/back.png';
import shareImg from '../../../../assets/img/share.svg';
import heartEmptyImg from '../../../../assets/img/heart.svg';
import heartImg from '../../../../assets/img/heart-solid.svg';
import markerImg from '../../../../assets/img/merchant/pin.svg';
import fbImg from '../../../../assets/img/facebook_icon.svg';
import twitImg from '../../../../assets/img/merchant/twitter_share.svg';
import './TourDetails.css';
import HeaderMobile from '../../../HeaderMobile/HeaderMobile';

const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.auth.userData,
  isLoggedIn: state.auth.isLoggedIn,
  isLoading: state.loader.isLoading,
  propertyData: state.suggest.selectedPropertySuggestion,
  editedRouteId: state.routes.editedRouteId,
  suggestedValue: state.suggest.selectedPropertySuggestion.value,
  routeStopMarker: state.map.routeStopMarker,
  waypoints: state.map.waypoints,
  points: state.map.points,
  propertyValue: state.suggest.selectedPropertySuggestion.value,
  multimedia: state.tours.multimedia,
  photos: state.tours.photos,
  company: state.company,
});

const mapDispatchToProps = {
  setLoader,
  setWaypoints,
  setRouteStopMarker,
  setEditedRouteId,
  setTourEditable,
};

class TourDetails extends Component {
  state = {
    data: null,
    mobilityIcon: null,
    show: false,
    reviews: [],
    isFavorite: false,
    isEditable: false,
    isPurchased: false,
    posts: [],
    morePosts: 0,
    token: null,
    tourCreator: {},
  };

  componentDidMount() {
    this.getTourById(this.props.match.params.id);
    this.getReviews(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.setMapWaypoints([]);
  }

  prepareData = data => {
    this.setState({
      data: data,
      mobilityIcon: data.mobility.icon,
      isFavorite: data.is_favorite,
      isEditable: data.posted_by.id === this.props.userData.id,
      tourCreator: this.resolveTourCreatorInfo(data),
    });
    if (this.checkForBuy(data) || !data.cost) {
      this.setState({
        isPurchased: true,
        posts: data.posts,
      });
      this.setMapWaypoints(data.waypoint.geometry.coordinates);
    } else {
      this.setState({
        posts: data.posts.slice(0, 3),
        morePosts: data.posts.length - 3 <= 0 ? 0 : data.posts.length - 3,
      });
      this.setMapWaypoints(data.waypoint.geometry.coordinates.slice(0, 3));
    }
    this.setMapMarker(data.waypoint.geometry.coordinates);
    this.props.setLoader(false);
  };

  getTourById = id => {
    this.props.setLoader(true);
    const str_url = this.props.location.search,
      token = str_url.substr(7, str_url.length);
    if (token) {
      this.setState({ token });
      this.ApiService.getComponentByToken(`${routesApiPath}/${id}`, token) // admin get access for inactive tours by admin token
        .then(res => {
          this.prepareData(res.data);
        })
        .catch(err => {
          console.log(err);
          this.props.setLoader(false);
          this.props.history.push(`/tour_${id}_not_available`);
        });
    } else {
      this.ApiService.getComponent(`${routesApiPath}/${id}`) //or regular user
        .then(res => {
          console.log(res.data);
          this.prepareData(res.data);
        })
        .catch(err => {
          console.log(err);
          this.props.setLoader(false);
          this.props.history.push(`/tour_${id}_not_available`);
        });
    }
  };

  checkForBuy = data => {
    const takenBy = data.taken_by,
      takenByLen = data.taken_by.length;
    if (data.posted_by.id === this.props.userData.id) {
      return true;
    } else {
      for (let i = 0; i < takenByLen; i++) {
        if (this.props.userData.id === takenBy[i].id) {
          return true;
        }
      }
      return false;
    }
  };
  getReviews = id => {
    this.ApiService.getComponent(`${reviewsPath(id)}`)
      .then(res => {
        this.setState({
          reviews: res.data,
        });
      })
      .catch(err => console.log(err));
  };

  setMapWaypoints = coords => {
    const waypoints = coords.map(item => {
      return {
        lat: item[1],
        lng: item[0],
      };
    });
    this.props.setWaypoints(waypoints);
  };

  setMapMarker = coords => {
    console.log(coords);
    if (coords && coords.length > 0) {
      const marker = {
        palceId: '',
        coords: [coords[0][1], coords[0][0]],
      };
      this.props.setRouteStopMarker(marker);
    }
  };

  onChange = (value, name) => {
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      },
    });
  };

  goTo = path => {
    this.props.history.push(path);
  };

  categories = cats => {
    if (cats.length) {
      return cats
        .map(item => {
          return item.name;
        })
        .join(', ');
    } else {
      return 'No data';
    }
  };

  editRoute = id => {
    this.props.setEditedRouteId(id);
    this.props.setTourEditable(true);
    this.props.history.push(tourInfoPath);
  };

  goBack = () => {
    this.props.history.goBack();
  };

  goToAgentPage = id => {
    this.props.history.push(`/agent/${id}`);
  };

  handleFavorite = (routeId, path) => {
    const data = { route_id: routeId };
    this.props.setLoader(true);
    this.ApiService.sendComponent(data, path)
      .then(res => {
        this.props.setLoader(false);
        if (path === addFavApiPath) {
          this.setState({
            isFavorite: true,
          });
        } else {
          this.setState({
            isFavorite: false,
          });
        }
      })
      .catch(() => {
        this.props.setLoader(false);
      });
  };

  handleShare = () => {
    this.setState({
      show: true,
    });
  };

  renderCats = cats => {
    if (cats.length) return cats.map(item => item.name).join(', ');
  };

  renderLocation = loc => {
    return loc.short_address;
  };

  closeToClick = () => {
    this.setState({
      show: false,
    });
  };

  checkIsEditable = () => {
    return (
      this.state.data &&
      this.state.data.posted_by &&
      this.props.userData.role === 2 &&
      this.props.userData.id === this.state.data.posted_by.id
    );
  };

  ApiService = new ApiService();
  Auth = new AuthService();

  resolveTourCreatorInfo = tour => {
    let _creator = {};
    if (tour.posted_by && tour.posted_by.role === 2 && tour.posted_by.staff) {
      _creator = {
        display_name: tour.posted_by.staff.company.display_name,
        summary: tour.posted_by.staff.company.summary,
      };
    } else if (
      tour.posted_by &&
      tour.posted_by.role === 2 &&
      !tour.posted_by.staff
    ) {
      _creator = {
        display_name: tour.posted_by.display_name,
        summary: tour.posted_by.summary,
      };
    }
    _creator.avatarUrl = `${API_URL}/users/${
      tour.posted_by.id
    }/avatar?width=70&avatar_type=merchant-avatar`;
    return _creator;
  };

  render() {
    const { data, reviews, posts, token, tourCreator } = this.state;
    return (
      <div className="details-page">
        <div className="details-wrap">
          <HeaderMobile />
          <Header />
          <Modal
            show={this.state.show}
            modalClosed={this.closeToClick}
            modalClass="sharing-modal"
          >
            <div className="sharing">
              <h1 className="share-header">Share route entry</h1>
              <div className="share-block">
                <div className="share-fb share-item">
                  <FacebookShareButton
                    url={`${REDIR_URL}${this.props.location.pathname}`}
                    onShareWindowClose={this.closeToClick}
                  >
                    <img src={fbImg} alt="facebook" />
                    <span>Share to Facebook</span>
                  </FacebookShareButton>
                </div>
                <div className="share-twitter share-item">
                  <TwitterShareButton
                    url={`${REDIR_URL}${this.props.location.pathname}`}
                    onShareWindowClose={this.closeToClick}
                  >
                    <img src={twitImg} alt="facebook" />
                    <span>Share to Twitter</span>
                  </TwitterShareButton>
                </div>
              </div>
            </div>
          </Modal>
          <div className="details-container container">
            <Grid componentClass="container-fluid">
              <Row className="show-grid">
                <Col lg={6} md={12} sm={12} className="left-panel">
                  {!this.props.isLoading &&
                    (!this.state.isPurchased || !this.state.data.cost) &&
                    !(
                      this.props.userData.id ===
                      (this.state.data && this.state.data.posted_by.id)
                    ) && <BuyBlock cost={data && data.cost} />}
                  <div className="details-main-block">
                    <div className="create-payment-method-back">
                      <button className="go-back-btn" onClick={this.goBack}>
                        <img src={backArrow} alt="create-payment-method-back" />
                        Go Back
                      </button>
                      <div className="right-block">
                        {this.props.userData.id &&
                          (this.state.isFavorite ? (
                            <button
                              className="fav-btn"
                              onClick={() =>
                                this.handleFavorite(
                                  this.props.match.params.id,
                                  removeFavApiPath
                                )
                              }
                            >
                              <img src={heartImg} alt="favorites" />
                              Favorites
                            </button>
                          ) : (
                            <button
                              className="fav-btn"
                              onClick={() =>
                                this.handleFavorite(
                                  this.props.match.params.id,
                                  addFavApiPath
                                )
                              }
                            >
                              <img src={heartEmptyImg} alt="favorites" />
                              Favorites
                            </button>
                          ))}
                        <button
                          className="share-btn"
                          onClick={this.handleShare}
                        >
                          <img src={shareImg} alt="sharing" />
                          Share
                        </button>
                      </div>
                    </div>
                    <h4 className="details-categories">
                      {data && this.renderCats(data.categories)}
                    </h4>
                    <div className="details-header">
                      <h1 className="tour-header">{data && data.name}</h1>
                    </div>
                    <div className="tour-location">
                      <ReactSVG src={markerImg} className="location-marker" />
                      <span> {data && this.renderLocation(data.location)}</span>
                    </div>
                    <div className="tour-data">
                      <span className="info-title">
                        {data &&
                          data.waypoint &&
                          data.waypoint.geometry &&
                          data.waypoint.geometry.coordinates.length}{' '}
                        Stops ({data && data.distance} Miles)
                      </span>
                      <span className="middot">&nbsp;&middot;&nbsp;</span>
                      <span className="info-title">
                        {data && data.mobility && data.mobility.name}
                      </span>
                      <span className="middot">&nbsp;&middot;&nbsp;</span>
                      <span className="info-title age-item">
                        {data && data.ages && data.ages.length
                          ? data.ages.map((age, index) => (
                              <span key={index}>
                                {age.name}
                                {data && data.ages.length !== index + 1
                                  ? ', '
                                  : ''}
                              </span>
                            ))
                          : 'For Everyone'}
                      </span>
                    </div>
                    <div className="tour-rating">
                      <div className="stars">
                        <StarsRating
                          rating={data && data.review && data.review.rating}
                        />
                      </div>
                      <div className="reviews">
                        {data && data.review && data.review.count} Reviews
                      </div>
                    </div>
                    <div className="tour-cost">
                      {data && data.cost > 0
                        ? `$${data.cost.toFixed(2)}`
                        : 'FREE'}
                    </div>
                    <h2 className="details-sub-header">Tour Details</h2>
                    <div
                      className="hosted-by"
                      onClick={() => this.goToAgentPage(data.user_id)}
                    >
                      <div className="hosted-img">
                        <ReactImageFallback
                          src={this.state.tourCreator.avatarUrl}
                          initialImage={loader}
                          fallbackImage={noImg}
                          alt="user-avatar"
                        />
                      </div>
                      <div className="hosted-info">
                        <div className="hosted-title">created by:</div>
                        <div className="user-name">
                          {tourCreator.display_name}
                        </div>
                      </div>
                    </div>
                    <div className="summary">{data && data.summary}</div>
                    <div
                      className={`route-details ${
                        this.checkIsEditable() ? '' : 'padded'
                      }`}
                    >
                      <h2 className="details-sub-header">Route Details</h2>
                      <TourDetailsItem
                        posts={posts}
                        isEditable={this.state.isEditable}
                        isPurchased={this.state.isPurchased}
                        cost={data && data.cost}
                        morePosts={this.state.morePosts}
                      />
                      {!this.props.isLoading &&
                        !this.state.isPurchased &&
                        !!this.state.morePosts && (
                          <WarnItem count={this.state.morePosts} />
                        )}
                      {!token && data && data.is_approved && (
                        <div
                          className={`edit-block ${
                            this.checkIsEditable() ? '' : 'hidden'
                          }`}
                        >
                          <button
                            className="edit-btn button-main"
                            onClick={() => this.editRoute(data.id)}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="route-reviews">
                      <h2 className="details-sub-header">Reviews</h2>
                      {reviews.length > 0 ? (
                        <ReviewItem reviews={reviews} />
                      ) : (
                        <span className="no-data">
                          No reviews for this tour
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col lg={6} md={12} sm={12} className="right-panel">
                  <section className="create-tour-section">
                    <MapPanel tourDetails routeStop />
                  </section>
                </Col>
              </Row>
            </Grid>
          </div>
          {/*<Footer />*/}
        </div>
      </div>
    );
  }
}

TourDetails.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  auth: PropTypes.instanceOf(Object).isRequired,
  setLoader: PropTypes.func.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TourDetails)
);
