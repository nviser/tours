import React, { Component } from 'react';
import './UploadMultimediaPanel.css';
import MultiplyPhotos from './MuliplyPhotos/MultiplyPhotos';
import UploadMultimedia from './UploadMultimedia/UploadMultimedia';
import videoImg from '../../../../../assets/img/video.png';
import audioImg from '../../../../../assets/img/audio.png';
import Modal from '../../../../UI/Modal/Modal';
import ModalMultimedia from './Modals/ModalMultimedia/ModalMultimedia';
import ModalPhotos from './Modals/ModalPhotos/ModalPhotos';

class UploadMultimediaPanel extends Component {
  state = {
    showMultiModal: false,
    showAudioModal: false,
    showPhotosModal: false,
  };

  toggleModalHandler = type => {
    this.setState(prevState => ({
      [type]: !prevState[type],
    }));
  };
  render() {
    return (
      <div className="multi-panel">
        <div className="multi-panel-inputs">
          <div className="multi-panel-once">
            <div>
              <MultiplyPhotos
                title="photos"
                showModal={type => this.toggleModalHandler(type)}
              />
            </div>
            <div>
              <UploadMultimedia
                img={videoImg}
                title="video"
                type="showMultiModal"
                showModal={type => this.toggleModalHandler(type)}
              />
            </div>
            <div>
              <UploadMultimedia
                img={audioImg}
                title="audio"
                type="showAudioModal"
                showModal={type => this.toggleModalHandler(type)}
              />
            </div>
          </div>
        </div>
        <Modal show={this.state.showMultiModal}>
          <ModalMultimedia
            type="showMultiModal"
            title="Upload video"
            modalClosed={type => this.toggleModalHandler(type)}
          />
        </Modal>
        <Modal show={this.state.showAudioModal}>
          <ModalMultimedia
            type="showAudioModal"
            title="Upload audio"
            modalClosed={type => this.toggleModalHandler(type)}
          />
        </Modal>
        <Modal show={this.state.showPhotosModal}>
          <ModalPhotos modalClosed={type => this.toggleModalHandler(type)} />
        </Modal>
      </div>
    );
  }
}

export default UploadMultimediaPanel;
