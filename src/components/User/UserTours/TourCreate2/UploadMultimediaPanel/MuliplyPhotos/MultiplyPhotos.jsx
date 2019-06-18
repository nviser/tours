import React, { Component } from 'react';
import './MultiplyPhotos.css';

class MultiplyPhotos extends Component {
  render() {
    return (
      <div
        className="upload-video"
        onClick={() => this.props.showModal('showPhotosModal')}
      >
        <div className="upload-multimedia-image">
          <i className="fa fa-camera" /> Upload Photos
        </div>
      </div>
    );
  }
}

export default MultiplyPhotos;
