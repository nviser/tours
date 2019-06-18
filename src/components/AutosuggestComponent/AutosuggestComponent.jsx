import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import SearchService from '../../services/SearchService/SearchService';
import {
  SEARCH_PROPERTY_SUGGESTIONS_LENGTH,
  SEARCH_COMPANY_SUGGESTIONS_LENGTH,
} from '../../utils/const';
import { propertySearchPath, companySearchPath } from '../../utils/paths';
import {
  setSuggestions,
  setSelectedPropertySuggestions,
  setSelectedWorkCompanySuggestions,
  setSelectedPerDocCompanySuggestions,
  setSelectedHistDocCompanySuggestions,
  setSelectedSignUpSuggestions,
} from '../../actions/suggestActions';
import { setCompanyWork } from '../../actions/addPostOptions';
import './Autosuggest.css';
const Search = new SearchService();

const getSuggestionValue = suggestion => suggestion.description;

const renderSuggestion = suggestion => <div>{suggestion.description}</div>;

const mapDispatchToProps = {
  setSuggestions,
  setSelectedPropertySuggestions,
  setSelectedWorkCompanySuggestions,
  setSelectedPerDocCompanySuggestions,
  setSelectedHistDocCompanySuggestions,
  setCompanyWork,
  setSelectedSignUpSuggestions,
};

const mapStateToProps = state => ({
  suggestions: state.suggest.suggestions,
  companyWorkValue: state.suggest.selectedWorkCompanySuggestion.value,
  companyPerDocValue: state.suggest.selectedPerDocCompanySuggestion.value,
  companyHistDocValue: state.suggest.selectedHistDocCompanySuggestion.value,
  signUpValue: state.suggest.selectedSignUpSuggestion.value,
});

class AutosuggestComponent extends Component {
  state = {
    suggestions: [],
    sugAbove: false,
  };
  componentDidMount = () => {
    if (!this.props.noReset) {
      this.props.setSelectedPropertySuggestions({});
    }
  };

  componentWillReceiveProps(nextState) {
    if (this.props.suggestions !== nextState.suggestions) {
      this.setPostTypesPosition(nextState.suggestions);
    }
  }

  onChange = (event, { newValue }) => {
    switch (this.props.suggestionType) {
      case 'property':
        this.props.setSelectedPropertySuggestions({
          value: newValue,
        });
        break;
      case 'companyWork':
        this.props.setSelectedWorkCompanySuggestions({
          value: newValue,
        });
        break;
      case 'permitDocument':
        this.props.setSelectedPerDocCompanySuggestions({
          value: newValue,
        });
        break;
      case 'historicalDocument':
        this.props.setSelectedHistDocCompanySuggestions({
          value: newValue,
        });
        break;
      case 'sign_up':
        this.props.setSelectedSignUpSuggestions({
          value: newValue,
        });
        break;
      default:
    }
  };

  onSuggestionsFetchRequested = ({ value }) => {
    switch (true) {
      case this.props.suggestionType === 'property':
        this.getProperty(value);
        break;
      case this.props.suggestionType === 'companyWork' ||
        this.props.suggestionType === 'historicalDocument' ||
        this.props.suggestionType === 'permitDocument':
        this.getCompany(value);
        break;
      case this.props.suggestionType === 'sign_up':
        this.getProperty(value);
        break;
      default:
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
    this.props.setSuggestions([]);
  };

  setPostTypesPosition = data => {
    this.setState({
      sugAbove: this.setSuggestionPosition(data, this.props.selector),
    });
  };

  setSuggestionPosition = (data, selector) => {
    if (selector) {
      const element = document.querySelector(selector);
      const elementTopDistance = element.offsetTop;
      const elementHeight = element.clientHeight;
      const parentElementHeight = element.parentNode.clientHeight;
      const delta = parentElementHeight - elementTopDistance - elementHeight;
      return (
        (delta <= 30 && data.length > 1) || (delta <= 300 && data.length > 3)
      );
    }
    return false;
  };

  setSugToStore = sug => {
    this.props.setSuggestions(sug);
  };

  getProperty = query => {
    if (query.length > SEARCH_PROPERTY_SUGGESTIONS_LENGTH) {
      Search.searchProperty(propertySearchPath, query).then(res => {
        this.setState(
          {
            suggestions: res.data,
          },
          () => this.setSugToStore(this.state.suggestions)
        );
      });
    }
  };

  getCompany = query => {
    if (query.length > SEARCH_COMPANY_SUGGESTIONS_LENGTH) {
      Search.search(companySearchPath, query).then(res => {
        this.setState(
          {
            suggestions: res.data,
          },
          () => this.setSugToStore(this.state.suggestions)
        );
      });
    }
  };

  getSugValue = () => {
    switch (this.props.suggestionType) {
      case 'property':
        return this.props.propertyValue;
      case 'companyWork':
        return this.props.companyWorkValue;
      case 'permitDocument':
        return this.props.companyPerDocValue;
      case 'historicalDocument':
        return this.props.companyHistDocValue;
      case 'sign_up':
        return this.props.signUpValue;
      default:
        return '';
    }
  };

  onEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
    }
  };

  render() {
    const { suggestions, sugAbove } = this.state;
    const value = this.getSugValue() || '';

    const inputProps = {
      placeholder: this.props.placeholder,
      value,
      onChange: this.onChange,
      onKeyDown: this.onEnterPress,
    };
    return (
      <div
        className={`${sugAbove ? 'sug-above' : ''} ${
          this.props.errors && this.props.errors.length ? 'has-errors' : ''
        }`}
      >
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionSelected={this.props.onSuggestionSelected}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

AutosuggestComponent.defaultProps = {
  propertyValue: '',
  companyWorkValue: '',
  companyPerDocValue: '',
  companyHistDocValue: '',
  placeholder: '',
  selector: '',
  suggestionType: '',
  getAllData: null,
  setMarker: null,
  suggestions: [],
  noReset: false,
};
AutosuggestComponent.propTypes = {
  setSuggestions: PropTypes.func.isRequired,
  setSelectedPropertySuggestions: PropTypes.func.isRequired,
  setSelectedWorkCompanySuggestions: PropTypes.func.isRequired,
  setSelectedPerDocCompanySuggestions: PropTypes.func.isRequired,
  setSelectedHistDocCompanySuggestions: PropTypes.func.isRequired,
  getAllData: PropTypes.func,
  setMarker: PropTypes.func,
  propertyValue: PropTypes.string,
  companyWorkValue: PropTypes.string,
  companyPerDocValue: PropTypes.string,
  companyHistDocValue: PropTypes.string,
  suggestionType: PropTypes.string,
  placeholder: PropTypes.string,
  selector: PropTypes.string,
  suggestions: PropTypes.instanceOf(Array),
  noReset: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutosuggestComponent);
