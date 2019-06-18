import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import { Image, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setFiles } from '../../actions/fileActions';
import './UploadFile.css';
const mapDispatchToProps = {
  setFiles,
};

const mapStateToProps = state => ({
  files: state.files,
  postTypeSelected: state.postTypeSelected,
});

class UploadFile extends Component {
  onDrop = files => {
    this.props.setFiles(
      (this.props.files && this.props.files.concat(files)) || files
    );
  };

  checkFileType = file => {
    switch (true) {
      case /video/.test(file.type):
        return this.renderVideo(file);
      case /image/.test(file.type):
        return this.renderImage(file);
      default:
        return null;
    }
  };

  renderVideo = data => <video src={`${data.preview}`} width="100%" controls />;

  renderImage = data => (
    <Image
      responsive
      className="drop-img"
      src={`${data.preview}`}
      alt={`${data.name}`}
    />
  );

  render() {
    return (
      <div
        className={`drop-zone ${this.props.postTypeSelected ? '' : 'hidden'}`}
      >
        <ul className="drop-zone-list">
          {this.props.files
            .filter(f => this.checkFileType(f))
            .map((f, index) => (
              <li className="drop-zone-list-item" key={index}>
                {' '}
                {this.checkFileType(f)}
              </li>
            ))}
          <li className="drop-zone-list-item upload-block">
            <Dropzone
              className="add-zone"
              onDrop={this.onDrop}
              accept="image/jpeg, image/png, video/mp4"
              acceptClassName="add-zone-accepted"
              rejectClassName="add-zone-rejected"
            >
              <Glyphicon glyph="plus" className="plus-file" />
              <p>Add Photo</p>
            </Dropzone>
          </li>
        </ul>
      </div>
    );
  }
}
UploadFile.defaultProps = {
  files: [],
  postTypeSelected: null,
};

UploadFile.propTypes = {
  setFiles: PropTypes.func.isRequired,
  files: PropTypes.instanceOf(Array),
  postTypeSelected: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadFile);
