import React, { Component } from 'react';
import Slider from 'react-slick';
import { Modal, Button } from 'react-bootstrap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './SliderView.css';
import img_modal_close from './img/modal_close.png';
import { API_URL } from '../../../config';

export default class SliderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPreview: false,
      previewImage: null,
    };
  }

  previewImage(e) {
    e.preventDefault();

    if (!e.target.dataset || !e.target.dataset || !e.target.dataset.fullImage) {
      return false;
    }

    const image = e.target.dataset.fullImage;

    this.setState(() => ({
      isShowPreview: true,
      previewImage: image,
    }));
  }

  closePreview() {
    this.setState(() => ({
      isShowPreview: false,
      previewImage: null,
    }));
  }

  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <div>
        <Modal
          show={this.state.isShowPreview}
          onHide={this.closePreview.bind(this)}
        >
          <Modal.Body>
            <Button onClick={this.closePreview.bind(this)}>
              <img src={img_modal_close} alt="close" />
            </Button>
            <img src={this.state.previewImage} alt="" />
          </Modal.Body>
        </Modal>

        <Slider {...settings}>
          {this.props.images.map(image => {
            if (!image.file) {
              return null;
            }

            const { id = null, mime_type = '' } = image.file;

            return (
              <div key={id} className="slider-view">
                <div className="slide">
                  {~mime_type.search(/^image/i) ? (
                    <img
                      onDoubleClick={this.previewImage.bind(this)}
                      className="content-image"
                      alt=""
                      data-full-image={`${API_URL}/posts/${
                        image.post_id
                      }/attachments/${image.file.id}`}
                      src={`${API_URL}/posts/${image.post_id}/attachments/${
                        image.file.id
                      }?width=512`}
                    />
                  ) : ~mime_type.search(/^video/i) ? (
                    <video
                      className="content-video"
                      width="100%"
                      autoPlay={false}
                      loop={false}
                      muted={true}
                      preload="metadata"
                      controls={true}
                      src={image.file.path}
                      poster={image.file.thumbnail.path}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    );
  }
}
