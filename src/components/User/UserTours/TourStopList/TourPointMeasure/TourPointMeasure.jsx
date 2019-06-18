import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TourPointMeasure.css';

class TourPointMeasure extends Component {
  metersToMiles = meters => {
    return +(meters * 0.00062137).toFixed(2);
  };

  render() {
    const { props } = this;
    return (
      <div className="stop-path">
        {props.posts.length > 1 && props.number !== props.posts.length - 1 && (
          <div className="tour-point-measure">
            {props.routeStopParams[props.number] && (
              <span className="distance">
                {this.metersToMiles(
                  props.routeStopParams[props.number].distance.value
                )}{' '}
                Miles
              </span>
            )
            /*: <span className="distance">{(Math.random() + 1).toFixed(2)} Miles</span>*/
            }
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    routeStopParams: state.map.routeStopParams,
  };
};
export default connect(mapStateToProps)(TourPointMeasure);
