import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Grid,
  Row,
  Col,
  Panel,
  Image,
  FormGroup,
  Button,
  FormControl,
} from 'react-bootstrap';
import 'react-select/dist/react-select.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostService from '../../../services/PostService/PostService';
import UploadFile from '../../UploadFile/UploadFile';
import ApiService from '../../../services/ApiService/ApiService';
import PostTypes from '../PostTypes/PostTypes';
import PostTypesFields from '../PostTypesFields/PostTypesFields';
import AlertComponent from '../../../components/AlertComponent/AlertComponent';
import { addPost, setSelectedPostType } from '../../../actions/postActions';
import { setFiles } from '../../../actions/fileActions';
import { setLoader } from '../../../actions/loaderActions';
import {
  setSelectedPropertySuggestions,
  setSelectedWorkCompanySuggestions,
  setSelectedPerDocCompanySuggestions,
  setSelectedHistDocCompanySuggestions,
} from '../../../actions/suggestActions';
import {
  setPhotoOption,
  setWorkOption,
  setSelectedWorkType,
  setDocumentOption,
  setPermitDocumentOption,
  setHistoricalDocumentOption,
  setEventDate,
  setCompanyWork,
  setDocumentIssuedBy,
  setDocumentPublishedBy,
  setDocumentYear,
  setSelectedDocType,
  setHistDocumentAuthor,
  setPermitDocumentAuthor,
  setHistDocumentCompany,
  setPermitDocumentCompany,
} from '../../../actions/addPostOptions';
import userImg from '../../../assets/img/user.jpg';
import {
  usersPath,
  propertiesPath,
  companiesPath,
  propertyIdPath,
  postsPath,
  postTypesPath,
  attachmentsPath,
  documentTypesPath,
  workTypesPath,
} from '../../../utils/paths';
import { setUserPostsProperties } from '../../../actions/mapActions';
import './AddPost.css';

const Post = new PostService();
const Api = new ApiService();

const mapDispatchToProps = {
  addPost,
  setFiles,
  setLoader,
  setSelectedPropertySuggestions,
  setSelectedWorkCompanySuggestions,
  setSelectedPerDocCompanySuggestions,
  setSelectedHistDocCompanySuggestions,
  setSelectedPostType,
  setPhotoOption,
  setWorkOption,
  setSelectedWorkType,
  setDocumentOption,
  setPermitDocumentOption,
  setHistoricalDocumentOption,
  setEventDate,
  setCompanyWork,
  setDocumentIssuedBy,
  setDocumentPublishedBy,
  setDocumentYear,
  setSelectedDocType,
  setHistDocumentAuthor,
  setPermitDocumentAuthor,
  setHistDocumentCompany,
  setPermitDocumentCompany,
  setUserPostsProperties,
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  user: state.user,
  property_data: state.property,
  files: state.files,
  suggestions: state.suggest.suggestions,
  selectedPropertySuggestion: state.suggest.selectedPropertySuggestion,
  postTypeSelected: state.postTypeSelected,
  postTypes: state.postTypes,
  historicalDocument: state.postOptions.historicalDocument,
  permitDocument: state.postOptions.permitDocument,
  permitDocumentAuthor: state.postOptions.permitDocumentAuthor,
  permitDocumentCompany: state.postOptions.permitDocumentCompany,
  histDocumentAuthor: state.postOptions.histDocumentAuthor,
  histDocumentCompany: state.postOptions.histDocumentCompany,
  documentIssuedBy: state.postOptions.documentIssuedBy,
  documentAuthor: state.postOptions.documentAuthor,
  documentPublishedBy: state.postOptions.documentPublishedBy,
  documentYear: state.postOptions.documentYear,
  documentTypeSelected: state.postOptions.documentTypeSelected,
  workTypeSelected: state.postOptions.workTypeSelected,
  companyWork: state.postOptions.companyWork,
  eventDate: state.postOptions.eventDate,
  postProperties: state.map.userPage.postProperties,
});

const types = [
  {
    id: 1,
    name: 'Photos or Videos',
    icon: 'picture',
  },
  {
    id: 2,
    name: 'Work',
    icon: 'star',
  },
  {
    id: 3,
    name: 'Document',
    icon: 'list-alt',
  },
];

let input;

const AddPostComponent = withRouter(props => <AddPost {...props} />);

class AddPost extends Component {
  state = {
    postTypes: [],
    documentTypes: [],
    workTypes: [],
    chosenPostType: {},
    propertyId: null,
    user: {},
    property: {},
    company: {},
  };

  componentDidMount() {
    this.setInitialParams();
    this.getPostTypes();
    this.getDocumentTypes();
    this.getWorkTypes();
  }

