import React, { Component } from 'react';
import Header from '../Header/Header';
import { Grid, Row, Col } from 'react-bootstrap';
import './MerchantProfile.css';
import bcgImg from '../../assets/img/merchant_profile_bg.png';
import ReactImageFallback from 'react-image-fallback';
import { connect } from 'react-redux';
import noImg from '../../assets/img/icons/no-photo.png';
import { API_URL } from '../../config';
import editImg from '../../assets/img/pencil.png';
import Input from '../Input';
import InputErrors from '../InputErrors/InputErrors';
import Textarea from '../Textarea';
import {
  editTourOperatorFormErrors,
  editTourOperatorFormField,
  setEditableUserData,
} from '../../actions/editTourOperatorForm';
import {
  addTourOperatorEditMessage,
  addTourOperatorEditMessageFinished,
} from '../../actions/editTourOperatorMsg';
import { setLoader } from '../../actions/loaderActions';
import { validate } from '../../utils/validator';
import { changeAvatar, mePath, companiesPath } from '../../utils/paths';
import ApiService from '../../services/ApiService/ApiService';
import AuthService from '../../services/AuthService/AuthService';
import SearchService from '../../services/SearchService/SearchService';
import { setUserProfile, setUserAvatar } from '../../actions/authAction';
import { setSelectedSignUpSuggestions } from '../../actions/suggestActions';
import { setCompanyData } from '../../actions/companyActions';
import loader from '../../assets/img/loading.gif';
import { navItems } from '../TourOperator/navItemsInit';
import Modal from '../UI/Modal/Modal';
import UploadPhoto from '../User/UserEditAccount/UploadPhoto/UploadPhoto';
import SidePanel from '../SidePanel/SidePanel';
import SidePanelMobile from '../SidePanelMobile/SidePanelMobile';
import HeaderMobile from '../HeaderMobile/HeaderMobile';

const mapStateToProps = state => {
  return {
    userData: state.auth.userData,
    errors: state.editTourOperatorForm.errors,
    fieldsValidations: state.editTourOperatorForm.fieldsValidations,
    form: state.editTourOperatorForm.form,
    registerTourOperatorFormMessages: state.editTourOperatorMsg,
    auth: state.auth,
    company: state.company,
    propertyValue: state.suggest.selectedSignUpSuggestion.value,
    avatar: state.auth.avatar,
  };
};

const mapDispatchToProps = {
  setLoader,
  editTourOperatorFormErrors,
  editTourOperatorFormField,
  addTourOperatorEditMessage,
  addTourOperatorEditMessageFinished,
  setEditableUserData,
  setUserProfile,
  setSelectedSignUpSuggestions,
  setUserAvatar,
  setCompanyData,
};

class MerchantProfile extends Component {
  state = {
    form: {},
    errors: {},
    updated: false,
    img: null,
    width: 125,
    bcgWidth: 900,
    bcgImg: null,
    showModal: false,
    userPhoto: null,
    avatar: false,
    isCompany: this.props.userData.staff,
  };

  componentWillMount() {
    if (!this.props.userData.role) {
      this.props.history.replace('/');
    }
    if (this.props.userData.role === 1) {
      this.props.history.replace('/page_not_found_for_role_1');
    }
  }

  componentDidMount = () => {
    if (!this.props.auth.isLoggedIn) {
      this.props.history.push('/');
    }
    this.fetchData();
    this.setUserImage(this.props.userData, this.state.width);
    this.setBackgroundImage(this.props.userData, this.state.bcgWidth);
  };

  getMerchantType = () => {
    return 'merchant-avatar';
  };
  setUserImage = (user, width) => {
    if (user.id)
      this.props.setUserAvatar(
        `${API_URL}/me/avatar?avatar_type=${this.getMerchantType()}&token=${this.Auth.getToken()}&width=${width}&${new Date().getTime()}`
      );
  };

  setBackgroundImage = (user, width) => {
    if (user.id)
      this.setState({
        bcgImg: `${API_URL}/users/${
          user.id
        }/background?width=${width}&${new Date().getTime()}`,
      });
  };

