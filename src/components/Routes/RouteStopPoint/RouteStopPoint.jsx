import React, { Component } from 'react';
import { Glyphicon, Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RouteStopForm from '../RouteStopForm/RouteStopForm';
import ApiService from '../../../services/ApiService/ApiService';
import PropertiesService from '../../../services/PropertiesService/PropertiesService';
import { setSelectedPropertySuggestions } from '../../../actions/suggestActions';
import { selectRoutes } from '../../../actions/routes';
import { setProperties } from '../../../actions/mapActions';
import { routesApiPath, propertiesPath } from '../../../utils/paths';
import './RouteStopPoint.css';

const mapStateToProps = state => ({
  editedRouteId: state.routes.editedRouteId,
  properties: state.map.properties,
  routeStopParams: state.map.routeStopParams,
  selectedRoutePoints: state.routes.selectedRoutePoints,
});

const mapDispatchToProps = {
  setSelectedPropertySuggestions,
  selectRoutes,
  setProperties,
};

class RouteStopPoint extends Component {
  state = {
    routePostPropertyName: 'Loading...',
  };

  componentDidMount() {
    if (!this.props.itIsRoutes) {
      this.getPropertyName();
    }
  }

  getPropertyName = () => {
    if (this.props.editedRouteId && this.props.point.propertyId) {
      this.Api.getComponent(`${propertiesPath}/${this.props.point.propertyId}`)
        .then(res => {
          this.setState({
            routePostPropertyName: this.PropDataService.setPropertyByType(
              res.data,
              'address'
            ),
          });
          const propRawCoord = res.data.geo_location.geometry.coordinates;
          const propRawId = res.data.id;
          const propRaw = this.props.properties.map(i => i);
          let isRepeated = false;
          propRaw.map(item => {
            if (item.id === propRawId) {
              isRepeated = true;
            }
            return item;
          });
          if (!isRepeated) {
            propRaw.push({ id: propRawId, coords: propRawCoord });
            this.props.setProperties(propRaw);
          }
        })
        .catch();
    }
  };

  Api = new ApiService();
  PropDataService = new PropertiesService();

  editRouteStop = () => {
    this.props.resetSelectedProperty();
    this.props.getAllData(this.props.point.propertyId, this.props.point.postId);
    this.props.editRouteStop(this.props.point.postId);
  };

  exitEditMode = () => {
    this.props.editRouteStop(-1);
  };

  editRoute = () => {
    const routeId = this.props.point.id;
    this.Api.getComponent(`${routesApiPath}/${routeId}/posts`)
      .then(res => {
        this.prepareToEdit(res.data);
        this.props.editRoute();
      })
      .catch(err => {
        console.log(err);
      });
  };

  prepareToEdit = rawArr => {
    const arr = [];
    rawArr.forEach((item, i) => {
      arr[i] = {
        postId: item.id,
        propertyId: item.property_id,
      };
    });
    this.props.selectRoutes(arr);
  };

  render() {
    const { props } = this;
    return (
      <div>
        {props.point.editModeEnabled ? (
          <RouteStopForm
            turnOffRouteForm={this.exitEditMode}
            exitEditMode={this.exitEditMode}
            editMode
            resetSelectedProperty={this.props.resetSelectedProperty}
            getAllData={this.props.getAllData}
            point={this.props.point}
          />
        ) : (
          <div className="route-stop-point">
            <Grid>
              <div className={`point-data ${props.itIsRoutes ? 'margin' : ''}`}>
                <Row className="show-grid">
                  <Col lg={2} md={2} sm={2} xs={2} className="point-block">
                    <div className="point-icon">
                      <Glyphicon
                        glyph="map-marker"
                        className={`map-marker ${
                          props.itIsRoutes ? 'hidden' : ''
                        }`}
                      />
                      <Glyphicon
                        glyph="road"
                        className={`${props.itIsRoutes ? '' : 'hidden'}`}
                      />
                    </div>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={8} className="point-block">
                    <div className="point-building-name">
                      <div className="point-content">
                        <h4 className="point-header">
                          {props.itIsRoutes ? 'tour name' : 'building name'}
                        </h4>
                        <p className="point-text">
                          {props.itIsRoutes
                            ? props.point.name
                            : props.point.propertyName ||
                              this.state.routePostPropertyName}
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg={2} md={2} sm={2} xs={2} className="point-block">
                    <div
                      className="point-edit"
                      onClick={
                        props.itIsRoutes ? this.editRoute : this.editRouteStop
                      }
                    >
                      <Glyphicon glyph="pencil" className="pencil" />
                    </div>
                  </Col>
                </Row>
              </div>
              <div
                className={`point-measure ${props.itIsRoutes ? 'hidden' : ''}`}
              >
                <Row>
                  <Col
                    lgOffset={1}
                    mdOffset={1}
                    smOffset={1}
                    xsOffset={1}
                    lg={2}
                    md={2}
                    sm={2}
                    xs={2}
                    className="point-block"
                  >
                    <div className="point-unit pseudo-dashed-border">
                      <Glyphicon glyph="time" className="pencil" />
                      {props.routeStopParams[props.number] &&
                        props.routeStopParams[props.number].duration.text}
                    </div>
                  </Col>
                  <Col lg={9} md={9} sm={9} xs={9} className="point-block">
                    <div className="point-unit">
                      <Glyphicon glyph="road" className="pencil" />
                      {props.routeStopParams[props.number] &&
                        props.routeStopParams[props.number].distance.text}
                    </div>
                  </Col>
                </Row>
              </div>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

RouteStopPoint.defaultProps = {
  getAllData: null,
  point: null,
  resetSelectedProperty: null,
  editRoute: null,
  editRouteStop: null,
  editedRouteId: null,
  itIsRoutes: null,
  properties: [],
};
RouteStopPoint.propTypes = {
  resetSelectedProperty: PropTypes.func,
  editRoute: PropTypes.func,
  editRouteStop: PropTypes.func,
  selectRoutes: PropTypes.func.isRequired,
  setProperties: PropTypes.func.isRequired,
  getAllData: PropTypes.func,
  editedRouteId: PropTypes.number,
  point: PropTypes.instanceOf(Object),
  properties: PropTypes.instanceOf(Array),
  itIsRoutes: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteStopPoint);
