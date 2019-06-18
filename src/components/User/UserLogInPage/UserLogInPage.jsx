import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter, Link, Redirect } from 'react-router-dom';
import {
  setSignInFormErrors,
  setSignInFormField,
  clearSignInForm,
} from '../../../actions/signInFormActions';
import {
  addSignInMessage,
  clearSignInMessageStatus,
} from '../../../actions/signInMessagesActions';
import { companiesPath, dashboardPath } from '../../../utils/paths';
import {
  setIsAuthorized,
  setUserProfile,
  setUserAvatar,
} from '../../../actions/authAction';
import { setUserForEdit } from '../../../actions/editAction';
import { setLoader } from '../../../actions/loaderActions';
import { setCompanyData } from '../../../actions/companyActions';
import { API_URL } from '../../../config';
import { validate } from '../../../utils/validator';
import AuthService from '../../../services/AuthService/AuthService';
import ApiService from '../../../services/ApiService/ApiService';
import FBAuth from '../../Auth/Facebook/Facebook';
import GoogleAuth from '../../Auth/Google/Google';
import Input from '../../Input';
import './UserLogInPage.css';
import pageLogo from '../../../assets/img/light.svg';
import loginFooter from '../../../assets/img/img-footer.svg';
import InputErrors from '../../InputErrors/InputErrors';

