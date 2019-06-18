import React from 'react';
import './UserForgotPassword.css';
import Input from '../../Input';
import { Link } from 'react-router-dom';
import ApiService from '../../../services/ApiService/ApiService';
import pageLogo from '../../../assets/img/light.svg';
import pageFooter from '../../../assets/img/img-footer.svg';
class ForgotUserPassword extends React.Component {
  state = {
    email: '',
    show: true,
    serverErr: false,
    errors: {},
  };
  Api = new ApiService();
  onChange = (value, name) => {
    this.setState({ email: value, errors: {} });
  };
  setServerErrors = errs => {
    for (let key in errs) {
      if (errs.hasOwnProperty(key)) {
        errs[key] = [errs[key]];
      }
    }
    this.setState({
      errors: errs,
    });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }
  onSubmit = e => {
    e.preventDefault();
    this.Api.forgotPassword(this.state.email)
      .then(res => {
        this.setState({ show: false });
      })
      .catch(err => {
        this.setState({
          serverErr: true,
        });
        if (err && err.response && err.response.data.errors) {
          this.setServerErrors(err.response.data.errors);
        }
      });
  };
  goBack = () => {
    this.props.history.push('/login');
  };
  render() {
    return (
      <div className="forgot-page">
        <img className="page-logo" src={pageLogo} alt="Logo" />
        {this.state.show ? (
          <div className="forgot-form">
            <h3 className="forgot-header">Forgot your password?</h3>
            <p className="forgot-description">
              If you have forgotten your password you can reset it here.
            </p>
            <div className="forgot-fields">
              <form onSubmit={this.onSubmit}>
                <Input
                  id="regEmail"
                  isRequired
                  label="Email"
                  className="forgot-input"
                  placeHolder="Insert email address"
                  wrapperClass="form-control-group"
                  value={this.state.email}
                  type="email"
                  onChange={this.onChange}
                  errors={this.state.errors.email}
                />
                <div className="forgot-btn-container">
                  <Link to="/login">
                    <span className="cancel">Cancel</span>
                  </Link>
                  <button className="btn-forgot" type="submit">
                    Request pasword
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="forgot-success">
            <h3 className="forgot-header">
              A password change link has been sent to your e-mail address.{' '}
            </h3>
            <button className="back-button" onClick={this.goBack}>
              go to sign in
            </button>
          </div>
        )}
        <img className="footer" src={pageFooter} alt="" />
      </div>
    );
  }
}
export default ForgotUserPassword;
