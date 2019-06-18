import React from 'react';
import './TourTotal.css';
import { connect } from 'react-redux';

const TourTotal = ({ totalRouteStop, totalDistance }) => (
  <div className="tour-total">
    <div className="total-stops">
      <div className="total-top-text">Total Route Stop</div>
      <div className="total-bottom-text">{totalRouteStop} Stops</div>
    </div>
    <div className="total-distance">
      <div className="total-top-text">Total Distance</div>
      <div className="total-bottom-text">{totalDistance} Miles</div>
    </div>
  </div>
);

const mapStateToProps = state => {
  return {
    totalRouteStop: state.map.totalRouteStop,
    totalDistance: state.map.totalDistance,
  };
};

export default connect(mapStateToProps)(TourTotal);