  componentDidUpdate(nextProps) {
    nextProps.isLoggedIn !== this.props.isLoggedIn && this.getPostTypes();
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.onRouteChanged();
    }
  }

  onRouteChanged = () => {
    this.props.setFiles([]);
  };

  onEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.sendPost(e);
    }
  };

  getComponentData = url => Api.getComponent(url);

  getCompanyData = url => {
    if (this.props.postTypeSelected === '1') {
      return null;
    }
    return Api.getComponent(url);
  };

  setInitialParams = () => {
    if (this.props.urlData && this.props.urlData.path === propertyIdPath) {
      this.setState({
        propertyId: this.props.urlData.params.id,
      });
    }
  };

  getPostTypes = () => {
    Api.getComponent(`${postsPath}${postTypesPath}`)
      .then(res => {
        this.setState({
          postTypes: this.prepareOptions(res.data),
        });
      })
      .catch(err => console.log(err));
  };

  getDocumentTypes = () => {
    Api.getComponent(`${postsPath}${documentTypesPath}`)
      .then(res => {
        this.setState({
          documentTypes: res.data,
        });
      })
      .catch(err => console.log(err));
  };

  getWorkTypes = () => {
    Api.getComponent(`${postsPath}${workTypesPath}`)
      .then(res => {
        this.setState({
          workTypes: res.data,
        });
      })
      .catch(err => console.log(err));
  };

  setPostTypes = post => {
    Array.isArray(this.state.postTypes) &&
      this.state.postTypes.forEach(item => {
        if (+item.id === +post.post_type_id) {
          this.setState(
            {
              chosenPostType: item,
            },
            () => {
              this.addPostToStore(post);
            }
          );
        }
      });
  };

  getAllData = post => {
    this.props.setLoader(true);
    Promise.all([
      this.getComponentData(`${propertiesPath}/${post.property_id}`),
      this.getComponentData(`${usersPath}/${post.user_id}`),
      this.getCompanyData(`${companiesPath}/${post.company_id}`),
    ])
      .then(values => {
        this.setState(
          {
            property: values[0].data,
            user: values[1].data,
            company: values[2] && values[2].data,
          },
          () => {
            this.props.setLoader(false);
            this.setPostTypes(post);
          }
        );
      })
      .catch(err => {
        console.log(err);
        this.props.setLoader(false);
      });
  };

  setDataToSend = data => {
    switch (data) {
      case '2':
        return {
          company_id: this.props.companyWork || null,
          work_type_id: this.props.workTypeSelected || null,
        };
      case '3':
        return +this.props.documentTypeSelected === 1
          ? {
              document_type_id: this.props.documentTypeSelected,
              company_id: this.props.permitDocumentCompany || null,
              author: this.props.permitDocumentAuthor || null,
            }
          : {
              document_type_id: this.props.documentTypeSelected,
              company_id: this.props.histDocumentCompany || null,
              author: this.props.histDocumentAuthor || null,
            };
      default:
        return null;
    }
  };

  setToDefault = () => {
    input.value = '';
    this.props.setLoader(false);
    this.props.setSelectedWorkCompanySuggestions({});
    this.props.setSelectedPerDocCompanySuggestions({});
    this.props.setSelectedHistDocCompanySuggestions({});
    this.props.setSelectedPostType('');
    this.props.setPhotoOption(false);
    this.props.setWorkOption(false);
    this.props.setSelectedWorkType('');
    this.props.setDocumentOption(false);
    this.props.setPermitDocumentOption(false);
    this.props.setHistoricalDocumentOption(false);
    this.props.setFiles([]);
    this.props.setEventDate(null);
    this.props.setCompanyWork('');
    this.props.setHistDocumentAuthor('');
    this.props.setPermitDocumentAuthor('');
    this.props.setHistDocumentCompany('');
    this.props.setPermitDocumentCompany('');
    this.props.setDocumentIssuedBy('');
    this.props.setDocumentPublishedBy('');
    this.props.setDocumentYear('');
    this.props.setSelectedDocType('');
    if (!this.props.isItRoutes) {
      this.props.setSelectedPropertySuggestions({});
    }
    this.resetForm();
  };

  setPropsIfProperty = () => {
    if (this.props.itIsProperty || this.props.isItRoutes) {
      return this.state.propertyId || this.props.property_data.id;
    }
    return this.props.selectedPropertySuggestion.propertyId;
  };

  addPostToStore = post => {
    this.props.addPost(
      post.id,
      post.content,
      post.event_date,
      this.state.chosenPostType,
      this.state.property,
      this.state.company,
      this.state.user,
      post.post_document
    );
    if (
      !this.checkExistingProperty(this.state.property.id) &&
      this.props.userPage
    ) {
      const props = this.props.postProperties.concat(this.state.property);
      this.props.setUserPostsProperties(props);
    }
    this.setToDefault();
  };

  checkExistingProperty = id => {
    const props = this.props.postProperties;
    const propsLen = this.props.postProperties.length;
    for (let i = 0; i < propsLen; i++) {
      if (props[i].id === id) {
        return true;
      }
    }
    return false;
  };

  sendPost = e => {
    e.preventDefault();
    if (
      this.validatePost(
        input.value,
        this.setPropsIfProperty(),
        this.props.postTypeSelected
      )
    ) {
      Post.prepareDataToSendPost(
        input.value,
        this.setPropsIfProperty(),
        postsPath,
        this.props.postTypeSelected,
        this.props.eventDate,
        this.setDataToSend(this.props.postTypeSelected)
      )
        .then(res => {
          this.shouldUploadFiles(res.data);
          this.child.handleDismiss();
        })
        .catch(err => {
          if (err && err.response && err.response.data.errors) {
            const obj = err.response.data.errors;
            console.log(err.response.data.errors);
            this.child.handleShow(
              `${Object.keys(obj)[0]}:  ${obj[Object.keys(obj)[0]].msg}`
            );
          }
        });
    }
  };

  validatePost = (comment, property, postType) => {
    switch (true) {
      case !comment.trim():
        this.child.handleShow('Empty comment. Please, comment your post!');
        break;
      case !postType:
        this.child.handleShow('Please, choose type of your post!');
        break;
      case !property:
        this.child.handleShow('Empty property. Please, choose property!');
        break;
      case !this.validateDocType():
        this.child.handleShow('Please, choose type of your document!');
        break;
      case !this.validateCompany():
        this.child.handleShow('Empty company. Please, choose the company!');
        break;
      case !this.validateWorkType():
        this.child.handleShow('Please, choose the work type!');
        break;
      case !this.validateAuthor():
        this.child.handleShow('Please, enter the author name!');
        break;
      default:
        return true;
    }
    return false;
  };

  validateCompany = () => {
    if (
      this.props.postTypeSelected === '1' ||
      (this.props.postTypeSelected === '2' && this.props.companyWork.trim()) ||
      (this.props.postTypeSelected === '3' &&
        this.props.permitDocument &&
        this.props.permitDocumentCompany.trim()) ||
      (this.props.postTypeSelected === '3' &&
        this.props.historicalDocument &&
        this.props.histDocumentCompany.trim())
    ) {
      return true;
    }
    return false;
  };

  validateDocType = () => {
    if (
      this.props.postTypeSelected === '1' ||
      this.props.postTypeSelected === '2' ||
      (this.props.postTypeSelected === '3' && this.props.permitDocument) ||
      (this.props.postTypeSelected === '3' && this.props.historicalDocument)
    ) {
      return true;
    }
    return false;
  };

  validateWorkType = () => {
    if (
      this.props.postTypeSelected === '1' ||
      this.props.postTypeSelected === '3' ||
      (this.props.postTypeSelected === '2' && !!this.props.workTypeSelected)
    ) {
      return true;
    }
    return false;
  };

  validateAuthor = () => {
    if (
      this.props.postTypeSelected === '1' ||
      this.props.postTypeSelected === '2' ||
      (this.props.postTypeSelected === '3' &&
        this.props.permitDocument &&
        !!this.props.permitDocumentAuthor.trim()) ||
      (this.props.postTypeSelected === '3' &&
        this.props.historicalDocument &&
        !!this.props.histDocumentAuthor.trim())
    ) {
      return true;
    }
    return false;
  };

  handleChange = e => {
    input = e.target;
  };

  prepareOptions = postTypesArray =>
    postTypesArray.map((item, index) => ({
      id: item.id,
      name: item.name,
      icon: types[index].icon,
    }));

  shouldUploadFiles = data => {
    if (this.props.files.length) {
      this.sendFiles(data);
    } else {
      this.getAllData(data);
    }
  };

  sendFiles = data => {
    this.props.setLoader(true);
    const formData = new FormData();
    this.props.files.forEach((file, i) => {
      formData.append(`attachment_${i}`, file);
    });
    Api.uploadFiles(formData, `${postsPath}/${data.id}${attachmentsPath}`).then(
      () => {
        this.getAllData(data);
      }
    );
  };

  resetForm = () => {
    this.postForm.reset();
  };

  render() {
    const { isLoggedIn } = this.props;
    return (
      <Panel className={`add-post-component ${isLoggedIn ? '' : 'hidden'}`}>
        <form onSubmit={this.sendPost} ref={form => (this.postForm = form)}>
          <Panel.Heading>
            <Grid>
              <Row className="show-grid">
                <Col lg={2} md={2} sm={2} xs={2}>
                  <Image circle responsive src={userImg} />
                </Col>
                <Col lg={10} md={10} sm={10} xs={10}>
                  <FormGroup
                    controlId="formControlsTextarea"
                    className="form-group-story"
                  >
                    <FormControl
                      inputRef={node => (input = node)}
                      componentClass="textarea"
                      className="user-story-textarea"
                      name="company-post-comment"
                      placeholder="Add your Story..."
                      onChange={this.handleChange}
                      onKeyDown={this.onEnterPress}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Grid>
          </Panel.Heading>
          <Panel.Body>
            <PostTypes data={this.state.postTypes} />
            <PostTypesFields
              urlData={this.props.urlData}
              docTypes={this.state.documentTypes}
              workTypes={this.state.workTypes}
              isItRoutes={this.props.isItRoutes}
            />
            <UploadFile />
          </Panel.Body>
          <Panel.Footer>
            <AlertComponent
              ref={instance => {
                this.child = instance;
              }}
            />
            <Grid>
              <Row className="show-grid">
                <Col lg={2} md={2} sm={2} xs={2}>
                  {/* <DatePicker className="picker-occured-date"/> */}
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} />
                <Col lg={4} md={4} sm={4} xs={4}>
                  {/* <Select
                    className={`type-select ${postTypeATop ? 'atop' : ''}`}
                    placeholder="Type"
                    name="form-field-name"
                    value={postTypeValue}
                    onChange={this.getSelectedValue}
                    options={options}
                    onFocus={this.setPostTypesPosition}
                  /> */}
                </Col>
                <Col lg={2} md={2} sm={2} xs={2}>
                  <Button
                    type="submit"
                    bsStyle="primary"
                    bsClass="btn btn-primary pull-right"
                  >
                    POST
                  </Button>
                </Col>
              </Row>
            </Grid>
          </Panel.Footer>
        </form>
      </Panel>
    );
  }
}

