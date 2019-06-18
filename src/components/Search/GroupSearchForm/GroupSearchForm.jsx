import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import ReactRouterPropTypes from 'react-router-prop-types';
import SearchService from '../../../services/SearchService/SearchService';
import ApiService from '../../../services/ApiService/ApiService';
import { setSearchResults } from '../../../actions/searchActions';
import { setLoader } from '../../../actions/loaderActions';
import search from '../../../assets/img/search.svg';
import times from '../../../assets/img/times.svg';
import { SEARCH_SUGGESTIONS_LENGTH } from '../../../utils/const';
import {
  searchQueryPath,
  routesApiPath,
  searchGroupApiPath,
  propertySearchPlacePath,
} from '../../../utils/paths';
import './GroupSearchForm.css';
import {
  setSuggestions,
  setSelectedPropertySuggestions,
} from '../../../actions/suggestActions';
import {
  setRouteStopMarker,
  setMapCenter,
  disRerenderMap,
  setMapRoutes,
} from '../../../actions/mapActions';
import { setRoutes, setStatus } from '../../../actions/routes';
import MapContainer from '../../MapContainer';

const mapDispatchToProps = {
  setSearchResults,
  setLoader,
  setSelectedPropertySuggestions,
  setRouteStopMarker,
  setRoutes,
  setMapRoutes,
  setStatus,
  setMapCenter,
  setSuggestions,
  disRerenderMap,
};
const Search = new SearchService();

const mapStateToProps = state => ({
  propertyValue: state.suggest.selectedPropertySuggestion.value,
  selSuggestions: state.suggest.selectedPropertySuggestion,
});

class GroupSearchForm extends Component {
  state = {
    value: '',
    suggestions: [],
  };

  componentDidMount() {
    if (this.props.propertyValue)
      this.setState({
        value: this.props.propertyValue,
      });
    //this.props.setStatus('');
  }
  componentWillUnmount() {
    this.props.setSelectedPropertySuggestions({});
    this.props.setStatus('');
  }

  handleSubmit = event => {
    event.preventDefault();
    this.fetchSearch();
  };
  getCoords = search => {
    for (let i = 0; i < search.length; i++) {
      if (search[i]._index === 'property') {
        return search[i]._source.geo_location.geometry.coordinates;
      }
    }
    return null;
  };
  setTourPoints = (coords, descr) => {
    //const coords = this.getCoords(search);
    if (coords.lat && coords.lng) {
      this.props.setStatus('');
      this.props.setLoader(true);
      this.Api.getComponent(
        `${routesApiPath}?lat=${coords.lat}&lng=${coords.lng}&radius=${100000}`
      )
        .then(res => {
          this.props.setLoader(false);
          this.props.setRoutes(res.data);
          this.props.setMapRoutes(res.data);
          //this.props.setRouteStopMarker({coords: [lat, lng]});
          this.props.setMapCenter({ lat: coords.lat, lng: coords.lng });
          descr && this.props.history.push(`${searchQueryPath}${descr}`);
          if (!res.data.length && this.props.match.path === '/search') {
            this.props.setStatus('Matches not found');
          }
        })
        .catch(() => {
          this.props.setLoader(false);
        });
    } else {
      this.props.setRoutes([]);
      this.props.setMapRoutes([]);
      this.props.history.location.pathname === '/search' &&
        this.props.setStatus('Matches not found');
    }
  };

  fetchSearch = (selectedValue, suggest) => {
    const value = selectedValue || this.state.value.trim();
    if (value) {
      !suggest && this.props.setLoader(true);
      this.Api.getComponent(`${propertySearchPlacePath}?query=${selectedValue}`)
        .then(res => {
          this.setTourPoints(
            res.data.result.geometry.location,
            res.data.result.formatted_address
          );
        })
        .catch(err => console.log(err));
    }
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue }) => {
    this.props.setRoutes([]);
    this.props.setMapRoutes([]);
    this.setState({
      value: '',
    });
    if (suggestion.role) {
      this.props.history.push(`/agent/${suggestion.id}`);
    } else if (suggestion.place_id) {
      this.props.setSelectedPropertySuggestions({
        value: suggestionValue,
        propertyId: suggestion.id,
        placeId: suggestion.place_id,
      });
      this.setMarker(suggestion.place_id);
      this.fetchSearch(suggestion.place_id); //suggestion.description
    } else {
      this.props.history.push(`/tours/details/${suggestion.id}`);
    }
  };

  Api = new ApiService();

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

  escapeRegexCharacters = str => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  getSuggestions = value => {
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    this.getSearchGroups(value);
  };

  getSearchGroups = query => {
    this.props.disRerenderMap(false);
    if (query.length > SEARCH_SUGGESTIONS_LENGTH) {
      Search.searchProperty(searchGroupApiPath, query).then(res => {
        const sug = this.formSug(res.data);
        this.setState(
          {
            suggestions: sug,
          },
          () => this.setSugToStore(sug)
        );
      });
    }
  };
  formSug = rawData => {
    const _suggestions = [];
    for (let key in rawData) {
      if (rawData.hasOwnProperty(key) && rawData[key].length) {
        switch (key) {
          case 'tours': {
            _suggestions.push({
              title: 'In Tours',
              data: rawData[key],
            });
            break;
          }
          case 'locations': {
            _suggestions.push({
              title: 'In Address',
              data: rawData[key],
            });
            break;
          }
          case 'tour_operators': {
            _suggestions.push({
              title: 'In Tour Operators',
              data: rawData[key],
            });
            break;
          }
          default: {
            break;
          }
        }
      }
    }
    return _suggestions;
  };
  setSugToStore = sug => {
    this.props.setSuggestions(sug);
  };

  getSuggestionValue = suggestion => {
    return suggestion.description;
  };

  renderSuggestion = suggestion => {
    if (suggestion.description) {
      return <span>{suggestion.description}</span>;
    } else if (suggestion.name) {
      return <span>{suggestion.name}</span>;
    } else if (suggestion.first_name) {
      return <span>{suggestion.display_name}</span>;
    }
  };

  renderSectionTitle = section => {
    return <strong>{section.title}</strong>;
  };

  getSectionSuggestions = section => {
    return section.data;
  };

  onChange = (e, { newValue }) => {
    this.props.setSelectedPropertySuggestions({
      ...this.props.selSuggestions,
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.getSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };
  getSugValue = () => {
    return this.props.propertyValue;
  };

  clearForm = () => {
    this.props.setSelectedPropertySuggestions({
      ...this.props.selSuggestions,
      value: '',
    });
  };

  render() {
    const { suggestions } = this.state;
    const value = this.getSugValue() || '';
    const inputProps = {
      placeholder: 'Search Tour, Address, Tour Operator',
      value,
      onChange: this.onChange,
    };

    return (
      <form onSubmit={this.handleSubmit} className="search-form">
        <img src={search} alt="search" className="magnifier" />
        <Autosuggest
          multiSection={true}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          renderSectionTitle={this.renderSectionTitle}
          getSectionSuggestions={this.getSectionSuggestions}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps}
        />
        <MapContainer />
        <img
          src={times}
          alt="search"
          className={`times ${!!this.props.propertyValue ? 'active' : ''}`}
          onClick={this.clearForm}
        />
      </form>
    );
  }
}

GroupSearchForm.propTypes = {
  setSearchResults: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GroupSearchForm)
);
