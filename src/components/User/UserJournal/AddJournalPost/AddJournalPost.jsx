import React, { Component } from 'react';
import { Image, Button, Glyphicon, FormControl } from 'react-bootstrap';
import TextareaAutoHeight from '../../../TextareaAutoHeight';
import { connect } from 'react-redux';
import {
  routesApiPath,
  postsPath,
  attachmentsPath,
} from '../../../../utils/paths';
import ApiService from '../../../../services/ApiService/ApiService';
import AlertComponent from '../../../../components/AlertComponent/AlertComponent';
import ReactImageFallback from 'react-image-fallback';
import noImg from '../../../../assets/img/icons/no-photo.png';
import loader from '../../../../assets/img/loading.gif';
import { setLoader } from '../../../../actions/loaderActions';
import { getList } from '../../../../actions/userJournalList';

const Api = new ApiService();

const UploadedPreview = props => {
  const { className = '', files = [], remove } = props;

  if (!files || !files.length) return null;

  return (
    <div className={className}>
      {files.map((file, index) => (
        <div key={index} className="img-preview">
          {remove && (
            <Button
              bsClass="btn btn-remove-uploaded"
              onClick={() => remove(file)}
            >
              <Glyphicon glyph="glyphicon glyphicon-remove" />
            </Button>
          )}
          <Image responsive src={file.tempUrl} alt="upload image" />
        </div>
      ))}
    </div>
  );
};

// class TagSearch extends Component {
//     constructor(props){
//         super(props);
//
//         this._checkClick = this._checkClick.bind(this);
//         this._container = React.createRef();
//     }
//
//     componentDidMount(){
// 		document.addEventListener('click', this._checkClick, true);
// 	}
//
// 	componentWillUnmount(){
// 		document.removeEventListener('click', this._checkClick, true);
// 	}
//
// 	_checkClick(e){
// 		let target = e.target;
//         const container = this._container && this._container.current;
//
//         if (container) {
//             while (target.parentNode && target.tagName.toLowerCase() !== 'body') {
//                 if (target === container) {
//                     return false;
//                 }
//                 target = target.parentNode;
//             }
//
//             if (this.props.onClose) this.props.onClose();
//         }
// 	}
//
//     render () {
//
//         const {
//             className='',
//             isEdited,
//             onClose
//         } = this.props;
//
//         if (!isEdited) return null;
//
//         return (
//             <div ref={this._container}
//                 className={`select-block ${className}`}
//             >
//                 <div className="block-label">
//                     <span>Tag People:</span>
//                 </div>
//                 <div className="input-block">
//                     <FormControl
//                         autoFocus={true}
//                         rows="1"
//                         componentClass="textarea"
//                         className="search-textarea"
//                         placeholder="Enter name"
//                     />
//                 </div>
//                 <div className="close-block">
//                     <Button bsClass="btn btn-large btn-select-close"
//                         onClick={ onClose }
//                     >
//                         <Glyphicon glyph="glyphicon glyphicon-remove"/>
//                     </Button>
//                 </div>
//             </div>
//         )
//     }
//
// }

class LocationSearch extends Component {
  constructor(props) {
    super(props);

    this._checkClick = this._checkClick.bind(this);
    this._container = React.createRef();

    this.state = {
      locations: [],
    };
  }

  componentDidMount() {
    document.addEventListener('click', this._checkClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._checkClick, true);
  }

  _checkClick(e) {
    let target = e.target;
    const container = this._container && this._container.current;

    if (container) {
      while (target.parentNode && target.tagName.toLowerCase() !== 'body') {
        if (target === container) {
          return false;
        }
        target = target.parentNode;
      }

      if (this.props.onClose) this.props.onClose();
    }
  }

