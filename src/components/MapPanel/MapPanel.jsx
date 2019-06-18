import React from 'react';
import PropTypes from 'prop-types';
import MapContainer from '../MapContainer';
import TourTotal from '../User/UserTours/TourTotal/TourTotal';
import './MapPanel.css';

const MapPanel = props => (
  <div className="map-panel">
    <MapContainer routeStop={props.routeStop} />
    {props.bottomPanel ? <TourTotal /> : null}
  </div>
);
MapPanel.defaultProps = {
  routeStop: null,
};

MapPanel.propTypes = {
  routeStop: PropTypes.bool,
};

export default MapPanel;
