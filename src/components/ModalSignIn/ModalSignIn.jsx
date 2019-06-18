import React, { Component } from 'react';
import { Modal, ButtonToolbar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { validate } from '../../utils/validator';
import AuthService from '../../services/AuthService/AuthService';
import FBAuth from '../Auth/Facebook/Facebook';
import GoogleAuth from '../Auth/Google/Google';
import LinkedInAuth from '../Auth/LinkedIn/LinkedIn';
// import SocialButton from '../Auth/SocialButton/SocialButton';
// import { LINKEDIN_CLIENT_ID } from '../../utils/const';
import {
  setSignInFormErrors,
  setSignInFormField,
  clearSignInForm,
} from '../../actions/signInFormActions';
import {
  addSignInMessage,
  clearSignInMessageStatus,
} from '../../actions/signInMessagesActions';
import './ModalSignIn.css';
import Input from '../Input';
import Button from '../Button';

class ModalSignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {},
      errorsLogin: {
        server: false,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setNewState(nextProps.onError);
    this.setServerErrors(nextProps.serverErrors);

    const { created, hasErrors } = nextProps.signInMessages;
    if (!hasErrors && created) {
      this.props.clearSignInForm();
      this.props.clearSignInMessageStatus();
    }

    if (nextProps.form !== this.props.form) {
      this.setState({ form: nextProps.form });
    }
  }

  onChange = (value, name) => {
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
      for (const key in obj) {
        return (
          <div
            key={key}
            className="modal-sign-in-warn-message warn-color error"
          >
            {obj[key].msg}
          </div>
        );
      }
    }
  };

  loggingIn = e => {
    e.preventDefault();
    const { form } = this.props;
    if (this.validate()) return;
    this.props.onFormSubmit(e, form);
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

  Auth = new AuthService();

  // handleSocialLogin = (user) => {
  //   console.log(user);
  //   this.Auth.loginLinkedIn(user._token.accessToken)
  //     .then(() => {
  //       this.props.getAuthUserData();
  //     })
  //     .catch(err => console.log(err));
  // }
  //
  // handleSocialLoginFailure = (err) => {
  //   this.props.onHide();
  // }

  render() {
    const { errors, show, onHide } = this.props;
    const { form } = this.state;
    const { serverErrors, server } = this.state.errorsLogin;
    return (
      <Modal show={show} onHide={onHide}>
        <form onSubmit={this.loggingIn} name="signInForm">
          <Modal.Header closeButton>
            <Modal.Title>Sign In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input
              id="logEmail"
              label="Email"
              className="modal-sign-in-input"
              wrapperClass="form-control-group"
              value={form.logEmail}
              type="email"
              isRequired
              onChange={this.onChange}
              errors={errors.logEmail}
            />
            <Input
              id="logPass"
              label="Password"
              className="modal-sign-in-input"
              wrapperClass="form-control-group"
              value={form.logPass}
              type="password"
              isRequired
              onChange={this.onChange}
              errors={errors.logPass}
            />
            <div
              className={`modal-sign-in-warn-message warn-color ${
                server ? 'error' : ''
              }`}
            >
              Server error
            </div>
            {serverErrors && this.createErrElements(serverErrors)}
            <ButtonToolbar>
              <FBAuth getAuthUserData={this.props.getAuthUserData} />
              <GoogleAuth getAuthUserData={this.props.getAuthUserData} />
            </ButtonToolbar>
            <ButtonToolbar>
              <LinkedInAuth getAuthUserData={this.props.getAuthUserData} />
              {/* <SocialButton
                provider="linkedin"
                appId={LINKEDIN_CLIENT_ID}
                onLoginSuccess={this.handleSocialLogin}
                onLoginFailure={this.handleSocialLoginFailure}
              >
                Login with linkedIn
              </SocialButton> */}
            </ButtonToolbar>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" text="Log in" />
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

ModalSignIn.defaultProps = {
  onError: null,
  serverErrors: null,
};

ModalSignIn.propTypes = {
  setSignInFormErrors: PropTypes.func.isRequired,
  setSignInFormField: PropTypes.func.isRequired,
  clearSignInForm: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  getAuthUserData: PropTypes.func.isRequired,
  clearSignInMessageStatus: PropTypes.func.isRequired,
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
};

const mapStateToProps = ({
  signInForm: { errors, fieldsValidations, form },
  signInMessages,
}) => ({
  errors,
  fieldsValidations,
  form,
  signInMessages,
});

const mapDispatchToProps = {
  setSignInFormErrors,
  setSignInFormField,
  clearSignInForm,
  addSignInMessage,
  clearSignInMessageStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSignIn);
