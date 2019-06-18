import React, { Component } from 'react';
import { Grid, Row, Col, FormControl, Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import AutosuggestComponent from '../../AutosuggestComponent/AutosuggestComponent';
import { propertyIdPath } from '../../../utils/paths';
import {
  setPermitDocumentOption,
  setHistoricalDocumentOption,
  setDocumentIssuedBy,
  setHistDocumentAuthor,
  setPermitDocumentAuthor,
  setHistDocumentCompany,
  setPermitDocumentCompany,
  setDocumentPublishedBy,
  setDocumentYear,
  setSelectedDocType,
  setSelectedWorkType,
  setEventDate,
  setCompanyWork,
} from '../../../actions/addPostOptions';
import './PostTypesFields.css';

const mapStateToProps = state => ({
  photo: state.postOptions.photo,
  work: state.postOptions.work,
  document: state.postOptions.document,
  permitDocument: state.postOptions.permitDocument,
  historicalDocument: state.postOptions.historicalDocument,
  suggestions: state.suggest.suggestions,
  selectedWorkCompanySuggestion: state.suggest.selectedWorkCompanySuggestion,
  selectedPerDocCompanySuggestion:
    state.suggest.selectedPerDocCompanySuggestion,
  selectedHistDocCompanySuggestion:
    state.suggest.selectedHistDocCompanySuggestion,
  permitDocumentCompany: state.postOptions.permitDocumentCompany,
  histDocumentCompany: state.postOptions.histDocumentCompany,
  documentIssuedBy: state.postOptions.documentIssuedBy,
  permitDocumentAuthor: state.postOptions.permitDocumentAuthor,
  histDocumentAuthor: state.postOptions.histDocumentAuthor,
  documentPublishedBy: state.postOptions.documentPublishedBy,
  documentYear: state.postOptions.documentYear,
  eventDate: state.postOptions.eventDate,
  companyWork: state.postOptions.companyWork,
});

const mapDispatchToProps = {
  setPermitDocumentOption,
  setHistoricalDocumentOption,
  setDocumentIssuedBy,
  setHistDocumentAuthor,
  setPermitDocumentAuthor,
  setHistDocumentCompany,
  setPermitDocumentCompany,
  setDocumentPublishedBy,
  setDocumentYear,
  setSelectedDocType,
  setSelectedWorkType,
  setEventDate,
  setCompanyWork,
};

class PostTypesFields extends Component {
  componentWillReceiveProps(next) {
    switch (true) {
      case next.selectedWorkCompanySuggestion &&
        this.props.selectedWorkCompanySuggestion.companyId !==
          next.selectedWorkCompanySuggestion.companyId:
        this.switchCompany(next.selectedWorkCompanySuggestion.companyId);
        break;
      case next.selectedPerDocCompanySuggestion &&
        this.props.selectedPerDocCompanySuggestion.companyId !==
          next.selectedPerDocCompanySuggestion.companyId:
        this.setPermitDocumentCompany(
          next.selectedPerDocCompanySuggestion.companyId
        );
        break;
      case next.selectedHistDocCompanySuggestion &&
        this.props.selectedHistDocCompanySuggestion.companyId !==
          next.selectedHistDocCompanySuggestion.companyId:
        this.setHistDocumentCompany(
          next.selectedHistDocCompanySuggestion.companyId
        );
        break;
      default:
    }
  }
  setHistDocumentCompany = id => {
    this.props.setHistDocumentCompany(id || '');
  };

  setPermitDocumentCompany = id => {
    this.props.setPermitDocumentCompany(id || '');
  };

  setHistDocumentAuthor = e => {
    this.props.setHistDocumentAuthor(e.target.value);
  };

  setPermitDocumentAuthor = e => {
    this.props.setPermitDocumentAuthor(e.target.value);
  };

  switchCompany = id => {
    this.props.setCompanyWork(id || '');
  };

  switchDate = date => {
    this.props.setEventDate(date);
  };

  switchDocType = e => {
    switch (e.target.value) {
      case '1':
        this.props.setPermitDocumentOption(true);
        this.props.setHistoricalDocumentOption(false);
        break;
      case '2':
        this.props.setPermitDocumentOption(false);
        this.props.setHistoricalDocumentOption(true);
        break;
      default:
    }
    this.props.setSelectedDocType(e.target.value);
  };

  switchWorkType = e => {
    this.props.setSelectedWorkType(e.target.value);
  };

  render() {
    const isItPropertyPage =
      this.props.urlData && this.props.urlData.path === propertyIdPath;
    const { isItRoutes } = this.props;
    return (
      <Grid>
        <Row className="show-grid">
          <Col lg={6} md={6} sm={6} xs={6}>
            <DatePicker
              className="picker-occured-date"
              placeholderText="Add Date (if different from today)"
              readOnly
              selected={this.props.eventDate}
              onChange={this.switchDate}
            />
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div
              className={`location-selector ${
                isItPropertyPage || isItRoutes ? 'hidden' : ''
              }`}
            >
              <Glyphicon glyph="map-marker" className="map-marker" />
              <AutosuggestComponent
                suggestionType="property"
                placeholder="Location"
                selector=".add-post-component"
              />
            </div>
          </Col>
        </Row>
        <Row className={`${this.props.work ? '' : 'hidden'}`}>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className="location-selector">
              <Glyphicon
                glyph="glyphicon glyphicon-tower"
                className="map-marker"
              />
              <AutosuggestComponent
                suggestionType="companyWork"
                placeholder="Company"
              />
            </div>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <FormControl
              componentClass="select"
              placeholder="select"
              onChange={this.switchWorkType}
            >
              <option defaultValue hidden>
                Select Work Type
              </option>
              {this.props.workTypes.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </FormControl>
          </Col>
        </Row>
        <Row className={`${this.props.document ? '' : 'hidden'}`}>
          <Col lg={12} md={12} sm={12} xs={12}>
            <FormControl
              componentClass="select"
              placeholder="select"
              onChange={this.switchDocType}
            >
              <option defaultValue hidden>
                Select Document Type
              </option>
              {this.props.docTypes.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </FormControl>
          </Col>
        </Row>
        <Row className={`${this.props.permitDocument ? '' : 'hidden'}`}>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className="location-selector">
              <Glyphicon
                glyph="glyphicon glyphicon-tower"
                className="map-marker"
              />
              <AutosuggestComponent
                suggestionType="permitDocument"
                placeholder="Company"
              />
            </div>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <FormControl
              onChange={this.setPermitDocumentAuthor}
              type="text"
              value={this.props.permitDocumentAuthor}
              placeholder="Author"
            />
          </Col>
        </Row>
        <Row className={`${this.props.historicalDocument ? '' : 'hidden'}`}>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className="location-selector">
              <Glyphicon
                glyph="glyphicon glyphicon-tower"
                className="map-marker"
              />
              <AutosuggestComponent
                suggestionType="historicalDocument"
                placeholder="Company"
              />
            </div>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <FormControl
              onChange={this.setHistDocumentAuthor}
              type="text"
              value={this.props.histDocumentAuthor}
              placeholder="Author"
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

PostTypesFields.defaultProps = {
  urlData: null,
  permitDocumentCompany: '',
  histDocumentCompany: '',
  permitDocumentAuthor: '',
  histDocumentAuthor: '',
  eventDate: null,
  selectedCompanySuggestion: null,
  companyWork: '',
  isItRoutes: null,
  selectedWorkCompanySuggestion: null,
  selectedPerDocCompanySuggestion: null,
  selectedHistDocCompanySuggestion: null,
};
PostTypesFields.propTypes = {
  setPermitDocumentOption: PropTypes.func.isRequired,
  setHistoricalDocumentOption: PropTypes.func.isRequired,
  setSelectedDocType: PropTypes.func.isRequired,
  setSelectedWorkType: PropTypes.func.isRequired,
  setPermitDocumentCompany: PropTypes.func.isRequired,
  setHistDocumentCompany: PropTypes.func.isRequired,
  work: PropTypes.bool.isRequired,
  document: PropTypes.bool.isRequired,
  permitDocument: PropTypes.bool.isRequired,
  historicalDocument: PropTypes.bool.isRequired,
  urlData: PropTypes.instanceOf(Object),
  docTypes: PropTypes.instanceOf(Array).isRequired,
  workTypes: PropTypes.instanceOf(Array).isRequired,
  permitDocumentCompany: PropTypes.string,
  histDocumentCompany: PropTypes.string,
  permitDocumentAuthor: PropTypes.string,
  histDocumentAuthor: PropTypes.string,
  setHistDocumentAuthor: PropTypes.func.isRequired,
  setPermitDocumentAuthor: PropTypes.func.isRequired,
  selectedWorkCompanySuggestion: PropTypes.instanceOf(Object),
  selectedPerDocCompanySuggestion: PropTypes.instanceOf(Object),
  selectedHistDocCompanySuggestion: PropTypes.instanceOf(Object),
  setEventDate: PropTypes.func.isRequired,
  setCompanyWork: PropTypes.func.isRequired,
  eventDate: PropTypes.instanceOf(Object),
  selectedCompanySuggestion: PropTypes.instanceOf(Object),
  companyWork: PropTypes.string,
  isItRoutes: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostTypesFields);
