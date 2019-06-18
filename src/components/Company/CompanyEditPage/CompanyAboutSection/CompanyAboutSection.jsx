import React from 'react';
import { connect } from 'react-redux';
import originalMoment from 'moment';
import { extendMoment } from 'moment-range';
import {
  Grid,
  Row,
  Col,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';
import DateRangePicker from 'react-daterange-picker';
import 'react-daterange-picker/dist/css/react-calendar.css';
import PropTypes from 'prop-types';
import CompanySummary from './CompanySummary/CompanySummary';
import CompanySocialLinks from './CompanySocialLinks/CompanySocialLinks';
import FieldGroup from '../FieldGroup/FieldGroup';
import { editCompany, switchRangePicker } from '../../../../actions/editAction';
import './CompanyAboutSection.css';

const moment = extendMoment(originalMoment);

const mapStateToProps = state => ({
  companyEdit: state.edit.company,
  companyData: state.company,
  isRangePickerOpen: state.edit.isRangePickerOpen,
});

const mapDispatchToProps = {
  editCompany,
  switchRangePicker,
};

const isSaveDisabled = props => {
  if (
    props.companyEdit &&
    props.companyData &&
    props.companyEdit.name === props.companyData.name &&
    props.companyEdit.summary === props.companyData.summary &&
    props.companyEdit.google_plus_url === props.companyData.google_plus_url &&
    props.companyEdit.facebook_url === props.companyData.facebook_url &&
    props.companyEdit.linkedin_url === props.companyData.linkedin_url &&
    props.companyEdit.twitter_url === props.companyData.twitter_url &&
    props.companyEdit.website_url === props.companyData.website_url &&
    props.companyEdit.established_at === props.companyData.established_at &&
    props.companyEdit.closed_at === props.companyData.closed_at
  ) {
    return true;
  }
  return false;
};

const saveAboutData = (e, props) => {
  e.preventDefault();
  props.saveCompany('about');
};

const addNewWebSite = (e, props) => {
  e.preventDefault();
};

const openPicker = props => {
  props.switchRangePicker(true);
};

const selectRange = (value, state, props) => {
  props.editCompany('established_at', moment(value.start).toISOString());
  props.editCompany('closed_at', moment(value.end).toISOString());
  props.switchRangePicker(false);
};

const setRange = props => {
  const closedAt = moment(props.companyEdit.closed_at).format('MMMM, YYYY');
  const establishedAt = moment(props.companyEdit.established_at).format(
    'MMMM, YYYY'
  );
  if (closedAt === moment().format('MMMM, YYYY')) {
    return `${establishedAt} - Present`;
  }
  return `${establishedAt} - ${closedAt}`;
};

const CompanyAboutSection = props => (
  <div className="company-about-section user-edit-section">
    <form onSubmit={e => saveAboutData(e, props)} className="company-edit-form">
      <Grid>
        <Row>
          <Col lg={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="company name"
              name="name"
              placeholder="Company name"
              title={props.companyEdit.name}
              data={props}
            />
          </Col>
          <Col lg={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="headline"
              name="headline"
              placeholder="Company headline.."
              title={props.companyEdit.headline}
              disabled
              data={props}
            />
          </Col>
        </Row>
      </Grid>
      <CompanySummary />
      <CompanySocialLinks />
      <Grid>
        <Row>
          <Col lg={9} md={9} sm={9} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="company website link"
              name="website_url"
              placeholder="Company website link"
              title={props.companyEdit.website_url}
              data={props}
            />
          </Col>
          <Col lg={3} md={3} sm={3} xs={12}>
            <Button
              bsClass="btn btn-default button-main add-new-input pull-right"
              onClick={e => addNewWebSite(e, props)}
            >
              add new website
            </Button>
          </Col>
          <Col lg={12}>
            <FormGroup controlId="formBasicText">
              <ControlLabel className="company-settings-label">
                active time
              </ControlLabel>
              <FormControl
                type="text"
                onClick={() => openPicker(props)}
                readOnly
                value={setRange(props)}
              />
            </FormGroup>
            {props.isRangePickerOpen && (
              <DateRangePicker
                value={moment.range(
                  moment(props.companyEdit.established_at).format('MMMM, YYYY'),
                  moment(props.companyEdit.closed_at).format('MMMM, YYYY')
                )}
                onSelect={(value, state) => selectRange(value, state, props)}
                numberOfCalendars={2}
              />
            )}
          </Col>
          <Col lg={12}>
            <Button
              bsClass="btn btn-default button-main pull-right"
              disabled={isSaveDisabled(props)}
              type="submit"
            >
              save
            </Button>
          </Col>
        </Row>
      </Grid>
    </form>
  </div>
);

CompanyAboutSection.defaultProps = {
  companyEdit: null,
  isRangePickerOpen: null,
};

CompanyAboutSection.propTypes = {
  companyEdit: PropTypes.instanceOf(Object),
  isRangePickerOpen: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyAboutSection);