  getRoutes = async () => {
    if (this.props.user_id) {
      let routes = [];
      try {
        const response = await Api.getComponent(`${routesApiPath}`);
        routes = response.data || [];
      } catch (err) {
        console.error(err);
      }

      this.setState({
        locations: routes,
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.isEdited && this.props.isEdited) {
      this.getRoutes();
    }
  }

  handlerSelectTour = item => {
    this.props.onClose();
    if (typeof this.props.onSelectLocation === 'function') {
      this.props.onSelectLocation(item);
    }
  };

  render() {
    const { className = '', isEdited, onClose, location } = this.props;

    if (!isEdited && !location) return null;

    const locations = this.state.locations || [];

    return (
      <div ref={this._container} className={`select-block ${className}`}>
        <div className="block-label">
          <span>Location:</span>
        </div>
        {isEdited ? (
          <div className="search-block">
            <div className="input-block">
              <FormControl
                autoFocus={true}
                rows="1"
                componentClass="textarea"
                className="search-textarea"
                placeholder="Enter location"
              />
              {locations && locations.length ? (
                <div className="search-list">
                  {locations.map((location, index) => {
                    return (
                      <div
                        className="search-item"
                        key={index}
                        onClick={() => this.handlerSelectTour(location)}
                      >
                        {location.name}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <div className="close-block">
              <Button
                bsClass="btn btn-large btn-select-close"
                onClick={onClose}
              >
                <Glyphicon glyph="glyphicon glyphicon-remove" />
              </Button>
            </div>
          </div>
        ) : location ? (
          <div className="location-info-block">
            <div>{location.name}</div>
          </div>
        ) : null}
      </div>
    );
  }
}

class AddJournalPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagSearchIsEdited: false,
      locationSearchIsEdited: false,
      post_text: '',
      location: null,
      files: [],
    };
  }

  handlerChangeStory = value => {
    this.setState({
      post_text: value,
    });
  };

  handlerSelectedFile = event => {
    const files = this.state.files;
    const file = event.target.files[0];

    if (file) {
      files.push({
        fileObj: file,
        tempUrl: URL.createObjectURL(file),
      });

      this.setState({
        files: files,
      });
    }
  };

  handlerUnselectedFile = file => {
    this.setState(prev => {
      return {
        files: prev.files.filter(item => item.tempUrl !== file.tempUrl),
      };
    });
  };

  handlerSelectLocation = location => {
    this.setState({ location });
  };

  handlerCreatePost = async () => {
    this.alertComponent.handleDismiss();
    const userData = this.props.userData;
    const post_text = this.state.post_text.trim();

    const { location } = this.state;

    if (!post_text) {
      this.alertComponent.handleShow(
        'Empty comment. Please, comment your post!'
      );
      return;
    }

    if (!location) {
      this.alertComponent.handleShow('Please, select location!');
      return;
    }

    this.props.setLoader(true);

    try {
      const response = await Api.sendComponent(
        {
          user_id: userData.id,
          title: location.name,
          route_id: location.id,
          route_stop_id: location.id,
          content: post_text,
          post_type_id: 4,
          event_date: new Date(),
        },
        `${postsPath}`
      );

      const post = response.data;

      await this.sendFiles(post.id);

      this.setState({
        tagSearchIsEdited: false,
        locationSearchIsEdited: false,
        post_text: '',
        location: null,
        files: [],
      });

      await this.props.getList(0);
    } catch (err) {
      if (err && err.response && err.response.data.errors) {
        const obj = err.response.data.errors;
        this.alertComponent.handleShow(
          `${Object.keys(obj)[0]}:  ${obj[Object.keys(obj)[0]].msg}`
        );
      }
    }

    this.props.setLoader(false);
  };

  sendFiles = async post_id => {
    const { files } = this.state;

    if (files && files.length) {
      this.props.setLoader(true);

      const formData = new FormData();

      files.forEach((file, i) => {
        formData.append(`attachment_${i}`, file.fileObj);
      });

      try {
        await Api.uploadFiles(
          formData,
          `${postsPath}/${post_id}${attachmentsPath}`
        );
      } catch (err) {
        if (err && err.response && err.response.data.errors) {
          const obj = err.response.data.errors;
          this.alertComponent.handleShow(
            `${Object.keys(obj)[0]}:  ${obj[Object.keys(obj)[0]].msg}`
          );
        }
      }

      this.props.setLoader(false);
    }

    return true;
  };

  showPeopleSearch = e => {
    e.stopPropagation();
    this.setState({ tagSearchIsEdited: true });
  };

  showLocationSearch = e => {
    e.stopPropagation();
    this.setState({ locationSearchIsEdited: true });
  };

  render() {
    const { avatar = null } = this.props;

    return (
      <div className="add-post-journal">
        <AlertComponent
          ref={instance => {
            this.alertComponent = instance;
          }}
        />
        <div className="title-block">
          <div className="user-avatar">
            <ReactImageFallback
              src={avatar}
              initialImage={loader}
              fallbackImage={noImg}
              alt="avatar-img"
              className="avatar-img"
            />
          </div>
          <div className="user-main-block">
            <TextareaAutoHeight
              className="form-control user-story-textarea"
              maxRows={10}
              minRows={3}
              lineHeight={18}
              placeholder="Add your Story..."
              value={this.state.post_text}
              onChange={this.handlerChangeStory}
            />
          </div>
          <div className="btn-post-wrap">
            <Button
              bsClass="btn btn-large btn-send"
              onClick={this.handlerCreatePost}
            >
              <Glyphicon glyph="glyphicon glyphicon-send" />
            </Button>
          </div>
        </div>
        <UploadedPreview
          className="uploaded-preview"
          files={this.state.files}
          remove={this.handlerUnselectedFile}
        />
        {/*<TagSearch
                    visible={this.state.tagSearchVisible}
                    onClose={() => this.setState({tagSearchVisible:false})}
                />*/}
        <LocationSearch
          className="location-search"
          user_id={this.props.userData.id}
          onSelectLocation={this.handlerSelectLocation}
          location={this.state.location}
          isEdited={this.state.locationSearchIsEdited}
          onClose={() => this.setState({ locationSearchIsEdited: false })}
        />
        <div className="select-action-block">
          <div className="btn-wrap">
            <Button bsClass="btn btn-large btn-select-type upload-btn">
              <input
                type="file"
                className="upload-btn-input"
                onChange={this.handlerSelectedFile}
                accept="image/jpeg, image/png"
              />
              <Glyphicon glyph="glyphicon glyphicon-camera" /> Photo
            </Button>
          </div>
          {/*<div className="btn-wrap">
                        <Button bsClass="btn btn-large btn-select-type"
                            onClick={ this.showPeopleSearch }
                        >
                            <Glyphicon glyph="glyphicon glyphicon-user"/> Tag People
                        </Button>
                    </div>*/}
          <div className="btn-wrap">
            <Button
              bsClass="btn btn-large btn-select-type"
              onClick={this.showLocationSearch}
            >
              <Glyphicon glyph="glyphicon glyphicon-map-marker" /> Add Location
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userData: state.auth.userData,
  avatar: state.auth.avatar,
});

export default connect(
  mapStateToProps,
  {
    setLoader,
    getList,
  }
)(AddJournalPost);
