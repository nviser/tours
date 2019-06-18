import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import noImg from '../../../../assets/img/icons/noimage.webp';
import loader from '../../../../assets/img/loading.gif';
import ReactTooltip from 'react-tooltip';
import favImg from '../../../../assets/img/heart-fav.svg';
import favEmptyImg from '../../../../assets/img/heart-fav-empty.svg';
import { API_URL } from '../../../../config';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactImageFallback from 'react-image-fallback';
import ReactSVG from 'react-svg';
import ApiService from '../../../../services/ApiService/ApiService';
import { addFavApiPath, removeFavApiPath } from '../../../../utils/paths';
import { setLoader } from '../../../../actions/loaderActions';
import './SearchTourItem.css';
import StartRating from '../../../../components/UI/StarsRating/StarsRating';

const mapDispatchToProps = {
  setLoader,
};

const imgType = type => {
  return type.substr(0, 5) === 'image';
};

const setImage = data => {
  for (let k = 0; k < data.length; k++) {
    if (data[k].attachments && Array.isArray(data[k].attachments)) {
      const attach = data[k].attachments;
      for (let i = 0; i < attach.length; i++) {
        if (attach[i].file && imgType(attach[i].file.mime_type)) {
          return `${API_URL}/posts/${data[k].id}/attachments/${
            attach[i].file_id
          }?width=350`;
        }
      }
    }
  }
  return noImg;
};

const goTo = (history, path) => {
  history.push(path);
};

const Api = new ApiService();

class SearchTourItem extends Component {
  state = {
    isFavourite: this.props.route.is_favorite,
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

  removeFav = routeId => {
    const data = { route_id: routeId };
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
  };
  render() {
    const { route, history } = this.props;
    return (
      <div className="search-item-container">
        <div className="tour-item">
          <div className="tour-img-block">
            <ReactImageFallback
              src={setImage(route.posts)}
              initialImage={loader}
              fallbackImage={noImg}
              alt="tour_img"
              className="tour-img"
            />
            {this.state.isFavourite ? (
              /*? <ReactSVG  src={favImg} className="fav-tour" onClick={() => this.removeFav(route.id)}/>
                            : <ReactSVG  src={favEmptyImg} className="fav-tour" onClick={() => this.addToFav(route.id)}/>*/
              <i
                className="fav-tour fa fa-heart"
                data-tip="Remove from favorites"
                onClick={() => this.removeFav(route.id)}
              />
            ) : (
              <i
                className="fav-tour fa fa-heart-o"
                data-tip="Add to favorites"
                onClick={() => this.addToFav(route.id)}
              />
            )}
            <ReactTooltip effect="float" place="bottom" type="red" />
          </div>
          <div className="tour-main-block">
            <div className="tour-main-top-block">
              <div className="tour-top">
                <div className="tour-category">
                  {route.categories.map((category, index) => (
                    <span className="category-item" key={index}>
                      {category.name}
                      {route.categories.length !== index + 1 ? ', ' : ''}
                    </span>
                  ))}
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
                    {route.location.city}
                  </span>
                </div>
              </div>
            </div>

            <div className="tour-info">
              <span className="info-item">
                {route.waypoint.geometry &&
                  route.waypoint.geometry.coordinates.length}{' '}
                Stops ({route.distance} Miles)
              </span>
              <span className="middot">&nbsp;&middot;&nbsp;</span>
              <span className="info-item">
                {route.mobility && route.mobility.name} Tour
              </span>
              <span className="middot">&nbsp;&middot;&nbsp;</span>
              <span className="info-item age-item">
                {route.ages.length
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
              {route.review.count > 0 ? (
                <div className="stars">
                  <StartRating rating={route.review.rating} />
                </div>
              ) : null}
              <div className="reviews">
                {route.review.count > 0
                  ? route.review.count + ' Reviews'
                  : 'No reviews yet'}{' '}
              </div>
            </div>
            <div className="tour-bottom">
              {route.cost ? `$${route.cost.toFixed(2)}` : 'FREE'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(SearchTourItem)
);
