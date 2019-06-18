import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { validate } from '../../../utils/validator';
import {
  setSignUpFormErrors,
  setSignUpFormField,
  clearSignUpForm,
} from '../../../actions/signUpFormActions';
import {
  addSignUpMessage,
  clearSignUpMessageStatus,
} from '../../../actions/signUpMessagesActions';
import { setLoader } from '../../../actions/loaderActions';
import AuthService from '../../../services/AuthService/AuthService';
import Input from '../../Input';
import './UserSignUpPage.css';
import pageLogo from '../../../assets/img/light.svg';
import pageFooter from '../../../assets/img/img-footer.svg';
//import AutosuggestComponent from '../../AutosuggestComponent/AutosuggestComponent'
//import InputMask from 'react-input-mask';
import InputErrors from '../../InputErrors/InputErrors';
import { setIsAuthorized, setUserProfile } from '../../../actions/authAction';
import { setUserForEdit } from '../../../actions/editAction';
import { setSelectedSignUpSuggestions } from '../../../actions/suggestActions';

const mapStateToProps = state => {
  return {
    propertyValue: state.suggest.selectedSignUpSuggestion.value,
    errors: state.signUpForm.errors,
    fieldsValidations: state.signUpForm.fieldsValidations,
    form: state.signUpForm.form,
    signUpMessages: state.signUpMessages,
    auth: state.auth,
    userData: state.auth.userData,
    isLoggedIn: state.auth.isLoggedIn,
  };
};

const mapDispatchToProps = {
  setLoader,
  setSignUpFormErrors,
  setSignUpFormField,
  clearSignUpForm,
  addSignUpMessage,
  clearSignUpMessageStatus,
  setIsAuthorized,
  setUserProfile,
  setUserForEdit,
  setSelectedSignUpSuggestions,
};

const UserSignUpPage = withRouter(props => (
  <UserSignUpPageComponent {...props} />
));