  fetchData = () => {
    this.props.setLoader(true);
    this.Api.getComponent(mePath)
      .then(res => {
        this.props.setLoader(false);
        if (this.state.isCompany && res.data.staff) {
          this.props.setCompanyData(res.data.staff.company);
        }
        if (res.data) {
          this.setUserData(
            res.data,
            this.state.isCompany && res.data.staff.company
          );
        }
      })
      .catch(() => this.props.setLoader(false));
  };

  setUserData = (userData, companyData) => {
    this.props.setUserProfile(userData);
    let data = {};
    if (this.state.isCompany) {
      data = { ...companyData };
    } else {
      data = { ...userData };
    }
    const {
        website_url = '',
        facebook_account = '',
        linkedin_account = '',
        instagram_account = '',
        twitter_account = '',
        display_name = '',
        summary = '',
      } = data,
      editUserData = {
        website_url,
        facebook_account,
        linkedin_account,
        instagram_account,
        twitter_account,
        display_name,
        summary,
      };
    this.props.setEditableUserData(editUserData);
  };

  componentWillUnmount() {
    this.props.editTourOperatorFormErrors({});
    this.props.setEditableUserData({});
    this.props.setSelectedSignUpSuggestions({});
  }

  componentWillReceiveProps(nextProps) {
    this.setNewState(nextProps.onError);
    this.setServerErrors(nextProps.serverErrors);

    const { created, hasErrors } = nextProps.registerTourOperatorFormMessages;
    if (!hasErrors && created) {
      this.props.clearTourOperatorForm();
    }

    if (nextProps.form !== this.props.form) {
      this.setState({ form: nextProps.form });
    }
  }

  registerHandler = e => {
    e.preventDefault();
    const { form } = this.props;
    if (this.validate()) return;
    form.legal_entity_name = form.name;
    delete form.name;
    delete form.email;
    this.submitHandler(e, form);
  };

  submitHandler = (e, credentials) => {
    e.preventDefault();
    this.props.setLoader(true);
    if (this.state.isCompany) {
      this.Api.patchComponent(credentials, companiesPath)
        .then(res => {
          if (res.data && res.data.staff) {
            this.props.setCompanyData(res.data.staff.company);
            this.setState({ updated: true });
          }
          this.props.setLoader(false);
        })
        .catch(err => {
          this.props.setLoader(false);
          this.setState({
            serverErr: true,
          });
          if (err && err.response && err.response.data.errors) {
            this.setServerErrors(err.response.data.errors);
          }
        });
    } else {
      this.Api.putComponent(credentials, mePath)
        .then(profile => {
          this.props.setLoader(false);
          this.setState({ updated: true });
          this.props.setUserProfile(profile.data);
          this.setUserData(profile.data);
        })
        .catch(err => {
          this.props.setLoader(false);
          this.setState({
            serverErr: true,
          });
          if (err && err.response && err.response.data.errors) {
            this.setServerErrors(err.response.data.errors);
            this.props.editTourOperatorFormErrors(err.response.data.errors);
          }
        });
    }
  };

  onChange = (value, name) => {
    this.props.editTourOperatorFormErrors({});
    this.setState({ updated: false });
    this.props.editTourOperatorFormField(name, value);
  };
  setServerErrors = errs => {
    this.setState({
      errors: { serverErrors: errs },
    });
  };

  setNewState = err => {
    this.setState({
      errors: { server: err },
    });
  };
  validate = () => {
    const { fieldsValidations, form } = this.props;
    const formErrors = {};
    let hasErrors = false;
    Object.keys(fieldsValidations).forEach(fieldKey => {
      const errors = [];
      fieldsValidations[fieldKey].validations.forEach(validation => {
        const error = validate(validation, form[fieldKey]);
        if (error) {
          hasErrors = true;
          errors.push(error);
        }
      });
      formErrors[fieldKey] = errors;
    });
    this.props.editTourOperatorFormErrors(formErrors);
    return hasErrors;
  };

