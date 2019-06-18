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
import { editUser } from '../../../../../actions/editAction';
import './UserSummary.css';

const mapDispatchToProps = {
  editUser,
};

const mapStateToProps = state => ({
  userData: state.edit.user,
});

const handleChange = (e, name, props) => {
  props.editUser(name, e.target.value);
};

const UserSummary = props => (
  <div className="user-settings-summary">
    <h1 className="user-settings-header">About You</h1>
    <Grid>
      <Row className="show-grid">
        <Col lg={12}>
          <FormGroup controlId="formControlsTextarea">
            <ControlLabel className="user-settings-label">summary</ControlLabel>
            <FormControl
              componentClass="textarea"
              placeholder="Type something here about yourself..."
              value={props.userData.summary || ''}
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

UserSummary.defaultProps = {
  userData: null,
};
UserSummary.propTypes = {
  userData: PropTypes.instanceOf(Object),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSummary);