class UserSignUpPageComponent extends Component {
  state = {
    form: {
      regPhone: '',
    },
    errors: {},
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillReceiveProps(nextProps) {
    this.setNewState(nextProps.onError);
    this.setServerErrors(nextProps.serverErrors);

    const { created, hasErrors } = nextProps.signUpMessages;
    if (!hasErrors && created) {
      this.props.clearSignUpForm();
      this.props.clearSignUpMessageStatus();
    }

    if (nextProps.form !== this.props.form) {
      this.setState({ form: nextProps.form });
    }
  }
  componentWillUnmount() {
    this.props.clearSignUpForm();
    this.props.setSelectedSignUpSuggestions({});
  }

  onChange = (value, name) => {
    this.props.setSignUpFormErrors({});
    this.props.setSignUpFormField(name, value);
  };

  setServerErrors = errs => {
    let formErrors = {};
    this.setState({
      errors: { serverErrors: errs },
    });
    if (errs && Object.keys(errs).length > 0) {
      for (let key in errs) {
        errs[key].message = errs[key].msg;
        formErrors[key] = [errs[key]];
      }
      this.props.setSignUpFormErrors(formErrors);
    }
  };

  setNewState = err => {
    this.setState({
      errors: { server: err },
    });
  };

  createErrElements = obj => {
    if (typeof obj === 'object') {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          return <InputErrors errors={[{ message: obj[key].msg }]} />;
        }
      }
    }
  };

  handleFormSignUpSubmit = (e, credentials) => {
    e.preventDefault();
    this.props.setLoader(true);
    this.Auth.registration(
      credentials.first_name,
      credentials.last_name,
      credentials.email,
      credentials.password,
      credentials.re_password
      //credentials.regPhone,
      //credentials.regAddress
    )
      .then(() => {
        this.props.setLoader(false);
        this.handleFormSubmit(credentials.email, credentials.password);
        // this.props.history.push('/dashboard');
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
  handleFormSubmit = (email, password) => {
    this.props.setLoader(true);
    this.Auth.login(email, password)
      .then(() => {
        this.getAuthUserData();
        this.props.setLoader(false);
      })
      .catch(err => {
        this.props.setLoader(false);
        this.setNewState(true);
        if (err && err.response && err.response.data.errors) {
          this.setServerErrors(err.response.data.errors);
        }
      });
  };
  getAuthUserData = () => {
    this.getUserData();
    this.getUserId();
  };

  getUserData = () => {
    if (
      Object.keys(this.props.userData).length === 0 &&
      this.props.userData.constructor === Object
    ) {
      this.Auth.getUserData()
        .then(res => {
          this.setUserData(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  getUserId = () => {
    this.props.history.push('/dashboard');
  };
  signUp = e => {
    e.preventDefault();
    const { form } = this.props;
    if (this.validate()) return;
    this.handleFormSignUpSubmit(e, form);
  };
  setUserData = userData => {
    this.props.setUserProfile(userData);
    this.props.setIsAuthorized(true);
    this.props.setUserForEdit(userData);
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
    this.props.setSignUpFormErrors(formErrors);
    return hasErrors;
  };

  Auth = new AuthService();

  getAllData = () => {};

  onSuggestionSelected = (event, { suggestion, suggestionValue }) => {
    this.onChange(JSON.stringify(suggestion), 'regAddress');
  };
  render() {
    const { errors } = this.props;
    const { form } = this.state;
    const { serverErrors } = this.state.errors;
    return (
      <div className="sign-up-page">
        <img className="page-logo" src={pageLogo} alt="logo" />
        <form className="sign-up-form" onSubmit={this.signUp}>
          <h1 className="sign-up-header">Sign Up</h1>

          <Input
            id="first_name"
            isRequired
            label="First name"
            className="sign-up-input fname"
            placeHolder="Insert First name"
            wrapperClass="form-control-group"
            value={form.first_name}
            type="text"
            onChange={this.onChange}
            errors={errors.first_name}
          />
          <Input
            id="last_name"
            isRequired
            label="Last name"
            className="sign-up-input lname"
            placeHolder="Insert Last name"
            wrapperClass="form-control-group"
            value={form.last_name}
            type="text"
            onChange={this.onChange}
            errors={errors.last_name}
          />
          <Input
            id="email"
            isRequired
            label="Email"
            className="sign-up-input email"
            placeHolder="Insert email"
            wrapperClass="form-control-group"
            value={form.email}
            type="email"
            onChange={this.onChange}
            errors={errors.email}
          />
          {serverErrors &&
            serverErrors.email &&
            this.createErrElements(serverErrors)}

          {/*<div className="form-control-group">
            <label className="auth-label" htmlFor="autosuggest">Address</label>
            <AutosuggestComponent
              id="autosuggest"
              errors={errors.regAddress}
              suggestionType="sign_up"
              placeholder="Insert address"
              getAllData={this.getAllData}
              onSuggestionSelected={this.onSuggestionSelected}
              propertyValue={this.props.propertyValue}
            />
            <InputErrors errors={errors.regAddress} />
          </div>

          <div className="form-control-group">
            <label className="auth-label" htmlFor="autosuggest">Phone number</label>
            <InputMask
              name="regPhone"
              value={form.regPhone}
              placeholder="Insert phone"
              onChange={(e) => this.onChange(e.target.value, e.target.name)}
              className={`sign-up-input ${errors.regPhone && errors.regPhone.length ? 'has-errors' : ''}`}
              mask="(999) 9999 - 9999"
              maskChar=" " />
            <InputErrors errors={errors.regPhone} />
          </div>*/}

          <Input
            id="password"
            isRequired
            label="Password"
            className="sign-up-input pass"
            placeHolder="Insert password"
            wrapperClass="form-control-group"
            value={form.password}
            type="password"
            onChange={this.onChange}
            errors={errors.password}
          />
          <Input
            id="re_password"
            isRequired
            label="Confirm password"
            className="sign-up-input conf-pass"
            placeHolder="Confirm password"
            wrapperClass="form-control-group"
            value={form.re_password}
            type="password"
            onChange={this.onChange}
            errors={errors.re_password}
          />
          {serverErrors &&
            !serverErrors.email &&
            this.createErrElements(serverErrors)}

          <button className="btn-sign-up">Register</button>
          <div className="already-text">
            You already have an account?
            <Link to="/login">
              &nbsp;<span className="go-link">Sign In</span>
            </Link>
          </div>
        </form>
        <img className="sign-up-footer" src={pageFooter} alt="" />
      </div>
    );
  }
}

UserSignUpPage.defaultProps = {
  onError: null,
  serverErrors: null,
};

UserSignUpPage.propTypes = {
  setSignUpFormErrors: PropTypes.func.isRequired,
  setSignUpFormField: PropTypes.func.isRequired,
  clearSignUpForm: PropTypes.func.isRequired,
  clearSignUpMessageStatus: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  onError: PropTypes.bool,
  serverErrors: PropTypes.instanceOf(Object),
  errors: PropTypes.shape({
    regFirstName: PropTypes.arrayOf(PropTypes.object),
    regLastName: PropTypes.arrayOf(PropTypes.object),
    regEmail: PropTypes.arrayOf(PropTypes.object),
    regPass: PropTypes.arrayOf(PropTypes.object),
    regConfirmPass: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  fieldsValidations: PropTypes.shape({
    regFirstName: PropTypes.object,
    regLastName: PropTypes.object,
    regEmail: PropTypes.object,
    regPass: PropTypes.object,
    regConfirmPass: PropTypes.object,
  }).isRequired,
  form: PropTypes.shape({
    regFirstName: PropTypes.string,
    regLastName: PropTypes.string,
    regEmail: PropTypes.string,
    regPass: PropTypes.string,
    regConfirmPass: PropTypes.string,
  }).isRequired,
  signUpMessages: PropTypes.shape({
    created: PropTypes.bool.isRequired,
    hasErrors: PropTypes.bool.isRequired,
  }).isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSignUpPage);
