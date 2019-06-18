import React, { Component } from 'react';
import './PreviewTourStop.css';
import { connect } from 'react-redux';
import playerImg from '../../../../../assets/img/player.png';
import noImg from '../../../../../assets/img/icons/no-photo.png';
import ReactImageFallback from 'react-image-fallback';
import loaderImg from '../../../../../assets/img/loading.gif';
import { API_URL } from '../../../../../config';

class PreviewTourStop extends Component {
  state = {
    address: '',
  };
  componentDidMount = () => {
    this.setAddress(this.props.data.placeId);
  };

  setAddress = placeId => {
    const geocoder = new window.google.maps.Geocoder();

    return geocoder.geocode({ placeId: placeId }, (results, status) => {
      if (status === 'OK') {
        let shortNames = results[0].address_components.map(
          item => item.short_name
        );
        let address = shortNames.join(' ');
        this.setState({ address });
      }
    });
  };

  setImg = () => {
    let file = '';
    if (this.props.data.post && this.props.data.post.attachments) {
      let attachments = this.props.data.post.attachments;
      let postId = this.props.data.post.id;
      if (attachments && attachments[0]) {
        for (let i = 0; i < attachments.length; i++) {
          if (attachments[i]['file']['mime_type'].slice(0, 5) === 'image') {
            file = `${API_URL}/posts/${postId}/attachments/${
              attachments[i]['file']['id']
            }?width=480`;
            break;
          }
        }
      }
    }
    return file;
  };
  render() {
    let preview = '';
    if (
      this.props.multimedia &&
      ((this.props.multimedia.type &&
        this.props.multimedia.type.slice(0, 5) === 'video') ||
        (!!this.props.multimedia.mime_type &&
          this.props.multimedia.mime_type.slice(0, 5) === 'video'))
    ) {
      preview = (
        <video height="100%" width="100%" controls>
          <source
            src={this.props.multimedia.preview || this.props.multimedia.path}
          />
        </video>
      );
    } else if (
      this.props.multimedia &&
      ((this.props.multimedia.type &&
        this.props.multimedia.type.slice(0, 5) === 'audio') ||
        (this.props.multimedia.mime_type &&
          this.props.multimedia.mime_type.slice(0, 5) === 'audio'))
    ) {
      preview = (
        <audio height="300" width="500" controls>
          <source
            src={this.props.multimedia.preview || this.props.multimedia.path}
          />
        </audio>
      );
    }
    let files = this.props.photos.map((file, index) => {
      return (
        <div className="preview-tour-stop-photo" key={index}>
          <img src={file.preview || file.path} alt="preview" />
        </div>
      );
    });

    return (
      <div>
        <div className="preview-tour-stop">
          <div className="preview-tour-stop-point">
            <ReactImageFallback
              src={
                (this.props.photos[0] && this.props.photos[0].preview) ||
                this.setImg()
              }
              initialImage={loaderImg}
              fallbackImage={noImg}
              alt="preview stop icon"
              className="preview-tour-stop-image"
            />
            {/*<div className="preview-tour-stop-image">*/}
            {/*<img className="preview-tour-stop-icon-img" alt="preview stop icon" src={(this.props.photos[0] && this.props.photos[0].preview) || noImg} />*/}
            {/*</div>*/}
            <div className="preview-tour-stop-info">
              <div className="preview-tour-stop-title">
                {this.props.data.title}
              </div>
              <div className="point-text">{this.state.address}</div>
            </div>
            <div className="preview-tour-stop-number">
              {this.props.posts.length + 1}
            </div>
          </div>
          <div className="preview-tour-stop-container">
            {this.props.multimedia && (
              <div className="preview-tour-stop-video">
                <div className="preview-tour-stop-video-title">
                  <div className="preview-tour-stop-video-icon">
                    <img src={playerImg} alt="player" />
                  </div>
                  <div className="preview-tour-stop-video-icon-title">
                    {(this.props.multimedia.type &&
                      this.props.multimedia.type.slice(0, 5)) ||
                      (this.props.multimedia.mime_type &&
                        this.props.multimedia.mime_type.slice(0, 5))}
                  </div>
                </div>
                {preview}
              </div>
            )}
            {this.props.audio && (
              <div className="preview-tour-stop-video">
                <div className="preview-tour-stop-video-title">
                  <div className="preview-tour-stop-video-icon">
                    <img src={playerImg} alt="player" />
                  </div>
                  <div className="preview-tour-stop-video-icon-title">
                    {(this.props.audio.type &&
                      this.props.audio.type.slice(0, 5)) ||
                      (this.props.audio.mime_type &&
                        this.props.audio.mime_type.slice(0, 5))}
                  </div>
                </div>
                <audio height="300" width="500" controls>
                  <source
                    src={this.props.audio.preview || this.props.audio.path}
                  />
                </audio>
              </div>
            )}
            <div className="preview-tour-stop-description">
              {this.props.data.content}
            </div>
            <div className="preview-tour-stop-photos">{files}</div>
          </div>
        </div>
        {/* <div className="stop-bottom">
                    <button className="btn-back button-main" onClick={this.props.cancelPreview}>back</button>
                    <button className="btn-next button-main" onClick={this.props.completeStopHandler}>complete stop</button>
                </div> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    photos: state.tours.photos,
    multimedia: state.tours.multimedia,
    posts: state.posts,
    audio: state.tours.audio,
    editedRouteId: state.routes.editedRouteId,
  };
};

export default connect(mapStateToProps)(PreviewTourStop);
