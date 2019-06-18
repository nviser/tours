import React, { Component } from 'react';
import './DashboardPurchased.css';
import SlickSlider from './Slider/SlickSlider';
import { toursPurchasedApiPath } from '../../../../utils/paths';
import ApiService from '../../../../services/ApiService/ApiService';
import SearchService from '../../../../services/SearchService/SearchService';
import { setLoader } from '../../../../actions/loaderActions';
import { connect } from 'react-redux';
import NoItems from './NotItems/NotItems';
import feathersImg from '../../../../assets/img/feathers.png';
import { toursPurchasedPath, searchPath } from '../../../../utils/paths';
import { withRouter } from 'react-router-dom';
import { setRoutes } from '../../../../actions/routes';
import {
  setMapCenter,
  setUserCurrentLocation,
} from '../../../../actions/mapActions';

const DESCRIPTION =
  'You haven’t bought any tours yet! The adventure begins here.';

class DashboardPurchased extends Component {
  state = {
    toursPurchased: [],
  };

  componentDidMount = () => {
    this.getRoutes();
  };
  Api = new ApiService();
  Search = new SearchService();
  getRoutes = () => {
    this.props.setLoader(true);
    this.Api.getComponent(toursPurchasedApiPath)
      .then(res => {
        this.setState({
          toursPurchased: res.data,
        });
        this.props.setLoader(false);
      })
      .catch(e => {
        this.props.setLoader(false);
      });
  };

  clickHandler = () => {
    this.props.history.push(searchPath);
  };

  goTo = () => {
    this.props.history.push(toursPurchasedPath);
  };

  render() {
    return (
      <div
        className={`board-journal${
          !this.state.toursPurchased.length > 0 ? ' purchased-fixed-heigth' : ''
        }`}
      >
        <div className="dashboard-purchased">
          <div className="dashboard-purchased-header">
            <h2 className="board-reg-header">Purchased Tours</h2>
            {this.state.toursPurchased.length > 0 && (
              <a className="view-more-link" onClick={() => this.goTo()}>
                View More
              </a>
            )}
          </div>
          {this.state.toursPurchased.length ? (
            <SlickSlider toursPurchased={this.state.toursPurchased} />
          ) : (
            ''
          )}
          {!this.state.toursPurchased.length && !this.props.isLoading && (
            <NoItems
              img={feathersImg}
              description={DESCRIPTION}
              clickHandler={this.clickHandler}
              btnTitle="Go to map"
              clName="dpurchased"
            />
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLoader: status => dispatch(setLoader(status)),
    setRoutes: status => dispatch(setRoutes(status)),
    setMapCenter: status => dispatch(setMapCenter(status)),
    setUserCurrentLocation: status => dispatch(setUserCurrentLocation(status)),
  };
};
const mapStateToProps = state => {
  return {
    isLoading: state.loader.isLoading,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DashboardPurchased)
);
