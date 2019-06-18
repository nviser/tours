import React from 'react';
import moment from 'moment';
import './TourBottom.css';

const TourBottom = ({ route }) => (
  <div className="purch-tours-block-bottom">
    <div className="bottom-dates">
      <div className="create-date">
        <p className="date-title">Purchased:</p>
        <p>{moment(route.purchased_at).format('MM/DD/YY')}</p>
      </div>
      <div className="update-date">
        <p className="date-title">Days Left:</p>
        <p>{route.available_days}</p>
      </div>
    </div>
    <div className="bottom-status">
      <div className={`tour-status ${route.is_expired ? 'expired' : ''}`}>
        {route.is_expired ? 'Expired' : 'Available'}
      </div>
    </div>
  </div>
);

export default TourBottom;
