import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { validate } from '../../utils/validator';
import {
  setSignUpFormErrors,
  setSignUpFormField,
  clearSignUpForm,
} from '../../actions/signUpFormActions';
import {
  addSignUpMessage,
  clearSignUpMessageStatus,
} from '../../actions/signUpMessagesActions';
import './ModalSignUp.css';
import Input from '../Input';
import Button from '../Button';

class ModalSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {},
      errors: {},
    };
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

  onChange = (value, name) => {
    this.props.setSignUpFormField(name, value);
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

  signUp = e => {
    e.preventDefault();
    const { form } = this.props;
    if (this.validate()) return;
    this.props.onFormSignUpSubmit(e, form);
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

  render() {
    const { errors, show, onHide } = this.props;
    const { form } = this.state;
    const { serverErrors } = this.state.errors;
    return (
      <Modal show={show} onHide={onHide}>
        <form onSubmit={this.signUp} name="signUpForm">
          <Modal.Header closeButton>
            <Modal.Title>Create your account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-input-wrap">
              <div className="halved-inputs">
                <Input
                  id="regFirstName"
                  isRequired
                  label="First name"
                  className="modal-sign-in-input"
                  wrapperClass="form-control-group"
                  value={form.regFirstName}
                  type="text"
                  onChange={this.onChange}
                  errors={errors.regFirstName}
                />
              </div>
              <div className="halved-inputs">
                <Input
                  id="regLastName"
                  isRequired
                  label="Last name"
                  className="modal-sign-in-input"
                  wrapperClass="form-control-group"
                  value={form.regLastName}
                  type="text"
                  onChange={this.onChange}
                  errors={errors.regLastName}
                />
              </div>
            </div>
            <Input
              id="regEmail"
              isRequired
              label="Email"
              className="modal-sign-in-input"
              wrapperClass="form-control-group"
              value={form.regEmail}
              type="email"
              onChange={this.onChange}
              errors={errors.regEmail}
            />
            {serverErrors &&
              serverErrors.email &&
              this.createErrElements(serverErrors)}
            <Input
              id="regPass"
              isRequired
              label="Password"
              className="modal-sign-in-input"
              wrapperClass="form-control-group"
              value={form.regPass}
              type="password"
              onChange={this.onChange}
              errors={errors.regPass}
            />
            <Input
              id="regConfirmPass"
              isRequired
              label="Confirm password"
              className="modal-sign-in-input"
              wrapperClass="form-control-group"
              value={form.regConfirmPass}
              type="password"
              onChange={this.onChange}
              errors={errors.regConfirmPass}
            />
            {serverErrors &&
              !serverErrors.email &&
              this.createErrElements(serverErrors)}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" text="Sign up" />
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

ModalSignUp.defaultProps = {
  onError: null,
  serverErrors: null,
};

ModalSignUp.propTypes = {
  setSignUpFormErrors: PropTypes.func.isRequired,
  setSignUpFormField: PropTypes.func.isRequired,
  clearSignUpForm: PropTypes.func.isRequired,
  onFormSignUpSubmit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  clearSignUpMessageStatus: PropTypes.func.isRequired,
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

const mapStateToProps = ({
  signUpForm: { errors, fieldsValidations, form },
  signUpMessages,
}) => ({
  errors,
  fieldsValidations,
  form,
  signUpMessages,
});

const mapDispatchToProps = {
  setSignUpFormErrors,
  setSignUpFormField,
  clearSignUpForm,
  addSignUpMessage,
  clearSignUpMessageStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSignUp);
