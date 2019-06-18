import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import StarsRating from '../../../UI/StarsRating/StarsRating';
import ReactImageFallback from 'react-image-fallback';
import ApiService from '../../../../services/ApiService/ApiService';
import { routesApiPath } from '../../../../utils/paths';
import noImg from '../../../../assets/img/icons/noimage.webp';
import loader from '../../../../assets/img/loading.gif';
import { API_URL } from '../../../../config';
import './TourItem.css';
import 'react-toggle/style.css';
import { connect } from 'react-redux';

const categories = cats => {
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

const goTo = (history, path) => {
  history.push(path);
};

const TourItem = withRouter(props => <TourItemComponent {...props} />);

class TourItemComponent extends Component {
  state = {
    toggler: this.props.data.is_active,
    url: '',
  };

  setImage = data => {
    return `${API_URL}/routes/${data.id}/background?width=${
      this.props.tourImageWidth
    }`;
  };

  handleToggleChange = (e, id) => {
    const routeState = e.target.checked,
      data = { is_active: routeState };
    if (id) {
      this.Api.patchComponent(data, `${routesApiPath}/${id}`)
        .then(() => {
          this.setState({
            toggler: routeState,
          });
        })
        .catch(err => console.log(err));
    }
  };

  Api = new ApiService();

  render() {
    const { data, history } = this.props;
    return (
      <div className="tour-item-container">
        <div className="tour-item">
          <div className="tour-img-block">
            <div className="tour-img-container">
              <ReactImageFallback
                src={this.setImage(data)}
                initialImage={loader}
                fallbackImage={noImg}
                alt="tour_img"
                className="tour-img"
              />
            </div>
            <div className="tour-cost">
              {data.cost ? `$ ${data.cost.toFixed(2)}` : 'FREE'}
            </div>
          </div>
          <div className="tour-main-block">
            <div className="tour-location">
              <Glyphicon glyph="map-marker" className="map-marker" />
              <span>{`${data.location.city} ${
                data.location.state ? ', ' + data.location.state : ''
              }`}</span>
              <span className="green middot">&nbsp;&middot;&nbsp;</span>
              <span className="green">{categories(data.categories)}</span>
            </div>
            <h2
              className="tour-header"
              onClick={() => goTo(history, `/tours/details/${data.id}`)}
            >
              {data.name}
            </h2>
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
            <div className="tour-info">
              <div className="info-item">
                <div className="item-top">stops</div>
                <div className="item-bottom">
                  {data.waypoint &&
                    data.waypoint.geometry &&
                    data.waypoint.geometry.coordinates.length}
                </div>
              </div>
              <div className="info-item">
                <div className="item-top">Distance</div>
                <div className="item-bottom">{data.distance} Miles</div>
              </div>
              <div className="info-item">
                <div className="item-top">Mode</div>
                <div className="item-bottom">
                  <img
                    src={data.mobility && data.mobility.icon}
                    className="icon-mobility"
                    alt="icon_mobility"
                  />
                  {data.mobility && data.mobility.name}
                </div>
              </div>
              {/*<div className="info-item">
                    <div className="item-top">LANGUAGE</div>
                    <div className="item-bottom">EN / ES</div>
                  </div>*/}
              <div className="info-item">
                <div className="item-top">SUITABLE AGE</div>
                <div className="item-bottom ages">{categories(data.ages)}</div>
              </div>
              <div className="info-item">
                <div className="item-top">PRICE</div>
                <div className="item-bottom">
                  {data.cost ? `$ ${data.cost.toFixed(2)}` : 'FREE'}
                </div>
              </div>
            </div>
            {/*<div className="tour-people">
                  6 people took this tour
                </div>*/}
          </div>
          <div className="tour-toggle-block">
            <Toggle
              defaultChecked={this.state.toggler}
              icons={false}
              onChange={e => this.handleToggleChange(e, data.id)}
            />
            <div className="tg-status">
              {this.state.toggler ? 'active' : 'inactive'}
            </div>
          </div>
          <div className="tour-preview-block">
            <span onClick={() => goTo(history, `/tours/details/${data.id}`)}>
              preview
            </span>
          </div>
        </div>
      </div>
    );
  }
}

TourItemComponent.defaultProps = {
  data: null,
};
TourItemComponent.propTypes = {
  data: PropTypes.instanceOf(Object),
};

const mapStateToProps = state => {
  return {
    tourImageWidth: state.tours.tourImageWidth,
  };
};

export default connect(mapStateToProps)(TourItem);
