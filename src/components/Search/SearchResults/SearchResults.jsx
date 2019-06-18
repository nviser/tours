import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setPostTypes } from '../../../actions/postActions';
import { setLoader } from '../../../actions/loaderActions';
import ApiService from '../../../services/ApiService/ApiService';
import SearchFilters from './SearchFilters/SearchFilters';
import Header from '../../../components/Header/Header';
//import Footer from '../../../components/Footer/Footer';
import filterWImg from '../../../assets/img/sliders-w.svg';
import './SearchResults.css';
import SearchMap from './SearchMap/SearchMap';
import TourItem from '../../TourItem/TourItem';
//import SearchService from '../../../services/SearchService/SearchService';
import { searchQueryPath, routesApiPath } from '../../../utils/paths';
import {
  setSuggestions,
  setSelectedPropertySuggestions,
} from '../../../actions/suggestActions';
import {
  setRouteStopMarker,
  setWaypoints,
  setMapCenter,
  disRerenderMap,
  setMapRoutes,
  setInfoWindow,
} from '../../../actions/mapActions';
import { setRoutes, setStatus } from '../../../actions/routes';
import { setFilters } from '../../../actions/filters';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';

//const Search = new SearchService();

const mapStateToProps = state => ({
  search_results: state.search,
  postTypes: state.postTypes,
  userData: state.auth.userData,
  mapCenter: state.map.mapCenter,
  currentUserLocation: state.map.mapCenter,
  allRoutes: state.routes.allRoutes,
  status: state.routes.status,
  isLoading: state.loader.isLoading,
  activeFilters: state.filters.activeFilters,
});

const mapDispatchToProps = {
  setPostTypes,
  setSuggestions,
  setSelectedPropertySuggestions,
  setRouteStopMarker,
  setLoader,
  setWaypoints,
  setRoutes,
  setStatus,
  setMapCenter,
  setFilters,
  disRerenderMap,
  setMapRoutes,
  setInfoWindow,
};

class SearchResults extends Component {
  state = {
    status: '',
    filtersVisible: false,
    activeFilters: this.props.filters,
  };
  Api = new ApiService();

  goTo = (component, id) => {
    this.props.history.push(`/${component}/${id}`);
  };
  componentWillMount() {
    //this.props.setStatus('');
  }
  componentDidMount = () => {
    if (this.props.currentUserLocation.lat) {
      const loc = this.props.currentUserLocation;
      this.searchArea(loc.lat, loc.lng, loc.zoom);
    }
  };

  // componentWillReceiveProps(next) {
  //     if(next.activeFilters.length !== this.props.activeFilters.length) {
  //           !this.props.isLoading && this.searchArea();
  //     }
  // }

  componentWillUnmount() {
    this.props.setRoutes([]);
    this.props.setMapRoutes([]);
  }
  // getCoords = (search) => {
  //     for (let i = 0; i < search.length; i++) {
  //         if(search[i]._index === 'property') {
  //             return this.Api.getComponent(`${propertySearchPlacePath}?query=${search[i]._source.google_place_id}`)
  //                 .then(res => {
  //                     const loc = res.data.result.geometry.location;
  //                     this.setNearestPoints(loc.lat, loc.lng, 11);
  //                 })
  //         }
  //     }
  // }

  setSugToStore = sug => {
    this.props.setSuggestions(sug);
  };

  onSuggestionSelected = (suggestion, suggestionValue) => {
    this.setState({
      value: '',
    });
    this.props.setSelectedPropertySuggestions({
      value: suggestionValue,
      propertyId: suggestion.id,
      placeId: suggestion.place_id,
    });
    this.setMarker(suggestion.place_id);
    //this.fetchSearch(suggestionValue,);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  setMarker = marker => {
    this.setStopMarker(marker);
  };

