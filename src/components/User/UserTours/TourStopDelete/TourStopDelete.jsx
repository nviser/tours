import React, { Component } from 'react';
import './TourStopDelete.css';
import trashImg from '../../../../assets/img/trash.png';

class TourStopDelete extends Component {
  render() {
    return (
      <div className="tour-stop-delete">
        <div className="tour-stop-delete-title">ARE YOU SURE TO DELETE?</div>
        <div className="tour-stop-delete-image">
          <img src={trashImg} alt="delete stop" />
        </div>
        <div className="tour-stop-delete-description">
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.Ut pretium
            pretium tempor.
          </span>
        </div>
        <div className="stop-bottom" id="stop-bottom">
          <button
            className="btn-back button-main"
            onClick={this.props.onCancel}
          >
            cancel
          </button>
          <button
            className="btn-next button-main"
            onClick={this.props.onDeleteStop}
          >
            {' '}
            delete
          </button>
        </div>
      </div>
    );
  }
}

export default TourStopDelete;
