import React, { Component } from 'react';
import uploadImg from '../../../../assets/img/upload.svg';
import Dropzone from 'react-dropzone';
import './UploadPhoto.css';
import { connect } from 'react-redux';
import * as actions from '../../../../actions/tours';
import Cropper from 'react-easy-crop';

const MAX_SIZE = 15242880;

class UploadPhoto extends Component {
  constructor(props) {
    super(props);
    this.crop = {
      imageSrc: null,
      crop: { x: 0, y: 0 },
      zoom: 1,
      maxZoom: 10,
      aspect: this.props.aspectRatio || 1,
      cropSize:
        this.props.aspectRatio && this.props.aspectRatio !== 1
          ? null
          : {
              width: 125,
              height: 125,
            },
      croppedAreaPixels: null,
      croppedImage: null,
    };
    this.state = {
      origFile: null,
      error: '',
      file: null,
      ...this.crop,
    };
  }

  onDrop = (files, accepted) => {
    const file = files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () =>
      this.setState({ imageSrc: reader.result, error: '', origFile: file })
    );

    if (file.size >= MAX_SIZE) {
      this.setState({ error: 'You have increased the files size.' });
      return;
    }
    reader.readAsDataURL(file);
  };
  onCancel = () => {
    this.setState({
      origFile: null,
      error: '',
      file: null,
      ...this.crop,
    });
  };

  modalClosedHandler = () => {
    this.onCancel();
    this.props.modalClosed();
  };

  donePhotosHandler = () => {
    if (this.props.type === 'avatar') {
      this.props.avatarHandler(this.state.file);
    } else {
      this.props.backgroundHandler(this.state.file);
    }
    this.modalClosedHandler();
  };

  onZoomChange = zoom => {
    this.setState({ zoom });
  };

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({ croppedAreaPixels }, () => {
      this.makeClientCrop();
    });
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  async getCroppedImg(imageSrc, pixelCrop) {
    const createImage = url =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', error => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
      });

    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (!blob) {
            reject();
          }
          resolve(blob);
        },
        'image/jpeg',
        1
      );
    });
  }

  async makeClientCrop() {
    if (this.state.imageSrc && this.state.croppedAreaPixels) {
      const croppedImage = await this.getCroppedImg(
        this.state.imageSrc,
        this.state.croppedAreaPixels
      );
      this.setState({ file: croppedImage });
    }
  }

  setZoom = e => {
    this.setState({ zoom: e.target.value });
  };

  /////////////////////

  render() {
    return (
      <div className="modal-multi">
        <div className="modal-multi-title">Upload Photo</div>
        <div>
          {!this.state.origFile ? (
            <Dropzone
              accept="image/*"
              onDrop={(accepted, rejected) => this.onDrop(accepted, rejected)}
              className="modal-multi-dnd"
              multiple={false}
            >
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
            </Dropzone>
          ) : (
            <div>
              <div className="crop-container">
                <Cropper
                  image={this.state.imageSrc}
                  crop={this.state.crop}
                  zoom={this.state.zoom}
                  maxZoom={this.state.maxZoom}
                  aspect={this.state.aspect}
                  cropSize={this.state.cropSize}
                  onCropChange={this.onCropChange}
                  onCropComplete={this.onCropComplete}
                  onZoomChange={this.onZoomChange}
                />
              </div>
              <label className="crop-zoom">
                <span className="crop-zoom-label">Zoom:</span>
                <input
                  className="crop-zoom-input"
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={this.state.zoom}
                  onChange={this.setZoom}
                />
              </label>
            </div>
          )}
        </div>

        <div className="modal-multi-error">{this.state.error}</div>
        <div className="modal-multi-btns">
          <button className="btn-back" onClick={this.modalClosedHandler}>
            cancel
          </button>
          <button
            onClick={this.donePhotosHandler}
            className="btn-next"
            disabled={!this.state.origFile}
          >
            done
          </button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setTourPhoto: files => dispatch(actions.setTourPhoto(files)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(UploadPhoto);