  setStopMarker = marker => {
    const geocoder = new window.google.maps.Geocoder();

    return geocoder.geocode({ placeId: marker }, (results, status) => {
      if (status === 'OK') {
        this.props.setRouteStopMarker({
          coords: [
            results[0].geometry.location.lat(),
            results[0].geometry.location.lng(),
          ],
        });
      }
    });
  };
  /*fetchSearch = (selectedValue, suggest) => {
      this.setState({
          status: ''
      });
    const value = selectedValue || this.state.value.trim();
    if (value) {
      // !suggest && this.props.setLoader(true);
      this.props.setLoader(true);
      Search.search(searchApiPath, value)
        .then((res) => {
          this.prepareSuggestions(res.data);
          if (!suggest) {
            this.props.setSearchResults(res.data);
            this.props.history.push(`${searchQueryPath}${value}`);
            if (this.props.match.path === searchPath) {
              this.setState({
                value: ''
              });
            }
          }
            this.props.setLoader(false);
            if(!this.props.allRoutes.length && !this.props.isLoading) {
              this.setState({
                  status: 'Matches not found'
              });
          } else {
                this.setState({
                    status: ''
                });
            }
        })
        .catch((err) => {
            this.props.setLoader(false);
            this.setState({
                status: ''
            });
          if (err && err.response && err.response.data.errors) {
            this.props.history.push(searchNotAvailablePath);
          }
        });
    }
  }*/
  strFilters = (arr, type) => {
    switch (type) {
      case 'cat':
        return arr.length ? '&category_ids=' + arr.join(',') : '';
      case 'age':
        return arr.length ? '&age_ids=' + arr.join(',') : '';
      case 'mob':
        return arr.length ? '&mobility_ids=' + arr.join(',') : '';
      default:
    }
  };
  formFilters = () => {
    const filtes = {
      cat: [],
      age: [],
      mob: [],
    };
    this.props.activeFilters.forEach(flt => {
      switch (flt.type) {
        case 'categories':
          filtes.cat.push(flt.id);
          break;
        case 'ages':
          filtes.age.push(flt.id);
          break;
        case 'mobility':
          filtes.mob.push(flt.id);
          break;
        default:
      }
    });
    return `${this.strFilters(filtes.cat, 'cat')}${this.strFilters(
      filtes.age,
      'age'
    )}${this.strFilters(filtes.mob, 'mob')}`;
  };

  setNearestPoints = (lat, lng, zoom) => {
    this.setState({
      status: '',
    });
    this.props.setStatus('');
    this.props.setLoader(true);
    this.Api.getComponent(
      `${routesApiPath}?lat=${lat}&lng=${lng}&radius=${100000}${this.formFilters()}`
    )
      .then(res => {
        this.props.setRoutes(res.data);
        this.props.setMapRoutes(res.data);
        this.props.setRouteStopMarker({ coords: [lat, lng] });
        this.props.setMapCenter({ lat, lng, zoom });
        this.props.setLoader(false);
        if (!res.data.length && !this.props.isLoading) {
          this.props.setStatus('No matches found');
        } else {
          this.setState({
            status: '',
          });
        }
        if (
          this.props.currentUserLocation.lat &&
          this.props.currentUserLocation.city
        ) {
          const currentLocationAddress = this.encodeLocation(
            `${this.props.currentUserLocation.country}+${
              this.props.currentUserLocation.city
            }`
          );
          this.props.history.replace(
            `${searchQueryPath}${currentLocationAddress}`
          );
        }
      })
      .catch(() => {
        this.props.setLoader(false);
        this.setState({
          status: '',
        });
      });
  };

  encodeLocation = loc => {
    return encodeURIComponent(loc);
  };

  searchArea = (lat, lng, zoom) => {
    if (this._map) {
      if (lat && lng && zoom) {
        this.props.setLoader(true);
        this.setNearestPoints(lat, lng, zoom);
      } else {
        const lat = this._map.getCenter().lat(),
          lng = this._map.getCenter().lng(),
          zoom = this._map.getZoom();
        // distance = (156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom)).toFixed(0);
        this.props.setLoader(true);
        this.setNearestPoints(lat, lng, zoom);
      }
    }
  };

  setInfo = (lat1, lng1, props, id, index) => {
    if (this._map) {
      props.setInfoWindow({
        position: {
          lat: lat1,
          lng: lng1,
        },
        id: id,
        isVisible: true,
        index: index,
      });
    }
  };

  handleMap = map => {
    this._map = map;
  };

