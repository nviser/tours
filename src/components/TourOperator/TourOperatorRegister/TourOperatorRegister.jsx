import React, { Component } from 'react';
import './TourOperatorRegister.css';
import Input from '../../Input';
import {
  setTourOperatorFormErrors,
  setTourOperatorFormField,
  clearTourOperatorForm,
  setTourOperatorForm,
} from '../../../actions/signUpTourOperatorActions';
import {
  addTourOperatorRegisterMessage,
  addTourOperatorRegisterMessageFinished,
} from '../../../actions/signUpTourOperatorMsg';
import { connect } from 'react-redux';
import { setLoader } from '../../../actions/loaderActions';
import withAuth from '../../../services/withAuth/withAuth';
import { validate } from '../../../utils/validator';
import ApiService from '../../../services/ApiService/ApiService';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { dashboardPath, agentRegistrationApiPath } from '../../../utils/paths';
import { setSelectedSignUpSuggestions } from '../../../actions/suggestActions';
import { setEditableUserData } from '../../../actions/editTourOperatorForm';
import registerFooter from '../../../assets/img/tour-op-register.svg';
import { Link } from 'react-router-dom';
import Checkbox from '../../UI/Checkbox/Checkbox';
import { setCompanyData } from '../../../actions/companyActions';
import { setUserProfile } from '../../../actions/authAction';
import { STRIPE_SECURE_LINK } from '../../../utils/const';

const mapStateToProps = state => {
  return {
    errors: state.signUpTourOperatorForm.errors,
    fieldsValidations: state.signUpTourOperatorForm.fieldsValidations,
    form: state.signUpTourOperatorForm.form,
    registerTourOperatorFormMessages: state.signUpTourOperatorFormMsg,
    auth: state.auth,
    userData: state.auth.userData,
    propertyValue: state.suggest.selectedSignUpSuggestion.value,
  };
};

const mapDispatchToProps = {
  setLoader,
  setTourOperatorFormErrors,
  setTourOperatorFormField,
  clearTourOperatorForm,
  addTourOperatorRegisterMessage,
  addTourOperatorRegisterMessageFinished,
  setSelectedSignUpSuggestions,
  setEditableUserData,
  setCompanyData,
  setUserProfile,
  setTourOperatorForm,
};

class TourOperatorRegister extends Component {
  state = {
    form: {
      phone_number: '',
    },
    errors: {},
    agree: false,
    notAgreeError: false,
    isCompany: false,
    isMerchCompany: this.props.userData.staff,
  };

  componentDidMount() {
    const tourCreatorDisplayName = localStorage.getItem(
      'tourCreatorDisplayName'
    );
    if (tourCreatorDisplayName) {
      this.setState({
        form: {
          ...this.state.form,
          display_name: tourCreatorDisplayName,
        },
      });
    }
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

    if (!this.state.agree) {
      this.setState({ notAgreeError: true });
      if (this.validate()) return;
      return;
    }
    if (this.validate()) return;
    this.submitHandler(e, form);
  };
  componentWillUnmount() {
    this.props.setSelectedSignUpSuggestions({});
  }

  submitHandler = (e, credentials) => {
    e.preventDefault();
    if (!this.state.isCompany) {
      credentials.business_type = 'individual';
    } else {
      credentials.business_type = 'company';
      delete credentials.display_name;
    }
    this.sendTourOperatorData(credentials);
  };

  sendTourOperatorData = data => {
    if (!data.website_url.length) delete data.website_url;
    this.props.setLoader(true);
    this.Api.sendComponent(data, agentRegistrationApiPath)
      .then(response => {
        window.open(response.data, '_self');
      })
      .catch(err => {
        this.props.setLoader(false);
        this.setState({
          serverErr: true,
        });
        if (err && err.response && err.response.data) {
          if (err.response.data.error) {
            this.setServerErrors(err.response.data);
          } else if (err.response.data.errors) {
            this.setServerErrors(err.response.data.errors);
          }
        }
      });
  };

