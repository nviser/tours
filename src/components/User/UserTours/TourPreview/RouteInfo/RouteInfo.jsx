import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import './RouteInfo.css';
import ApiService from '../../../../../services/ApiService/ApiService';
import { routesPath } from '../../../../../utils/paths';
import { setLoader } from '../../../../../actions/loaderActions';
import ReactImageFallback from 'react-image-fallback';
import noImg from '../../../../../assets/img/icons/no-photo.png';
import loader from '../../../../../assets/img/loading.gif';
import StarsRating from '../../../../UI/StarsRating/StarsRating';
import { API_URL } from '../../../../../config';

class RouteInfo extends Component {
  state = {
    route: null,
    tourCreator: {},
  };
  componentDidMount = () => {
    const draftTourData = localStorage.getItem('draftTourCreateData');
    console.log('Draft', draftTourData);
    if (draftTourData) {
      this.DRAFT_TOUR_DATA = JSON.parse(draftTourData);
      this.getRouteData();
    }
  };

  ApiService = new ApiService();

  getRouteData = () => {
    const { tourId } = this.DRAFT_TOUR_DATA;
    this.props.setLoader(true);
    this.ApiService.getComponent(`${routesPath}/${tourId}`)
      .then(response => {
        this.setState({
          route: response.data,
          tourCreator: this.resolveTourCreatorInfo(response.data),
        });
        this.props.setLoader(false);
      })
      .catch(e => {
        this.props.setLoader(false);
      });
  };

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
    return (
      <div className="route-info">
        {this.state.route && (
          <div>
            <div className="tour-summary">
              <div className="route-info-header">
                <span className="route-info-categories">
                  {this.state.route.categories.map((category, index) => (
                    <span key={index}>
                      {category.name}
                      {this.state.route.categories.length !== index + 1
                        ? ', '
                        : ''}
                    </span>
                  ))}
                </span>
              </div>
              <div className="route-info-block">
                <div className="route-info-title">{this.state.route.name}</div>
              </div>

              <div className="location-block">
                <Glyphicon glyph="map-marker" className="map-marker" />
                <div className="route-info-location">
                  {this.state.route.location &&
                    this.state.route.location.short_address}{' '}
                </div>
              </div>
              <div className="tour-brief">
                <span>
                  {this.state.route.posts && this.state.route.posts.length}{' '}
                  Stops ({this.state.route.distance} Miles)
                </span>
                <span className="middot">&nbsp;&middot;&nbsp;</span>
                <span>{this.state.route.mobility.name} Tour</span>
                <span className="middot">&nbsp;&middot;&nbsp;</span>
                <span>
                  {this.state.route.ages.length
                    ? this.state.route.ages.map((age, index) => (
                        <span key={index}>
                          {age.name}
                          {this.state.route.ages.length !== index + 1
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
                    rating={
                      this.state.route.review && this.state.route.review.rating
                    }
                  />
                  <span className="reviews">
                    {this.state.route.review.count} Reviews
                  </span>
                </div>
              </div>
              <div className="route-info-coast">
                {this.state.route.cost
                  ? `$${this.state.route.cost.toFixed(2)}`
                  : 'FREE'}{' '}
              </div>
            </div>

            <div className="route-info-details">Tour details</div>
            <div className="hosted-by">
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
                <div className="hosted-user-name">
                  {this.state.tourCreator
                    ? `${this.state.tourCreator.display_name}`
                    : ''}
                </div>
              </div>
            </div>
            <div className="route-info-description">
              {this.state.route.summary}
            </div>
            <div className="route-info-details">Route details</div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    editedRouteId: state.routes.editedRouteId,
    //avatar: state.auth.avatar
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setLoader: status => dispatch(setLoader(status)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteInfo);
