import React, { Component } from 'react';
import uploadImg from '../../../../../assets/img/upload.svg';
import Dropzone from 'react-dropzone';
import './UploadPhoto.css';
import { connect } from 'react-redux';
import * as actions from '../../../../../actions/tours';

const MAX_SIZE = 5242880;

class UploadPhoto extends Component {
  state = {
    error: '',
    file: null,
  };
  onDrop = (files, accepted) => {
    const file = files[0];

    if (file.size >= MAX_SIZE) {
      this.setState({ error: 'Your image has exceeded the size limit.' });
      return;
    }
    this.setState({ file, error: '' });
  };
  onCancel = () => {
    this.setState({
      file: null,
      error: '',
    });
  };

  modalClosedHandler = () => {
    this.onCancel();
    this.props.modalClosed();
  };

  donePhotosHandler = () => {
    this.props.onSelect(this.state.file);
    this.modalClosedHandler();
  };
  render() {
    return (
      <div className="modal-multi">
        <div className="modal-multi-title">Upload Photo</div>
        <div>
          <Dropzone
            accept="image/*"
            onDrop={(accepted, rejected) => this.onDrop(accepted, rejected)}
            className="modal-multi-dnd"
            multiple={false}
          >
            {!this.state.file ? (
              <div className="dropzone">
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
              </div>
            ) : (
              <div className="preview">
                <img src={this.state.file.preview} alt="Preview" />
              </div>
            )}
          </Dropzone>
        </div>

        <div className="modal-multi-error">{this.state.error}</div>
        <div className="modal-multi-btns">
          <button className="btn-back" onClick={this.modalClosedHandler}>
            cancel
          </button>
          <button
            onClick={this.donePhotosHandler}
            className="btn-next"
            disabled={!this.state.file}
          >
            done
          </button>
        </div>
      </div>
    );
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     setTourPhoto: files => dispatch(actions.setTourPhoto(files)),
//   };
// };

// export default connect(
//   null,
//   mapDispatchToProps
// )(UploadPhoto);

export default UploadPhoto;