const mapStateToProps = state => ({
  errors: state.signInForm.errors,
  fieldsValidations: state.signInForm.fieldsValidations,
  form: state.signInForm.form,
  signInMessages: state.signInMessages,
  auth: state.auth,
  userData: state.auth.userData,
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = {
  setSignInFormErrors,
  setSignInFormField,
  clearSignInForm,
  addSignInMessage,
  clearSignInMessageStatus,
  setLoader,
  setIsAuthorized,
  setUserProfile,
  setUserForEdit,
  setCompanyData,
  setUserAvatar,
};

const UserLogInPage = withRouter(props => (
  <UserLogInPageComponent {...props} />
));

class UserLogInPageComponent extends Component {
  constructor(props) {
    super(props);
    this.params = new URLSearchParams(this.props.location.search);

    this.state = {
      form: {},
      serverErr: false,
      errorsLogin: {
        server: false,
      },
      isLoggedIn: null,
      loginAsError: null,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState(
      {
        isLoggedIn: this.props.isLoggedIn,
        loginAsToken: this.params.get('token'),
        loginAsEmail: this.params.get('email'),
      },
      () => {
        if (this.state.loginAsToken && this.state.loginAsEmail) {
          this.loginAs(this.state.loginAsToken, this.state.loginAsEmail);
        }
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    const { created, hasErrors } = nextProps.signInMessages;
    if (!hasErrors && created) {
      this.props.clearSignInForm();
      this.props.clearSignInMessageStatus();
    }

    if (nextProps.form !== this.props.form) {
      this.setState({ form: nextProps.form });
    }

    if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
      this.setState({ isLoggedIn: nextProps.isLoggedIn });
    }
  }

  Auth = new AuthService();
  Api = new ApiService();

  onChange = (value, name) => {
    this.props.setSignInFormErrors({});
    this.props.setSignInFormField(name, value);
  };

  setServerErrors = errs => {
    this.setState({
      errorsLogin: { serverErrors: errs },
    });
  };

  setNewState = err => {
    this.setState({
      errorsLogin: { server: err },
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

  setUserData = userData => {
    this.props.setUserProfile(userData);
    this.props.setIsAuthorized(true);
    this.props.setUserForEdit(userData);
  };

  loggingIn = e => {
    e.preventDefault();
    const { form } = this.props;
    if (this.validate()) return;
    this.handleFormSubmit(e, form);
  };

  getCompany = () => {
    this.Api.getComponent(companiesPath)
      .then(res => this.props.setCompanyData(res.data))
      .catch(err => console.log(err));
  };
  detectAvatar = () => {
    if (this.props.userData.role === 2) {
      return 'merchant-avatar';
    }
    return 'avatar';
  };
  setUserImage = data => {
    this.props.setUserAvatar(
      `${API_URL}/me/avatar?avatar_type=${this.detectAvatar(
        data
      )}&token=${this.Auth.getToken()}&width=${
        this.state.width
      }&${new Date().getTime()}`
    );
  };

  getUserData = () => {
    if (
      Object.keys(this.props.userData).length === 0 &&
      this.props.userData.constructor === Object
    ) {
      this.Auth.getUserData()
        .then(res => {
          this.setUserData(res.data);
          this.getUserId(res.data);
          if (res.data.staff && res.data.staff.company) this.getCompany();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  getUserId = data => {
    if (data.role === 1) {
      this.setUserImage(data);
      this.props.history.push('/dashboard');
    } else if (data.role === 2) {
      this.setUserImage(data);
      this.props.history.push('/creator_dashboard');
    }
  };

  getAuthUserData = () => {
    this.getUserData();
  };

  handleFormSubmit = (e, credentials) => {
    e.preventDefault();
    this.props.setLoader(true);
    this.Auth.login(credentials.logEmail, credentials.logPass)
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

  loginAs = (token, email) => {
    this.props.setLoader(true);
    this.Auth.loginAs(token, email)
      .then(() => {
        this.getAuthUserData();
        this.props.setLoader(false);
      })
      .catch(err => {
        this.props.setLoader(false);
        this.setNewState(true);
        if (err && err.response && err.response.data) {
          this.setState({ loginAsError: err.response.data });
        }
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
    this.props.setSignInFormErrors(formErrors);
    return hasErrors;
  };

  render() {
    const { errors } = this.props;
    const { form, isLoggedIn } = this.state;
    const isLoginAsAttempt = this.state.loginAsToken && this.state.loginAsEmail;
    const { serverErrors } = this.state.errorsLogin;
    if (isLoggedIn === true) {
      return <Redirect to={dashboardPath} />;
    } else {
      return (
        <div className="login-page">
          <div className="page-logo">
            <img className="static-logo" src={pageLogo} alt="logo" />
          </div>

          {!isLoginAsAttempt ? (
            <form className="login-form" onSubmit={this.loggingIn}>
              <h1 className="login-header">Sign In</h1>
              <FBAuth getAuthUserData={this.getAuthUserData} />
              <GoogleAuth getAuthUserData={this.getAuthUserData} />
              <div className="separat-or">Or</div>
              <Input
                id="logEmail"
                label="Email"
                className="login-input"
                wrapperClass="form-control-group"
                placeHolder="Insert email"
                value={form.logEmail}
                type="email"
                isRequired
                onChange={this.onChange}
                errors={errors.logEmail}
              />
              <Input
                id="logPass"
                label="Password"
                className="login-input"
                wrapperClass="form-control-group mb-0"
                placeHolder="Insert password"
                value={form.logPass}
                type="password"
                isRequired
                onChange={this.onChange}
                errors={errors.logPass}
              />

              {serverErrors && this.createErrElements(serverErrors)}
              <div className="remember-forgot">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>
                <Link to="/forgot">
                  &nbsp;<span className="go-link">Forgot Password?</span>
                </Link>
              </div>
              <button className="btn-login">Sign In</button>
              <div className="sign-up-text">
                Don't have an account?
                <Link to="/sign_up">&nbsp;Sign Up</Link>
              </div>
            </form>
          ) : (
            <div className="login-as-redirect">
              {!this.state.loginAsError ? (
                <div className="alert alert-success">Redirecting ...</div>
              ) : (
                <div className="alert alert-danger">
                  {this.state.loginAsError}
                </div>
              )}
            </div>
          )}
          <img className="login-footer" src={loginFooter} alt="" />
        </div>
      );
    }
  }
}

UserLogInPage.defaultProps = {
  serverErrors: null,
  userData: null,
};

UserLogInPage.propTypes = {
  setSignInFormErrors: PropTypes.func.isRequired,
  setSignInFormField: PropTypes.func.isRequired,
  clearSignInForm: PropTypes.func.isRequired,
  clearSignInMessageStatus: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  onError: PropTypes.bool,
  serverErrors: PropTypes.instanceOf(Object),
  errors: PropTypes.shape({
    logEmail: PropTypes.arrayOf(PropTypes.object),
    logPass: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  fieldsValidations: PropTypes.shape({
    logEmail: PropTypes.object,
    logPass: PropTypes.object,
  }).isRequired,
  form: PropTypes.shape({
    logEmail: PropTypes.string,
    logPass: PropTypes.string,
  }).isRequired,
  signInMessages: PropTypes.shape({
    created: PropTypes.bool.isRequired,
    hasErrors: PropTypes.bool.isRequired,
  }).isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  userData: PropTypes.instanceOf(Object),
  setIsAuthorized: PropTypes.func.isRequired,
  setUserProfile: PropTypes.func.isRequired,
  setUserForEdit: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserLogInPage);