  Api = new ApiService();
  Auth = new AuthService();
  Search = new SearchService();
  onSuggestionSelected = (event, { suggestion, suggestionValue }) => {
    this.onChange(suggestion, 'primary_address');
  };
  avatarHandler = photo => {
    //const files = Array.from(e.target.files)
    const formData = new FormData();
    formData.append('avatar', photo);
    formData.append('avatar_type', this.getMerchantType());
    this.props.setLoader(true);
    this.Api.uploadFiles(formData, changeAvatar)
      .then(response => {
        this.toggleWidth(this.state.width, 125, 'width');
        this.setUserImage(this.props.userData, this.state.width);
        this.props.setLoader(false);
      })
      .catch(error => {
        console.log(error);
      });
  };
  toggleWidth = (width, size, param) => {
    if (width === size) {
      this.setState(prevState => {
        return {
          [param]: prevState[param] + 1,
        };
      });
    } else {
      this.setState(() => {
        return {
          [param]: size,
        };
      });
    }
  };
  backgroundHandler = photo => {
    //const files = Array.from(e.target.files)
    const formData = new FormData();
    formData.append('file', photo);
    this.props.setLoader(true);
    this.Api.uploadFiles(
      formData,
      `/users/${this.props.userData.id}/background`
    )
      .then(response => {
        this.toggleWidth(this.state.bcgWidth, 900, 'bcgWidth');
        this.setBackgroundImage(this.props.userData, this.state.bcgWidth);
        this.props.setLoader(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { errors } = this.props;
    const { form } = this.state;
    return (
      <div className="board-page">
        <HeaderMobile />
        <Header />
        <div className="board-page-wrap">
          <div className="board-page-container">
            <Grid componentClass="container-fluid">
              <Row className="show-grid no-margin">
                <Col lg={3} md={4} sm={4} xs={12}>
                  <SidePanelMobile
                    items={navItems}
                    register={this.props.userData.role !== 2}
                  />
                  <SidePanel
                    items={navItems}
                    register={this.props.userData.role !== 2}
                  />
                </Col>
                <Col lg={9} md={8} sm={8} xs={12}>
                  <div className="merchant-profile">
                    <Modal show={this.state.showModal}>
                      {this.state.avatar ? (
                        <UploadPhoto
                          key="avatar"
                          modalClosed={this.closeModalHandler}
                          avatarHandler={this.avatarHandler}
                          type="avatar"
                        />
                      ) : (
                        <UploadPhoto
                          key="background"
                          aspectRatio={16 / 9}
                          modalClosed={this.closeModalHandler}
                          backgroundHandler={this.backgroundHandler}
                          type="background"
                        />
                      )}
                    </Modal>
                    <div className="merchant-profile-media-elements">
                      <ReactImageFallback
                        src={this.state.bcgImg}
                        fallbackImage={bcgImg}
                        // initialImage={loader}
                        alt="user_photo"
                      />
                      <div className="merchant-profile-avatar">
                        <div className="merchant-profile-avatar-image">
                          <ReactImageFallback
                            src={this.props.avatar}
                            fallbackImage={noImg}
                            initialImage={loader}
                            alt="user_photo"
                          />
                        </div>
                        <div className="edit-img">
                          <img
                            src={editImg}
                            alt="edit avatar"
                            onClick={() => this.openModal('avatar', true)}
                          />
                        </div>
                      </div>
                      <div className="edit-img">
                        <img
                          src={editImg}
                          alt="edit background"
                          onClick={() => this.openModal('avatar', false)}
                        />
                      </div>
                    </div>
                    <form
                      className="merchant-profile-edit-form"
                      onSubmit={this.registerHandler}
                    >
                      <Row>
                        <Col lg={6}>
                          <div className="form-group-has-error">
                            <Input
                              id="display_name"
                              label="Tour Operator Dispaly Name *"
                              className="form-control-input"
                              placeHolder="Insert tour operator display name"
                              value={form.display_name || ''}
                              type="text"
                              onChange={this.onChange}
                              errors={errors.display_name}
                            />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="form-group-has-error">
                            <Input
                              id="website_url"
                              label="Web Site"
                              className="form-control-input"
                              placeHolder="Insert website"
                              value={form.website_url || ''}
                              type="text"
                              onChange={this.onChange}
                              errors={errors.website_url}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <div
                            className={`form-group-has-error ${
                              errors.summary && errors.summary.length
                                ? 'has-errors'
                                : ''
                            }`}
                          >
                            <Textarea
                              id="summary"
                              label="About me *"
                              placeHolder="Insert about me"
                              value={form.summary || ''}
                              type="text"
                              onChange={this.onChange}
                              errors={errors.summary}
                            />
                            <InputErrors errors={errors.summary} />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={6}>
                          <div className="form-group-has-error">
                            <Input
                              id="facebook_account"
                              label="Facebook"
                              className="form-control-input"
                              placeHolder="https://www.facebook.com/user"
                              value={form.facebook_account || ''}
                              type="text"
                              onChange={this.onChange}
                              errors={errors.facebook_account}
                            />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="form-group-has-error">
                            <Input
                              id="twitter_account"
                              label="Twitter"
                              className="form-control-input"
                              placeHolder="https://twitter.com/user"
                              value={form.twitter_account || ''}
                              type="text"
                              onChange={this.onChange}
                              errors={errors.twitter_account}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={6}>
                          <div className="form-group-has-error">
                            <Input
                              id="linkedin_account"
                              label="linkedin"
                              className="form-control-input"
                              placeHolder="https://www.linkedin.com/in/user"
                              value={form.linkedin_account || ''}
                              type="text"
                              onChange={this.onChange}
                              errors={errors.linkedin_account}
                            />
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="form-group-has-error">
                            <Input
                              id="instagram_account"
                              label="Instagram"
                              className="form-control-input"
                              placeHolder="https://www.instagram.com/user/"
                              value={form.instagram_account || ''}
                              type="text"
                              errors={errors.instagram_account}
                              onChange={this.onChange}
                            />
                          </div>
                        </Col>
                      </Row>
                      <div className="btn-container">
                        {this.state.updated && (
                          <div className="merchant-profile-updated">
                            Updated successfully!
                          </div>
                        )}
                        <button className="save-btn">SAVE</button>
                      </div>
                    </form>
                  </div>
                </Col>
              </Row>
            </Grid>
          </div>
          <form
            className="merchant-profile-edit-form"
            onSubmit={this.registerHandler}
          >
            <Row>
              <Col lg={6}>
                <div className="form-group-has-error">
                  <Input
                    id="display_name"
                    label="Tour Operator Dispaly Name *"
                    className="form-control-input"
                    placeHolder="Insert tour operator display name"
                    value={form.display_name || ''}
                    type="text"
                    onChange={this.onChange}
                    errors={errors.display_name}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-group-has-error">
                  <Input
                    id="website_url"
                    label="Web Site"
                    className="form-control-input"
                    placeHolder="Insert website"
                    value={form.website_url || ''}
                    type="text"
                    onChange={this.onChange}
                    errors={errors.website_url}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div
                  className={`form-group-has-error ${
                    errors.summary && errors.summary.length ? 'has-errors' : ''
                  }`}
                >
                  <Textarea
                    id="summary"
                    label="About me *"
                    placeHolder="Insert about me"
                    value={form.summary || ''}
                    type="text"
                    onChange={this.onChange}
                    errors={errors.summary}
                  />
                  <InputErrors errors={errors.summary} />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <div className="form-group-has-error">
                  <Input
                    id="facebook_account"
                    label="Facebook"
                    className="form-control-input"
                    placeHolder="https://www.facebook.com/user"
                    value={form.facebook_account || ''}
                    type="text"
                    onChange={this.onChange}
                    errors={errors.facebook_account}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-group-has-error">
                  <Input
                    id="twitter_account"
                    label="Twitter"
                    className="form-control-input"
                    placeHolder="https://twitter.com/user"
                    value={form.twitter_account || ''}
                    type="text"
                    onChange={this.onChange}
                    errors={errors.twitter_account}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <div className="form-group-has-error">
                  <Input
                    id="linkedin_account"
                    label="linkedin"
                    className="form-control-input"
                    placeHolder="https://www.linkedin.com/in/user"
                    value={form.linkedin_account || ''}
                    type="text"
                    onChange={this.onChange}
                    errors={errors.linkedin_account}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-group-has-error">
                  <Input
                    id="instagram_account"
                    label="Instagram"
                    className="form-control-input"
                    placeHolder="https://www.instagram.com/user/"
                    value={form.instagram_account || ''}
                    type="text"
                    errors={errors.instagram_account}
                    onChange={this.onChange}
                  />
                </div>
              </Col>
            </Row>
            <div className="btn-container">
              {this.state.updated && (
                <div className="merchant-profile-updated">
                  Updated successfully!
                </div>
              )}
              <button className="save-btn">SAVE</button>
            </div>
          </form>
        </div>
        {/* </Col>
              </Row>
            </Grid>
          </div>
        </div> */}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MerchantProfile);
