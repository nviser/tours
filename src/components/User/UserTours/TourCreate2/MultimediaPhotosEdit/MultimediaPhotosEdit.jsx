import React, { Component } from 'react';
import Attachment from '../UploadMultimediaPanel/Modals/ModalPhotos/Attachment/Attachment';
import Dropzone from 'react-dropzone';
import './MultimediaPhotosEdit.css';
import cancelImg from '../../../../../assets/img/cancel.png';
import { connect } from 'react-redux';
import * as actions from '../../../../../actions/tours';

const MAX_SIZE = 5242880;

class MultimediaPhotosEdit extends Component {
  state = {
    errorPhotos: '',
    error: '',
  };

  onCancel = type => {
    if (type === 'video') {
      this.props.onSetMultimedia(null);
    } else if (type === 'audio') {
      this.props.setAudioFile(null);
    }

    this.setState({ error: '' });
  };
  onDrop = (files, accepted) => {
    let currentFiles = this.props.files.concat(files);
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
      this.setState({ errorPhotos: 'Your image has exceeded the size limit.' });
      return;
    }
    this.props.onSetPhotos(currentFiles);
    this.setState({ errorPhotos: '' });
  };
  deleteAttachmentHandler = name => {
    let files = [...this.props.files];

    let filtered = files.filter(file => {
      if (file.name !== name) {
        return file;
      }
      return false;
    });

    this.props.onSetPhotos(filtered);
  };
  onChangeMedia = (file, accepted) => {
    if (file[0].size > MAX_SIZE) {
      this.setState({ error: 'Your image has exceeded the size limit.' });
      return;
    }
    this.props.onSetMultimedia(file[0]);
    this.setState({
      error: '',
    });
  };
  onChangeAudio = file => {
    if (file[0].size > MAX_SIZE) {
      this.setState({ error: 'Your image has exceeded the size limit.' });
      return;
    }
    this.props.setAudioFile(file[0]);
    this.setState({
      error: '',
    });
  };
  render() {
    let files = this.props.files.map((file, index) => {
      return (
        <Attachment
          name={file.name}
          preview={file.preview || file.path}
          key={index}
          onCancel={this.deleteAttachmentHandler}
        />
      );
    });

    let preview = '';
    if (
      this.props.multimedia &&
      (this.props.multimedia.type || this.props.multimedia.mime_type).slice(
        0,
        5
      ) === 'video'
    ) {
      preview = (
        <video height="100%" width="100%" controls>
          <source
            src={
              (!!this.props.multimedia.preview &&
                this.props.multimedia.preview) ||
              (!!this.props.multimedia.path && this.props.multimedia.path)
            }
          />
        </video>
      );
    } else if (
      this.props.multimedia &&
      (this.props.multimedia.type || this.props.multimedia.mime_type).slice(
        0,
        5
      ) === 'audio'
    ) {
      preview = (
        <audio height="100%" width="100%" controls>
          <source
            src={
              (!!this.props.multimedia.preview &&
                this.props.multimedia.preview) ||
              (!!this.props.multimedia.path && this.props.multimedia.path)
            }
          />
        </audio>
      );
    }

    return (
      <div className="multimedia-photos-edit">
        <div>
          {this.props.multimedia ? (
            <div className="multimedia-photos-edit-preview-multimedia">
              <div className="preview-multimedia-header">
                <div className="preview-multimedia-name">
                  {this.props.multimedia.name}
                </div>
              </div>
              <div className="preview-multimedia-player">
                {preview}
                <div
                  className="preview-multimedia-cancel"
                  onClick={() => this.onCancel('video')}
                >
                  <img src={cancelImg} alt="cancel" />
                </div>
              </div>
            </div>
          ) : (
            <Dropzone
              accept="video/mov, video/mp4, video/avi, video/flv, audio/mp3, audio/ab1,audio/ab2, audio/ab3"
              onDrop={(accepted, rejected) =>
                this.onChangeMedia(accepted, rejected)
              }
              className="multimedia-photos-edit-add-multimedia"
              multiple={false}
            >
              <div className="upload-video">
                <div className="upload-multimedia-image">
                  <i className="fa fa-video-camera" /> Upload Video
                </div>
              </div>
            </Dropzone>
          )}
          <div className="modal-multi-error">{this.state.error}</div>
        </div>
        <div>
          {this.props.audio ? (
            <div className="multimedia-photos-edit-preview-multimedia">
              <div className="preview-multimedia-header">
                <div className="preview-multimedia-name">
                  {this.props.audio.name}
                </div>
              </div>
              <div className="preview-multimedia-player">
                <audio height="100%" width="100%" controls>
                  <source
                    src={
                      (!!this.props.audio.preview &&
                        this.props.audio.preview) ||
                      (!!this.props.audio.path && this.props.audio.path)
                    }
                  />
                </audio>
                <div
                  className="preview-multimedia-cancel"
                  onClick={() => this.onCancel('audio')}
                >
                  <img src={cancelImg} alt="cancel" />
                </div>
              </div>
            </div>
          ) : (
            <Dropzone
              accept="video/mov, video/mp4, video/avi, video/flv, audio/mp3, audio/ab1,audio/ab2, audio/ab3"
              onDrop={(accepted, rejected) =>
                this.onChangeAudio(accepted, rejected)
              }
              className="multimedia-photos-edit-add-multimedia"
              multiple={false}
            >
              <div className="upload-video">
                <div className="upload-multimedia-image">
                  <i className="fa fa-music" /> Upload Audio
                </div>
              </div>
            </Dropzone>
          )}
          <div className="modal-multi-error">{this.state.error}</div>
        </div>
        <div className="multimedia-photos-edit-container">
          <div className="multimedia-photos-edit-photos">{files}</div>
          <Dropzone
            onDrop={(accepted, rejected) => this.onDrop(accepted, rejected)}
            accept="image/*"
            className="multimedia-photos-edit-add-photo"
          >
            {/* <img src={addPhoto} alt="plus" /> */}
            <div className="upload-video">
              <div className="upload-multimedia-image">
                <i className="fa fa-camera" /> Upload Photos
              </div>
            </div>
          </Dropzone>
          <div className="modal-multi-error">{this.state.errorPhotos}</div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetMultimedia: file => dispatch(actions.setMultimediaFile(file)),
    setAudioFile: file => dispatch(actions.setAudioFile(file)),
    onSetPhotos: files => dispatch(actions.setPhotos(files)),
  };
};

const mapStateToProps = state => {
  return {
    multimedia: state.tours.multimedia,
    files: state.tours.photos,
    audio: state.tours.audio,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultimediaPhotosEdit);
