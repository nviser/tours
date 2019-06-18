import React, { Component } from 'react';
import './MultimediaPreview.css';
import cancelImg from '../../../../../../../../assets/img/cancel.png';

class MultimediaPreview extends Component {
  render() {
    let preview = '';
    if (this.props.file.type.slice(0, 5) === 'video') {
      preview = (
        <video height="246" width="570" controls>
          <source src={this.props.file.preview} />
        </video>
      );
    } else {
      preview = (
        <audio height="300" controls>
          <source src={this.props.file.preview} />
        </audio>
      );
    }
    return (
      <div className="preview-multimedia">
        <div className="preview-multimedia-header">
          <div className="preview-multimedia-name">{this.props.file.name}</div>
          <div className="preview-multimedia-complete">Complete upload</div>
        </div>
        <div className="preview-multimedia-player">
          <div>{preview}</div>
          <div
            className="preview-multimedia-cancel"
            onClick={this.props.onCancel}
          >
            <img src={cancelImg} alt="cancel" />
          </div>
        </div>
      </div>
    );
  }
}

export default MultimediaPreview;