  tabFilters = status => {
    this.setState({
      filtersVisible: status,
    });
  };

  removeFilter = id => {
    const filts = this.props.activeFilters.map(item => item);
    this.props.activeFilters.forEach((item, index) => {
      if (item.id === id) {
        filts.splice(index, 1);
        this.props.setFilters(filts);
      }
    });
    this.searchArea();
  };

  showTitle = count => {
    return count === 1 ? 'filter' : 'filters';
  };

  scrollToItem = (el, status) =>
    status && el
      ? el.scrollIntoView({ block: 'start', behavior: 'smooth' })
      : null;

  render() {
    // const query = decodeURIComponent(this.props.location.search.substr(7));
    // debugger;
    return (
      <div className="search-results">
        <HeaderMobile />
        <Header />
        <div className="search-result-wrap">
          <Grid componentClass="container-fluid">
            <Row className="show-grid results-grid">
              <Col lg={6} md={6} sm={5} className="search-result-left-panel">
                <Row className="show-grid left-panel">
                  <div className="search-block">
                    <div
                      className="block-header"
                      onClick={() => this.tabFilters(false)}
                    >
                      <h1 className="search-result-title">Tours</h1>
                      {/*<p  className="search-result-query">{query}</p>*/}
                    </div>
                    <div
                      className="block-filter"
                      onClick={() =>
                        this.tabFilters(!this.state.filtersVisible)
                      }
                    >
                      <img
                        className="filter-img"
                        src={filterWImg}
                        alt="filter"
                      />
                      <span className="filter-text">
                        {this.props.activeFilters.length > 0
                          ? this.props.activeFilters.length
                          : ''}{' '}
                        {this.showTitle(this.props.activeFilters.length)}
                      </span>
                    </div>
                  </div>
                  {/*<div className={`selected-filters ${this.props.activeFilters.length && !this.state.filtersVisible ? '' : 'hidden'}`}>
                        {this.props.activeFilters && this.props.activeFilters.map((item, index) =>(
                            <div
                                className="sel-filter-item"
                                key={index}
                            >
                                {item.title}
                                <button
                                    className="filter-close-btn"
                                    onClick={() => this.removeFilter(item.id)}
                                >
                                    <img className="close-img" src={closeImg} alt="close"/>
                                </button>
                            </div>
                        ))}
                    </div>*/}
                  <div
                    className={`search-container ${
                      this.state.filtersVisible ? 'hidden' : ''
                    }`}
                  >
                    {this.props.allRoutes && this.props.allRoutes.length
                      ? this.props.allRoutes.map(route => (
                          <TourItem
                            key={route.id}
                            itemActive={(el, status) =>
                              this.scrollToItem(el, status)
                            }
                            route={route}
                          >
                            <div className="tour-price">
                              {route.cost
                                ? `$${route.cost.toFixed(2)}`
                                : 'FREE'}
                            </div>
                          </TourItem>
                        ))
                      : null}
                    {!this.props.allRoutes.length && !this.props.isLoading ? (
                      <p className="search-not-found">{this.props.status}</p>
                    ) : null}
                  </div>
                  <div
                    className={`filter-container ${
                      this.state.filtersVisible ? 'active' : 'hidden'
                    }`}
                  >
                    <SearchFilters
                      applyFilters={() => this.tabFilters(false)}
                      filterData={() => this.searchArea()}
                    />
                  </div>
                </Row>
              </Col>
              <Col lg={6} md={6} sm={7} className="search-result-right-panel">
                <section className="create-tour-section">
                  <button className="search-area" onClick={this.searchArea}>
                    search this area
                  </button>
                  <SearchMap
                    routeStop
                    onMapMounted={this.handleMap}
                    setInfo={this.setInfo}
                  />
                </section>
                {this.state.filtersVisible && <div className="fader" />}
              </Col>
            </Row>
          </Grid>
        </div>
        {/*<Footer />*/}
      </div>
    );
  }
}

SearchResults.defaultProps = {
  search_results: null,
  postTypes: [],
};
SearchResults.propTypes = {
  search_results: PropTypes.instanceOf(Array),
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  postTypes: PropTypes.instanceOf(Array),
  setPostTypes: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResults);
