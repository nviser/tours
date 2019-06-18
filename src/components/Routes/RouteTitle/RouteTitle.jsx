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
import { setRouteTitle } from '../../../actions/routes';
import { setTravelMode } from '../../../actions/mapActions';
import './RouteTitle.css';

const mapDispatchToProps = {
  setRouteTitle,
  setTravelMode,
};

const mapStateToProps = state => ({
  routeTitle: state.routes.routeTitle,
  editedRouteId: state.routes.editedRouteId,
  travelMode: state.map.travelMode,
});

const handleChange = (e, setTitle) => {
  setTitle(e.target.value);
};

const FieldGroup = ({ id, label, title, setTitle, type, ...props }) => (
  <FormGroup controlId={id}>
    <ControlLabel className="routes-label">{label}</ControlLabel>
    <FormControl
      value={title}
      onChange={e => {
        handleChange(e, setTitle);
      }}
      {...props}
    />
  </FormGroup>
);

const switchTravelMode = (e, props) => {
  props.setTravelMode(e.target.value);
};

const travelModes = [
  {
    id: 1,
    mode: 'DRIVING',
  },
  {
    id: 2,
    mode: 'WALKING',
  },
  {
    id: 3,
    mode: 'BICYCLING',
  },
];

const RouteTitle = props => (
  <div className="route-title">
    <h1 className="routes-header">
      {props.editedRouteId ? 'Edit Tour' : 'Create Tour'}
    </h1>
    <form className="route-title-form">
      <Grid>
        <Row className="show-grid">
          <Col lg={8} md={8} sm={8} xs={12}>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="tour title"
              placeholder="Your tour title..."
              title={props.routeTitle}
              setTitle={props.setRouteTitle}
            />
          </Col>
          <Col lg={4} md={4} sm={4} xs={12}>
            <FormGroup controlId="formControlsSelect">
              <ControlLabel className="routes-label">travel mode</ControlLabel>
              <FormControl
                componentClass="select"
                placeholder="select"
                value={props.travelMode}
                onChange={e => {
                  switchTravelMode(e, props);
                }}
              >
                {travelModes.map(item => (
                  <option key={item.id} value={item.mode}>
                    {item.mode}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
          </Col>
        </Row>
      </Grid>
    </form>
  </div>
);

RouteTitle.defaultProps = {
  id: null,
  label: null,
  routeTitle: '',
  travelMode: '',
  setRouteTitle: null,
  editedRouteId: null,
};
RouteTitle.propTypes = {
  id: PropTypes.string,
  routeTitle: PropTypes.string,
  travelMode: PropTypes.string,
  label: PropTypes.string,
  setRouteTitle: PropTypes.func,
  editedRouteId: PropTypes.number,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteTitle);
