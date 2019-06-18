import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import noImg from '../../assets/img/icons/noimage.webp';
import loader from '../../assets/img/loading-2.gif';
import { API_URL } from '../../config';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactImageFallback from 'react-image-fallback';
import ApiService from '../../services/ApiService/ApiService';
import { addFavApiPath, removeFavApiPath } from '../../utils/paths';
import { setLoader } from '../../actions/loaderActions';
import './TourItem.css';
import StartRating from '../../components/UI/StarsRating/StarsRating';
import ReactTooltip from 'react-tooltip';
import ModalContent from '../User/UserTours/FavoriteTours/ModalContent/ModalContent';
import Modal from '../UI/Modal/Modal';

const mapDispatchToProps = {
  setLoader,
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
});

const setImage = data => {
  return `${API_URL}/routes/${data.id}/background?width=400`;
};

const goTo = (history, path) => {
  history.push(path);
};

const Api = new ApiService();

class TourItem extends Component {
  state = {
    isFavourite: this.props.route.is_favorite,
    routeId: this.props.route.id,
    showModal: false,
    hoveredTour: null,
  };

  addToFav = routeId => {
    const data = { route_id: routeId };
    this.props.setLoader(true);
    Api.sendComponent(data, addFavApiPath)
      .then(res => {
        this.props.setLoader(false);
        this.setState({
          isFavourite: true,
        });
      })
      .catch(() => {
        this.props.setLoader(false);
      });
  };

  removeFav = () => {
    if (this.props.isModal) {
      this.setState({ showModal: true });
    } else {
      this.sendRemoveEndpoint();
    }
  };

  sendRemoveEndpoint = () => {
    const data = { route_id: this.state.routeId };
    this.props.setLoader(true);
    Api.sendComponent(data, removeFavApiPath)
      .then(res => {
        this.props.setLoader(false);
        this.setState({
          isFavourite: false,
        });
      })
      .catch(() => {
        this.props.setLoader(false);
      });
    if (this.props.deleteItem) {
      this.props.deleteItem(this.state.routeId);
    }
  };
  cancelModalHandler = () => {
    this.setState({ showModal: false });
  };

  doneModalHandler = () => {
    this.sendRemoveEndpoint();
    this.cancelModalHandler();
  };
  over = id => {
    this.setState({
      hoveredTour: id,
    });
  };
  render() {
    const { route, history } = this.props;
    return (
      <div
        className={`search-item-container ${route.active ? 'active' : ''}`}
        ref={inst =>
          this.props.itemActive && this.props.itemActive(inst, route.active)
        }
      >
        <div className="tour-item">
          <div className="tour-img-block">
            <ReactImageFallback
              src={setImage(route)}
              initialImage={loader}
              fallbackImage={noImg}
              alt="tour_img"
              className="tour-img"
            />
            {this.props.isLoggedIn ? (
              this.state.isFavourite ? (
                /*? <ReactSVG  src={favImg} className="fav-tour" onClick={() => this.removeFav(route.id)}/>
                            : <ReactSVG  src={favEmptyImg} className="fav-tour" onClick={() => this.addToFav(route.id)}/>*/
                <i
                  className="fav-tour fa fa-heart"
                  data-tip="Remove from favorites"
                  onClick={this.removeFav}
                  onMouseOver={() => this.over(route.id)}
                  onMouseLeave={() => this.over(null)}
                />
              ) : (
                <i
                  className="fav-tour fa fa-heart-o"
                  data-tip="Add to favorites"
                  onClick={() => this.addToFav(route.id)}
                  onMouseOver={() => this.over(route.id)}
                  onMouseLeave={() => this.over(null)}
                />
              )
            ) : null}
            {this.state.hoveredTour === route.id && (
              <ReactTooltip effect="float" place="bottom" type="red" />
            )}
          </div>
          <div className="tour-main-block">
            <div className="tour-main-container">
              <div className="tour-main-top-block">
                <div className="tour-top">
                  <div className="tour-category">
                    {route.categories &&
                      route.categories.map((category, index) => (
                        <span
                          className="category-item"
                          style={{ color: category.color }}
                          key={index}
                        >
                          {category.name}
                          {route.categories.length !== index + 1 ? ', ' : ''}
                        </span>
                      ))}
                    {route.posted_by && route.posted_by.display_name && (
                      <span
                        className="category-item"
                        // style={{ color: category.color }}
                      >{`${route.posted_by.display_name}`}</span>
                    )}
                  </div>
                  <h2
                    className="search-tour-header"
                    onClick={() => goTo(history, `/tours/details/${route.id}`)}
                  >
                    {route.name}
                  </h2>
                  <div className="tour-location">
                    <Glyphicon glyph="map-marker" className="map-marker" />
                    <span className="tour-location-city">
                      {route.location && route.location.short_address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="tour-info">
                <span className="info-item">
                  {route.waypoint &&
                    route.waypoint.geometry &&
                    route.waypoint.geometry.coordinates.length}{' '}
                  Stops ({route.distance} Miles)
                </span>
                <span className="middot">&nbsp;&middot;&nbsp;</span>
                <span className="info-item">
                  {route.mobility && route.mobility.name}
                </span>
                <span className="middot">&nbsp;&middot;&nbsp;</span>
                <span className="info-item age-item">
                  {route.ages && route.ages.length
                    ? route.ages.map((age, index) => (
                        <span key={index}>
                          {age.name}
                          {route.ages.length !== index + 1 ? ', ' : ''}
                        </span>
                      ))
                    : 'For Everyone'}
                </span>
              </div>
              <div className="tour-rating">
                {route.review && route.review.count > 0 ? (
                  <div className="stars">
                    <StartRating rating={route.review.rating} />
                  </div>
                ) : null}
                <div className="reviews">
                  {route.review && route.review.count > 0
                    ? route.review.count + ' Reviews'
                    : 'No reviews yet'}{' '}
                </div>
              </div>
            </div>
            <div className="tour-bottom">{this.props.children}</div>
          </div>
        </div>
        <Modal show={this.state.showModal}>
          <ModalContent
            cancelHandler={this.cancelModalHandler}
            doneHandler={this.doneModalHandler}
            modalTitle="Are you sure you want to remove the tour from favorites?"
            modalClass="tour-stop-delete-modal"
          />
        </Modal>
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TourItem)
);
