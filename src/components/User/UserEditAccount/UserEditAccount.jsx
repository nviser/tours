import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../../Header/Header';
//import Footer from '../../Footer/Footer'
import SidePanel from '../../SidePanel/SidePanel';
import { Grid, Row, Col } from 'react-bootstrap';
import navItems from '../navItems';
import noImg from '../../../assets/img/icons/no-photo.png';
import ReactImageFallback from 'react-image-fallback';
import editImg from '../../../assets/img/pencil.png';
import loader from '../../../assets/img/loading.gif';
import './UserEditAccount.css';
import { connect } from 'react-redux';
import ApiService from '../../../services/ApiService/ApiService';
import {
  changeAvatar,
  changePassword as changePasswordUrl,
  mePath,
} from '../../../utils/paths';
import { setLoader } from '../../../actions/loaderActions';
import { API_URL } from '../../../config';
import { setUserAvatar } from '../../../actions/authAction';
import Input from '../../Input';
// import InputErrors from '../../InputErrors/InputErrors'
// import InputMask from 'react-input-mask';
// import AutosuggestComponent from '../../../components/AutosuggestComponent/AutosuggestComponent'
import {
  editAccountFormField,
  clearAccountForm,
  setAccountData,
  editAccountFormErrors,
} from '../../../actions/editUserAccountForm';
import { clearAccountMessageStatus } from '../../../actions/editUserAccountFormMsg';
import AuthService from '../../../services/AuthService/AuthService';
import { setSelectedSignUpSuggestions } from '../../../actions/suggestActions';
import withAuth from '../../../services/withAuth/withAuth';
import { validate } from '../../../utils/validator';
import { setUserProfile } from '../../../actions/authAction';
import FBConnect from './FBConnect/FBConnect';
import { Link } from 'react-router-dom';
import Modal from '../../UI/Modal/Modal';
import UploadPhoto from './UploadPhoto/UploadPhoto';
import SidePanelMobile from '../../SidePanelMobile/SidePanelMobile';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';

const mapStateToProps = state => {
  return {
    userData: state.auth.userData,
    facebookConnected: state.auth.facebookConnected,
    avatar: state.auth.avatar,
    editAccountMessages: state.editAccountFormMessages,
    form: state.editUserAccountForm.form,
    errors: state.editUserAccountForm.errors,
    fieldsValidations: state.editUserAccountForm.fieldsValidations,
  };
};
const mapDispatchToProps = {
  setLoader,
  setUserAvatar,
  editAccountFormField,
  clearAccountForm,
  clearAccountMessageStatus,
  setSelectedSignUpSuggestions,
  setAccountData,
  editAccountFormErrors,
  setUserProfile,
};

