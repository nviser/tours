import React, { Component } from 'react';
import './ModalPhotos.css';
import uploadImg from '../../../../../../../assets/img/upload.svg';
import Dropzone from 'react-dropzone';
import Attachment from './Attachment/Attachment';
import './ModalPhotos.css';
import plusImg from '../../../../../../../assets/img/plus.png';
import { connect } from 'react-redux';
import * as actions from '../../../../../../../actions/tours';

const MAX_SIZE = 5242880;

class ModalPhotos extends Component {
  state = {
    files: [],
    error: '',
  };
  onDrop = (files, accepted) => {
    let currentFiles = this.state.files.concat(files);
    let sizes = 0;
    let names = [];
    for (let i = 0; i < currentFiles.length; i++) {
      sizes += +currentFiles[i].size;
      if (names.includes(currentFiles[i].name)) {
        this.setState({
          errorPhotos: 'File with that name has already been added',
        });
        return;
      }
      names.push(currentFiles[i].name);
    }
    if (sizes >= MAX_SIZE) {
      this.setState({ error: 'Your image has exceeded the size limit.' });
      return;
    }
    this.setState({ files: currentFiles, error: '' });
  };
  onCancel = () => {
    this.setState({
      files: [],
      error: '',
    });
  };
  closeAttachmentHandler = name => {
    let files = [...this.state.files];

    let filtered = files.filter(file => {
      if (file.name !== name) {
        return file;
      }
      return false;
    });

    this.setState({
      files: [...filtered],
    });
  };
  modalClosedHandler = () => {
    this.onCancel();
    this.props.modalClosed('showPhotosModal');
  };
  donePhotosHandler = () => {
    this.props.onSetPhotos(this.state.files);
    this.modalClosedHandler();
  };
  render() {
    let files = this.state.files.map((file, index) => {
      return (
        <Attachment
          name={file.name}
          preview={file.preview}
          key={index}
          onCancel={this.closeAttachmentHandler}
        />
      );
    });

    return (
      <div className="modal-multi">
        <div className="modal-multi-title">Upload Photos</div>
        {!this.state.files.length ? (
          <div>
            <Dropzone
              accept="image/*"
              onDrop={(accepted, rejected) => this.onDrop(accepted, rejected)}
              className="modal-multi-dnd"
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
                JPG, JPEG, GIF or BMP format
              </div>
            </Dropzone>
          </div>
        ) : (
          <div className="modal-multi-files">
            {files}
            <Dropzone
              onDrop={(accepted, rejected) => this.onDrop(accepted, rejected)}
              accept="image/*"
              className="modal-multi-add-photo"
            >
              <img src={plusImg} alt="plus" />
              Add photo
            </Dropzone>
          </div>
        )}
        <div className="modal-multi-error">{this.state.error}</div>
        {/* <div className="modal-multi-btns">
                    <button className="btn-back button-main" onClick={this.modalClosedHandler}>cancel</button>
                    <button
                        onClick={this.donePhotosHandler}
                        className="btn-next button-main"
                        disabled={!this.state.files.length > 0}>
                        done
                    </button>
                </div> */}
        <div className="favorite-tours-bottom">
          <button className="cancel-btn" onClick={this.modalClosedHandler}>
            Cancel
          </button>
          <button
            className="success-btn"
            disabled={!this.state.files.length > 0}
            onClick={this.donePhotosHandler}
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
    onSetPhotos: files => dispatch(actions.setPhotos(files)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ModalPhotos);
