import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import Autosuggest from 'react-autosuggest';
import ReactRouterPropTypes from 'react-router-prop-types';
import SearchService from '../../../services/SearchService/SearchService';
import ApiService from '../../../services/ApiService/ApiService';
import PropertiesService from '../../../services/PropertiesService/PropertiesService';
import { setSearchResults } from '../../../actions/searchActions';
import { setLoader } from '../../../actions/loaderActions';
import { SEARCH_SUGGESTIONS_LENGTH } from '../../../utils/const';
import {
  searchApiPath,
  searchPath,
  searchQueryPath,
  searchNotAvailablePath,
  routesApiPath,
} from '../../../utils/paths';
import './SearchForm.css';
import AutosuggestComponent from '../../AutosuggestComponent/AutosuggestComponent';
import { setSelectedPropertySuggestions } from '../../../actions/suggestActions';
import { setRouteStopMarker, setMapCenter } from '../../../actions/mapActions';
import { setRoutes, setStatus } from '../../../actions/routes';
import MapContainer from '../../MapContainer';

const SearchComponent = withRouter(props => <SearchForm {...props} />);

const mapDispatchToProps = {
  setSearchResults,
  setLoader,
  setSelectedPropertySuggestions,
  setRouteStopMarker,
  setRoutes,
  setStatus,
  setMapCenter,
};

const mapStateToProps = state => ({
  propertyValue: state.suggest.selectedPropertySuggestion.value,
});

class SearchForm extends Component {
  state = {
    value: '',
    suggestions: [],
  };

  suggestions = [
    {
      title: 'person',
      data: [],
    },
    {
      title: 'company',
      data: [],
    },
    {
      title: 'property',
      data: [],
    },
  ];

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
  setTourPoints = search => {
    const coords = this.getCoords(search);
    if (coords) {
      this.props.setStatus('');
      this.Api.getComponent(
        `${routesApiPath}?lat=${coords[1]}&lng=${coords[0]}&radius=${100000}`
      )
        .then(res => {
          this.props.setRoutes(res.data);
          //this.props.setRouteStopMarker({coords: [lat, lng]});
          this.props.setMapCenter({ lat: coords[1], lng: coords[0] });
          if (!res.data.length) {
            this.props.setStatus('Matches not found');
          }
        })
        .catch(() => {});
    } else {
      this.props.setRoutes([]);
      this.props.setStatus('Matches not found');
    }
    // const geocoder = new window.google.maps.Geocoder();
    //
    // return geocoder.geocode({ placeId: placeId }, (results, status) => {
    //     if (status === 'OK') {
    //         this.props.setRouteStopMarker({ coords: [results[0].geometry.location.lat(), results[0].geometry.location.lng()] });
    //     }
    // });
  };

  fetchSearch = (selectedValue, suggest) => {
    const value = selectedValue || this.state.value.trim();
    if (value) {
      !suggest && this.props.setLoader(true);
      this.Search.search(searchApiPath, value)
        .then(res => {
          this.prepareSuggestions(res.data);
          this.setTourPoints(res.data);
          this.props.setLoader(false);
          if (!suggest) {
            this.props.setSearchResults(res.data);
            this.props.history.push(`${searchQueryPath}${value}`);
            if (this.props.match.path === searchPath) {
              this.setState({
                value: '',
              });
            }
          }
        })
        .catch(err => {
          this.props.setLoader(false);
          if (err && err.response && err.response.data.errors) {
            this.props.history.push(searchNotAvailablePath);
          }
        });
    }
  };

  prepareSuggestions = rawArray => {
    this.clearSuggestions();
    rawArray.forEach(item => {
      switch (item._index) {
        case 'user':
          this.suggestions[0].data.push({
            name: `${item._source.first_name} ${item._source.last_name}`,
            address: item._source.primary_address,
          });
          break;
        case 'company':
          this.suggestions[1].data.push({
            name: item._source.name,
            address: item._source.summary,
          });
          break;
        case 'property':
          this.suggestions[2].data.push({
            name: this.PropDataService.setPropertyByType(
              item._source,
              'address'
            ),
            // address: this.PropDataService.setPropertyByType(item._source, 'address')
          });
          break;
        default:
      }
    });
    this.setState({
      suggestions: this.suggestions.filter(el => el.data.length),
    });
  };

  clearSuggestions = () => {
    this.suggestions.forEach((item, index) => {
      this.suggestions[index].data = [];
    });
  };

  onChange = (e, { newValue }) => {
    this.setState({
      value: newValue,
    });
    if (newValue.length > SEARCH_SUGGESTIONS_LENGTH) {
      this.fetchSearch(newValue, true);
    }
  };

  escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  getSuggestions = value => {
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    return this.suggestions.filter(el => el.data.length);
  };

  getSuggestionValue = suggestion => suggestion.name;

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue }) => {
    console.log(suggestion, suggestionValue);
    this.setState({
      value: '',
    });
    this.props.setSelectedPropertySuggestions({
      value: suggestionValue,
      propertyId: suggestion.id,
      placeId: suggestion.place_id,
    });
    this.setMarker(suggestion.place_id);
    this.fetchSearch(suggestionValue);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  getSectionSuggestions = section => section.data;

  Search = new SearchService();

  PropDataService = new PropertiesService();
  Api = new ApiService();

  renderSectionTitle = section => <strong>{section.title}</strong>;

  renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
      <br />
      {suggestion.address}
    </div>
  );

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

  getAllData = () => {};

  render() {
    // const { value } = this.state;

    // const inputProps = {
    //   placeholder: 'Search: Address, Building, Company or User',
    //   value,
    //   onChange: this.onChange
    // };

    return (
      <form onSubmit={this.handleSubmit} className="search-form">
        {/* <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          multiSection
          renderSectionTitle={this.renderSectionTitle}
          getSectionSuggestions={this.getSectionSuggestions}
          inputProps={inputProps}
        /> */}
        <i className="fa fa-search" aria-hidden="true" />
        <AutosuggestComponent
          id="autosuggest"
          suggestionType="property"
          placeholder="Search: Address, Building, Company or User"
          getAllData={this.getAllData}
          onSuggestionSelected={this.onSuggestionSelected}
          propertyValue={this.props.propertyValue}
        />
        <MapContainer />
      </form>
    );
  }
}

SearchForm.propTypes = {
  setSearchResults: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchComponent);
