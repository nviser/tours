import React, { Component } from 'react';
import './ModalMultimedia.css';
import uploadImg from '../../../../../../../assets/img/upload.svg';
import Dropzone from 'react-dropzone';
import MultimediaPreview from './MuplimediaPreview/MultimediaPreview';
import { connect } from 'react-redux';
import * as actions from '../../../../../../../actions/tours';

const MAX_SIZE = 5242880;

class ModalMultimedia extends Component {
  state = {
    file: null,
    error: '',
    formats: ['video/mp4', 'video/m4v', 'video/3gp', 'audio/mp3'],
  };
  onDrop = (accepted, file) => {
    if (file[0].size > MAX_SIZE) {
    }
    if (!this.state.formats.includes(file[0].type)) {
      this.setState({ error: 'Not valid file format.' });
      return;
    }
    this.setState({
      file: file[0],
      error: '',
    });
  };

  onCancel = () => {
    this.setState({
      file: null,
      error: '',
    });
  };
  closeModalHandler = () => {
    this.onCancel();
    this.props.modalClosed(this.props.type);
  };
  doneMultimediaHandler = () => {
    console.log(this.props.type);
    if (this.props.type === 'showMultiModal') {
      this.props.onSetMultimedia(this.state.file);
    } else if (this.props.type === 'showAudioModal') {
      this.props.setAudioFile(this.state.file);
    }

    this.closeModalHandler();
  };
  render() {
    return (
      <div className="modal-multi">
        <div className="modal-multi-title">{this.props.title}</div>
        {!this.state.file ? (
          <div>
            <Dropzone
              accept=" video/mp4, video/m4v, video/3gp, audio/mp3"
              onDrop={(accepted, rejected) => this.onDrop(accepted, rejected)}
              className="modal-multi-dnd"
              maxSize={100}
              multiple={false}
            >
              <img
                src={uploadImg}
                alt="upload file"
                className="modal-multi-upload-image"
              />
              <div className="modal-multi-upload-title">
                Drag and drop to upload or browse to choose a file
              </div>
              <div className="modal-multi-formats">
                Max.5 MB <br />
                Video: MP4, M4V or 3GP format Audio: MP3 format
              </div>
            </Dropzone>
          </div>
        ) : (
          <MultimediaPreview file={this.state.file} onCancel={this.onCancel} />
        )}
        <div className="modal-multi-error">{this.state.error}</div>
        <div className="favorite-tours-bottom">
          <button className="cancel-btn" onClick={this.closeModalHandler}>
            Cancel
          </button>
          <button
            className="success-btn"
            disabled={!this.state.file}
            onClick={this.doneMultimediaHandler}
          >
            Done
          </button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetMultimedia: file => dispatch(actions.setMultimediaFile(file)),
    setAudioFile: file => dispatch(actions.setAudioFile(file)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ModalMultimedia);