class UserEditAccount extends Component {
  static propTypes = {
    avatar: PropTypes.string,
    userData: PropTypes.instanceOf(Object),
    setLoader: PropTypes.func.isRequired,
    setUserAvatar: PropTypes.func.isRequired,
    editAccountFormField: PropTypes.func.isRequired,
    clearAccountForm: PropTypes.func.isRequired,
    clearAccountMessageStatus: PropTypes.func.isRequired,
  };
  state = {
    width: 125,
    errors: {},
    form: {
      regPhone: '',
    },
    changePasswordForm: {},
    updated: false,
    passwordUpdated: false,
    showModal: false,
    userPhoto: null,
  };
  Api = new ApiService();
  Auth = new AuthService();
  componentWillReceiveProps(nextProps) {
    this.setNewState(nextProps.onError);
    this.setServerErrors(nextProps.serverErrors);

    const { created, hasErrors } = nextProps.editAccountMessages;
    if (!hasErrors && created) {
      this.props.clearAccountForm();
      this.props.clearAccountMessageStatus();
    }

    if (nextProps.form !== this.props.form) {
      this.setState({ form: nextProps.form });
    }

    if (
      nextProps.userData &&
      nextProps.userData.id !== this.props.userData.id
    ) {
      this.setUserData(nextProps.userData);
    }
  }
  componentDidMount = () => {
    if (this.props.userData && this.props.userData.id)
      this.setUserData(this.props.userData);
    this.setUserImage(this.props.userData, this.state.width);
  };
  componentWillUnmount() {
    this.props.setSelectedSignUpSuggestions({});
    this.props.editAccountFormErrors({});
  }
  setUserData = userData => {
    if (userData.first_name) {
      let editUserData = {
        regFirstName: userData.first_name,
        regLastName: userData.last_name,
        regEmail: userData.email,
        regPhone: userData.phone_number,
        regAddress: userData.primary_address,
      };
      if (
        userData.primary_address &&
        !userData.primary_address.city &&
        Object.keys(userData.primary_address).length > 0
      ) {
        let address =
          typeof userData.primary_address === 'string'
            ? JSON.parse(userData.primary_address)
            : userData.primary_address;
        this.props.setSelectedSignUpSuggestions({ value: address.description });
      }

      this.props.setAccountData(editUserData);
    }
  };
  setUserImage = (user, width) => {
    if (user.id)
      this.props.setUserAvatar(
        `${API_URL}/users/${
          user.id
        }/avatar?width=${width}&${new Date().getTime()}`
      );
  };
  avatarHandler = photo => {
    //const files = Array.from(e.target.files)
    const formData = new FormData();
    formData.append('avatar', photo);
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
      this.setState(prevState => ({ [param]: prevState[param] + 1 }));
    } else {
      this.setState(() => ({ [param]: size }));
    }
  };
  onChange = (value, name) => {
    this.setState({ updated: false });
    this.props.editAccountFormErrors({});
    this.props.editAccountFormField(name, value);
  };
  passwordFormOnChange = (value, name) => {
    const _old = this.state.changePasswordForm;
    _old[name] = value;
    this.setState({ passwordUpdated: false, changePasswordForm: _old });
    this.props.editAccountFormField(name, value);
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
  editSubmitHandler = e => {
    e.preventDefault();
    const { form } = this.props;
    if (this.validate()) return;
    this.handleFormAccoutSubmit(e, form);
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
    this.props.editAccountFormErrors(formErrors);
    return hasErrors;
  };

  handleFormAccoutSubmit = (e, credentials) => {
    e.preventDefault();
    this.editAccount(credentials);
  };
  changePasswordSubmitHandler = e => {
    e.preventDefault();
    this.changePassword(this.state.changePasswordForm);
  };
  editAccount = credentials => {
    const data = {
      first_name: credentials.regFirstName,
      last_name: credentials.regLastName,
      email: credentials.regEmail,
      // phone_number: credentials.regPhone,
      // primary_address: credentials.regAddress
    };
    this.props.setLoader(true);
    this.Api.putComponent(data, mePath)
      .then(res => {
        this.props.setLoader(false);
        this.setState({ updated: true });
        this.props.setUserProfile(res.data);
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
  };
  changePassword = credentials => {
    const data = {
      old_password: credentials.oldPass,
      password: credentials.regPass,
      re_password: credentials.regConfirmPass,
    };
    this.props.setLoader(true);
    this.Api.sendComponent(data, changePasswordUrl)
      .then(response => {
        this.props.setLoader(false);
        this.setState({ passwordUpdated: true, changePasswordForm: {} });
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
  };
  createErrElements = obj => {
    return <div className="input-errors">{obj.msg}</div>;
  };
  onSuggestionSelected = (event, { suggestion, suggestionValue }) => {
    this.onChange(JSON.stringify(suggestion), 'regAddress');
  };
  toggleChangePasswordForm = () => {
    this.setState({
      changePasswordFormVisible: !this.state.changePasswordFormVisible,
    });
  };

  openModal = () => {
    this.setState({
      showModal: true,
    });
  };
  closeModalHandler = () => {
    this.setState({
      showModal: false,
    });
  };
  setTourPhoto = photo => {
    this.avatarHandler(photo);
  };

  handleFBConnect = data => {
    this.props.setUserProfile(data);
  };

  handleError = err => {
    if (err.response.data) {
      this.setServerErrors(err.response.data);
    }
  };

  createErrElement = obj => {
    return <div className="modal-sign-in-warn-message error">{obj.msg}</div>;
  };

  render() {
    const { errors } = this.props;
    const { form, changePasswordForm } = this.state;
    const { serverErrors } = this.state.errors;
    return (
      <div className="board-page">
        <HeaderMobile />
        <Header />
        <div className="board-page-wrap">
          <div className="board-page-container edit-user-page">
            <Grid componentClass="container-fluid">
              <Row className="show-grid no-margin">
                <Col lg={3} md={3} sm={4}>
                  <SidePanelMobile
                    items={navItems}
                    register={this.props.userData.role !== 2}
                  />
                  <SidePanel
                    items={navItems}
                    register={this.props.userData.role !== 2}
                  />
                </Col>
                <Col lg={9} md={9} sm={8}>
                  <div className="user-edit-account">
                    <Modal show={this.state.showModal}>
                      <UploadPhoto
                        modalClosed={this.closeModalHandler}
                        avatarHandler={this.setTourPhoto}
                        type="avatar"
                      />
                    </Modal>
                    <Row>
                      <Col lg={12}>
                        <div className="user-edit-account-avatar">
                          <div className="user-edit-account-avatar-image">
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
                              onClick={this.openModal}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <form
                          className="user-profile-form"
                          onSubmit={this.editSubmitHandler}
                        >
                          <Row>
                            <Col lg={6}>
                              <Input
                                id="regFirstName"
                                isRequired
                                label="First name"
                                className="sign-up-input fname"
                                placeHolder="Insert First name"
                                wrapperClass="form-control-group"
                                value={form.regFirstName || ''}
                                type="text"
                                onChange={this.onChange}
                                errors={errors.regFirstName}
                              />
                            </Col>
                            <Col lg={6}>
                              <Input
                                id="regLastName"
                                isRequired
                                label="Last name"
                                className="sign-up-input lname"
                                placeHolder="Insert Last name"
                                wrapperClass="form-control-group"
                                value={form.regLastName || ''}
                                type="text"
                                onChange={this.onChange}
                                errors={errors.regLastName}
                              />
                            </Col>
                          </Row>
                          {/*<Row>
                                                        <Col lg={6}>
                                                            <div className="form-control-group">
                                                                <label className="regular-label" htmlFor="autosuggest">Address</label>
                                                                <AutosuggestComponent
                                                                  id="autosuggest"
                                                                  errors={errors.regAddress}
                                                                  suggestionType="sign_up"
                                                                  placeholder="Insert address"
                                                                  getAllData={this.getAllData}
                                                                  onSuggestionSelected={this.onSuggestionSelected}
                                                                  propertyValue={this.props.propertyValue || ''}
                                                                />
                                                                <InputErrors errors={errors.regAddress} />
                                                            </div>
                                                        </Col>
                                                        <Col lg={6}>
                                                            <div className="form-control-group">
                                                                <label className="regular-label" htmlFor="autosuggest">Phone number</label>
                                                                <InputMask
                                                                  name="regPhone"
                                                                  value={form.regPhone || ''}
                                                                  placeholder="Insert phone"
                                                                  onChange={(e) => this.onChange(e.target.value, e.target.name)}
                                                                  className={`sign-up-input ${form.regPhone ? 'control-active' : ''} ${errors && errors.regPhone && errors.regPhone.length ? 'has-errors': ''}`}
                                                                  mask="(999) 9999 - 9999"
                                                                  maskChar=" " />
                                                                <InputErrors errors={errors.regPhone} />
                                                            </div>
                                                        </Col>
                                                    </Row>*/}
                          <Row>
                            <Col lg={6}>
                              <Input
                                id="regEmail"
                                isRequired
                                label="Email"
                                className="sign-up-input email"
                                placeHolder="Insert email"
                                wrapperClass="form-control-group"
                                value={form.regEmail || ''}
                                type="text"
                                disabled
                                onChange={this.onChange}
                                errors={errors.regEmail}
                              />
                              {serverErrors &&
                                serverErrors.email &&
                                this.createErrElements(serverErrors)}
                            </Col>
                          </Row>

                          <div className="user-edit-account-btn--container">
                            {this.state.updated && (
                              <div className="user-edit-account--updated">
                                Updated successfully!
                              </div>
                            )}
                            <button className="sign-up-btn">Save</button>
                          </div>
                        </form>
                      </Col>
                    </Row>
                  </div>
                  <div className="user-edit-account">
                    <Row>
                      <Col lg={12}>
                        <h2 className="edit-account-header">Change Password</h2>
                        {this.state.changePasswordFormVisible ? (
                          <form
                            className="change-password-form"
                            onSubmit={this.changePasswordSubmitHandler}
                          >
                            <Row>
                              <Col lg={12}>
                                <p className="change-warning">
                                  It is recommended to use a secure password
                                  that you do not use for any other site.
                                </p>
                                <hr className="divider" />
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4}>
                                <Input
                                  id="oldPass"
                                  isRequired
                                  label="Actual password"
                                  className="sign-up-input pass"
                                  placeHolder=""
                                  wrapperClass="form-control-group"
                                  value={changePasswordForm.oldPass || ''}
                                  type="password"
                                  onChange={this.passwordFormOnChange}
                                  errors={errors.oldPass}
                                />
                                {serverErrors &&
                                  serverErrors.old_password &&
                                  this.createErrElements(
                                    serverErrors.old_password
                                  )}
                              </Col>
                              <Col lg={4}>
                                <Input
                                  id="regPass"
                                  isRequired
                                  label="New password"
                                  className="sign-up-input pass"
                                  placeHolder=""
                                  wrapperClass="form-control-group"
                                  value={changePasswordForm.regPass || ''}
                                  type="password"
                                  onChange={this.passwordFormOnChange}
                                  errors={errors.regPass}
                                />
                                {serverErrors &&
                                  serverErrors.password &&
                                  this.createErrElements(serverErrors.password)}
                              </Col>
                              <Col lg={4}>
                                <Input
                                  id="regConfirmPass"
                                  isRequired
                                  label="Confirm new password"
                                  className="sign-up-input pass "
                                  placeHolder=""
                                  wrapperClass="form-control-group"
                                  value={
                                    changePasswordForm.regConfirmPass || ''
                                  }
                                  type="password"
                                  onChange={this.passwordFormOnChange}
                                  errors={errors.regConfirmPass}
                                />
                                {serverErrors &&
                                  serverErrors.re_password &&
                                  this.createErrElements(
                                    serverErrors.re_password
                                  )}
                              </Col>
                            </Row>
                            <div className="user-edit-account-btn--container">
                              {this.state.passwordUpdated && (
                                <div className="user-edit-account--updated">
                                  Password updated successfully!
                                </div>
                              )}
                              <Link to="/forgot" className="forgot-link">
                                Forgot Password?
                              </Link>
                              <button className="sign-up-btn button-main">
                                Save
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="change-password-trigger">
                            <span className="change-warning">
                              It is recommended to use a secure password that
                              you do not use for any other site.
                            </span>
                            <button
                              type="button"
                              className="sign-up-btn button-main"
                              onClick={this.toggleChangePasswordForm}
                            >
                              Change
                            </button>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </div>
                  {this.props.userData &&
                    this.props.userData.registered_via !== 'social' && (
                      <div className="user-edit-account social">
                        <Row>
                          <Col lg={4}>
                            <h2 className="edit-account-header">
                              Social Profiles
                            </h2>
                            <FBConnect
                              handleConnect={data => this.handleFBConnect(data)}
                              handleError={err => this.handleError(err)}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12}>
                            {serverErrors &&
                              serverErrors.msg &&
                              this.createErrElement(serverErrors)}
                          </Col>
                        </Row>
                      </div>
                    )}
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserEditAccount)
);
