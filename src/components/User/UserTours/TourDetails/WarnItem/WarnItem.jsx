import React, { Fragment } from 'react';
import exclImg from '../../../../../assets/img/exclamation.png';
import './WarnItem.css';

const WarnItem = ({ count }) => (
  <Fragment>
    <div className="stop-path">
      <div className="tour-point-measure">
        <span className="distance">{(Math.random() + 1).toFixed(2)} Miles</span>
      </div>
    </div>
    <div className="stop-point-container unpurchased">
      <div className="stop-left">
        <div className="stop-img">
          <img src={exclImg} alt="exclamation" />
        </div>
        <div className="stop-descr">
          <div className="stop-item-header">
            <h4>
              <span>{count}</span> more tour stops
            </h4>
          </div>
          <div className="stop-info-text">
            Please purchase tour to gain access to every tour stop.
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);

export default WarnItem;