  onChange = (value, name) => {
    if (name === 'display_name') {
      localStorage.setItem('tourCreatorDisplayName', value);
    }
    this.props.setTourOperatorFormField(name, value);
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
    if (
      !this.state.isCompany &&
      (!form.hasOwnProperty('display_name') || form.display_name.length <= 0)
    ) {
      formErrors.display_name = [
        { type: 'isRequired', message: 'Display Name is required' },
      ];
      hasErrors = true;
    }

    this.props.setTourOperatorFormErrors(formErrors);
    return hasErrors;
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

  goBack = path => {
    this.props.history.push(path);
  };
  Api = new ApiService();

  agreeHandler = e => {
    this.setState({ agree: e.target.checked, notAgreeError: false });
  };
  companyHandler = e => {
    this.setState({ isCompany: e.target.checked });
  };
  resetForm = () => {
    this.props.clearTourOperatorForm();
    this.goBack(dashboardPath);
  };
  render() {
    const { errors } = this.props;
    const { form } = this.state;
    const { serverErrors } = this.state.errors;

    return (
      <div className="tour-operator-register">
        <form
          className="tour-operator-register-form"
          onSubmit={this.registerHandler}
        >
          <h3 className="header">Tour Creator Registration</h3>
          <p className="description">
            Fill out the information below to start telling your stories.
          </p>
          <div className="form-control-group">
            <Input
              id="display_name"
              label="Tour Creator Display Name *"
              className="form-input"
              placeHolder="Insert Tour Creator Display Name"
              value={form.display_name}
              type="text"
              onChange={this.onChange}
              errors={errors.display_name}
            />
          </div>
          <div className="form-control-group">
            <div className="company-checkbox">
              <Checkbox
                defaultChecked={this.state.isCompany}
                changeHandler={this.companyHandler}
                id="company-checkbox"
                svgId="company-checkbox-svg"
              />
              <label className="company-label" htmlFor="company-checkbox-svg">
                I’m registering as an incorporated business with Federal Tax ID
              </label>
            </div>
          </div>

          <div className="additional-terms">
            Information provided here (except for Tour Creator Display Name) is
            confidential and held securely using
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={STRIPE_SECURE_LINK}
            >
              {' '}
              PCI Level 1 Security
            </a>
            . Because you will be earning income, all Tour Creators are
            registered as 1099 vendors, which is why this information is
            collected. None of this is visible to the public — it is held
            privately.
          </div>
          <div className="terms_and_conditions">
            <Checkbox
              defaultChecked={this.state.agree}
              changeHandler={this.agreeHandler}
              error={this.state.notAgreeError}
              id="agree-checkbox"
              svgId="agree-checkbox-svg"
            />
            <label htmlFor="agree-checkbox-svg">
              <span
                className={
                  'agree' + (this.state.notAgreeError ? ' not-agree' : '')
                }
              >
                I agree to the
              </span>
              <Link to="/terms">
                &nbsp;
                <span
                  className={
                    'go-link' + (this.state.notAgreeError ? ' not-agree' : '')
                  }
                >
                  Terms and Conditions
                </span>
              </Link>
            </label>
          </div>
          {serverErrors && this.createErrElements(serverErrors)}
          <div className="tour-operator-btn-container">
            <span onClick={this.resetForm} className="btn-cancel">
              Cancel
            </span>
            <button className="btn-next button-main">Next</button>
          </div>
        </form>
        <img
          className="tour-operator-register-footer"
          src={registerFooter}
          alt=""
        />
      </div>
    );
  }
}

TourOperatorRegister.defaultProps = {
  onError: null,
  serverErrors: null,
};

TourOperatorRegister.propTypes = {
  setTourOperatorFormErrors: PropTypes.func.isRequired,
  setTourOperatorFormField: PropTypes.func.isRequired,
  clearTourOperatorForm: PropTypes.func.isRequired,
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
};

export default withAuth(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TourOperatorRegister)
);
