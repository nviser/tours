import React from 'react';
import './UploadMultimedia.css';

const createContent = type => {
  switch (type) {
    case 'photos': {
      return (
        <div className="upload-multimedia-image">
          <i className="fa fa-camera" />
          <span>Upload Photos</span>
        </div>
      );
    }
    case 'video': {
      return (
        <div className="upload-multimedia-image">
          <i className="fa fa-video-camera" />
          <span>Upload Videos</span>
        </div>
      );
    }
    case 'audio': {
      return (
        <div className="upload-multimedia-image">
          <i className="fa fa-music" />
          <span>Upload Audio</span>
        </div>
      );
    }
    default: {
      return null;
    }
  }
};

const UploadVideo = props => (
  <div className="upload-video" onClick={() => props.showModal(props.type)}>
    {createContent(props.title)}
  </div>
);

export default UploadVideo;
