import React from 'react';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Grid,
  Row,
  Col,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { editCompany } from '../../../../../actions/editAction';
import './CompanySummary.css';

const mapDispatchToProps = {
  editCompany,
};

const mapStateToProps = state => ({
  companyEdit: state.edit.company,
});

const handleChange = (e, name, props) => {
  props.editCompany(name, e.target.value);
};

const CompanySummary = props => (
  <div className="company-settings-summary">
    <Grid>
      <Row className="show-grid">
        <Col lg={12}>
          <FormGroup controlId="formControlsTextarea">
            <ControlLabel className="company-settings-label">
              summary
            </ControlLabel>
            <FormControl
              componentClass="textarea"
              placeholder="Type something here about your company..."
              value={props.companyEdit.summary || ''}
              onChange={e => {
                handleChange(e, 'summary', props);
              }}
            />
          </FormGroup>
        </Col>
      </Row>
    </Grid>
  </div>
);

CompanySummary.defaultProps = {
  companyEdit: null,
};
CompanySummary.propTypes = {
  companyEdit: PropTypes.instanceOf(Object),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanySummary);
