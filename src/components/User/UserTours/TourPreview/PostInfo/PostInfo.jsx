import React, { Component } from 'react';
import ApiService from '../../../../../services/ApiService/ApiService';
import { postsPath } from '../../../../../utils/paths';
import { connect } from 'react-redux';
import { setMultimediaFile, setPhotos } from '../../../../../actions/tours';
import playerImg from '../../../../../assets/img/player.png';
import { API_URL } from '../../../../../config.js';

class PostInfo extends Component {
  state = {
    post: null,
    photos: [],
    mulitimedia: null,
    audio: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.active && !this.state.post) {
      this.getPostData(this.props.post.id);
    }
  }
  ApiService = new ApiService();
  getPostData = id => {
    this.ApiService.getComponent(`${postsPath}/${id}`)
      .then(response => {
        this.setState({ post: response.data });
        this.attachmentsHandler(response.data.attachments);
      })
      .catch(e => {});
  };
  attachmentsHandler = attachments => {
    let photos = [...this.props.photos];
    for (let i = 0; i < attachments.length; i++) {
      if (attachments[i].file.mime_type.slice(0, 5) === 'image') {
        photos.push(attachments[i].file);
        this.setState({ photos: photos });
      } else if (attachments[i].file.mime_type.slice(0, 5) === 'video') {
        this.setState({ multimedia: attachments[i].file });
      } else if (attachments[i].file.mime_type.slice(0, 5) === 'audio') {
        this.setState({ audio: attachments[i].file });
      }
    }
  };
  render() {
    let preview = '';
    if (
      this.state.multimedia &&
      ((this.state.multimedia.type &&
        this.state.multimedia.type.slice(0, 5) === 'video') ||
        (!!this.state.multimedia.mime_type &&
          this.state.multimedia.mime_type.slice(0, 5) === 'video'))
    ) {
      preview = (
        <video height="246" width="480" controls>
          <source
            src={this.state.multimedia.preview || this.state.multimedia.path}
          />
        </video>
      );
    } else if (
      this.state.multimedia &&
      ((this.state.multimedia.type &&
        this.state.multimedia.type.slice(0, 5) === 'audio') ||
        (this.state.multimedia.mime_type &&
          this.state.multimedia.mime_type.slice(0, 5) === 'audio'))
    ) {
      preview = (
        <audio height="300" width="480" controls>
          <source
            src={this.state.multimedia.preview || this.state.multimedia.path}
          />
        </audio>
      );
    }
    let files = this.state.photos.map((file, index) => {
      return (
        <div className="preview-tour-stop-photo" key={index}>
          <img
            src={
              `${API_URL}/posts/${this.state.post.id}/attachments/${
                file.id
              }?width=200` || file.path
            }
            alt="preview"
          />
        </div>
      );
    });
    return (
      <div>
        <div className="preview-tour-stop-container">
          {this.state.multimedia && (
            <div className="preview-tour-stop-video">
              <div className="preview-tour-stop-video-title">
                <div className="preview-tour-stop-video-icon">
                  <img src={playerImg} alt="player" />
                </div>
                <div className="preview-tour-stop-video-icon-title">
                  {(this.state.multimedia.type &&
                    this.state.multimedia.type.slice(0, 5)) ||
                    (this.state.multimedia.mime_type &&
                      this.state.multimedia.mime_type.slice(0, 5))}
                </div>
              </div>
              {preview}
            </div>
          )}
          {this.state.audio && (
            <div className="preview-tour-stop-video">
              <div className="preview-tour-stop-video-title">
                <div className="preview-tour-stop-video-icon">
                  <img src={playerImg} alt="player" />
                </div>
                <div className="preview-tour-stop-video-icon-title">
                  {(this.state.multimedia.type &&
                    this.state.multimedia.type.slice(0, 5)) ||
                    (this.state.multimedia.mime_type &&
                      this.state.multimedia.mime_type.slice(0, 5))}
                </div>
              </div>
              <audio height="300" width="480" controls>
                <source
                  src={this.state.audio.preview || this.state.audio.path}
                />
              </audio>
            </div>
          )}
          <div className="preview-tour-stop-description">
            {this.state.post && this.state.post.content}
          </div>
          <div className="preview-tour-stop-photos">{files}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  multimedia: state.tours.multimedia,
  photos: state.tours.photos,
  audio: state.tours.audio,
});

const mapDispatchToProps = dispatch => {
  return {
    setMultimediaFile: file => dispatch(setMultimediaFile(file)),
    setPhotos: photos => dispatch(setPhotos(photos)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostInfo);