AddPost.defaultProps = {
  urlData: null,
  files: [],
  postProperties: [],
  postTypeSelected: null,
  property_data: null,
  permitDocumentCompany: '',
  histDocumentCompany: '',
  documentTypeSelected: '',
  workTypeSelected: '',
  permitDocumentAuthor: '',
  histDocumentAuthor: '',
  companyWork: '',
  eventDate: null,
  isItRoutes: null,
  itIsProperty: null,
  permitDocument: null,
  historicalDocument: null,
  userPage: null,
};
AddPost.propTypes = {
  addPost: PropTypes.func.isRequired,
  urlData: PropTypes.instanceOf(Object),
  selectedPropertySuggestion: PropTypes.instanceOf(Object).isRequired,
  property_data: PropTypes.instanceOf(Object),
  files: PropTypes.instanceOf(Array),
  postProperties: PropTypes.instanceOf(Array),
  setFiles: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  setSelectedPropertySuggestions: PropTypes.func.isRequired,
  setSelectedWorkCompanySuggestions: PropTypes.func.isRequired,
  setSelectedPerDocCompanySuggestions: PropTypes.func.isRequired,
  setSelectedHistDocCompanySuggestions: PropTypes.func.isRequired,
  setSelectedPostType: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  postTypeSelected: PropTypes.string,
  setPhotoOption: PropTypes.func.isRequired,
  setWorkOption: PropTypes.func.isRequired,
  setDocumentOption: PropTypes.func.isRequired,
  setEventDate: PropTypes.func.isRequired,
  setPermitDocumentOption: PropTypes.func.isRequired,
  setHistoricalDocumentOption: PropTypes.func.isRequired,
  documentTypeSelected: PropTypes.string,
  workTypeSelected: PropTypes.string,
  permitDocumentCompany: PropTypes.string,
  histDocumentCompany: PropTypes.string,
  permitDocumentAuthor: PropTypes.string,
  histDocumentAuthor: PropTypes.string,
  companyWork: PropTypes.string,
  setCompanyWork: PropTypes.func.isRequired,
  setPermitDocumentCompany: PropTypes.func.isRequired,
  setHistDocumentCompany: PropTypes.func.isRequired,
  setPermitDocumentAuthor: PropTypes.func.isRequired,
  setHistDocumentAuthor: PropTypes.func.isRequired,
  setDocumentIssuedBy: PropTypes.func.isRequired,
  setDocumentPublishedBy: PropTypes.func.isRequired,
  setDocumentYear: PropTypes.func.isRequired,
  setSelectedDocType: PropTypes.func.isRequired,
  setSelectedWorkType: PropTypes.func.isRequired,
  setUserPostsProperties: PropTypes.func.isRequired,
  eventDate: PropTypes.instanceOf(Object),
  isItRoutes: PropTypes.bool,
  itIsProperty: PropTypes.bool,
  permitDocument: PropTypes.bool,
  historicalDocument: PropTypes.bool,
  userPage: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPostComponent);
