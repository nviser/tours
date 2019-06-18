import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import { React_Bootstrap_Carousel as ReactBootstrapCarousel } from 'react-bootstrap-carousel';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-carousel/dist/react-bootstrap-carousel.css';
import './Carousel.css';

const renderVideo = data => (
  <video
    src={`${data.file.path}`}
    width="100%"
    className="carousel-slide-video"
    controls
  />
);

const renderImage = data => (
  <Image
    alt={`${data.file.file_prefix}`}
    className="carousel-slide-img"
    responsive
    src={data.file.path}
  />
);

const checkFileType = data => {
  switch (true) {
    case /video/.test(data.file.mime_type):
      return renderVideo(data);
    case /image/.test(data.file.mime_type):
      return renderImage(data);
    default:
      return null;
  }
};

const Carousel = props => (
  <div>
    <div className="row">
      <div className="col-md-12">
        <ReactBootstrapCarousel indicators={false}>
          {props.slides.map(item => (
            <div key={item.file_id} className="carousel-slide-container">
              {checkFileType(item)}
            </div>
          ))}
        </ReactBootstrapCarousel>
      </div>
    </div>
  </div>
);

Carousel.propTypes = {
  slides: PropTypes.instanceOf(Array).isRequired,
};

export default Carousel;
