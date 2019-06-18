import React from 'react';
import './UserResetPassword.css';
import pageLogo from '../../../assets/img/light.svg';
import pageFooter from '../../../assets/img/img-footer.svg';
import Input from '../../Input';
import ApiService from '../../../services/ApiService/ApiService';

class UserResetPassword extends React.Component {
  state = {
    password: '',
    confirmPassword: '',
    show: true,
    errors: {},
  };
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  Api = new ApiService();
  onChange = (value, name) => {
    this.setState({ [name]: value, errors: {} });
  };
  onSubmit = e => {
    e.preventDefault();
    if (!this.validation()) return;
    const token = decodeURIComponent(this.props.location.search.substr(7));
    this.Api.resetPassword(
      this.state.password,
      this.state.confirmPassword,
      token
    ).then(res => {
      this.props.history.push('/login');
    });
  };

  validation = () => {
    if (this.state.password.length < 8) {
      this.setState({
        errors: {
          password: [
            {
              message: 'Password should be at least 8 chars long',
            },
          ],
        },
      });
      return false;
    } else if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        errors: {
          rePassword: [
            {
              message: 'Passwords do not match',
            },
          ],
        },
      });
      return false;
    }
    this.setState({ errors: {} });
    return true;
  };
  render() {
    return (
      <div className="forgot-page reset-password">
        <img className="page-logo" src={pageLogo} alt="Logo" />
        {this.state.show ? (
          <div className="forgot-form">
            <h3 className="forgot-header">New Password</h3>
            <div className="forgot-fields">
              <form className="sign-up-form" onSubmit={this.onSubmit}>
                <Input
                  id="password"
                  isRequired
                  label="Password"
                  className="forgot-input"
                  placeHolder="Insert password"
                  wrapperClass="form-control-group"
                  value={this.state.password}
                  type="password"
                  onChange={this.onChange}
                  errors={this.state.errors.password}
                />

                <Input
                  id="confirmPassword"
                  isRequired
                  label="Confirm password"
                  className="forgot-input"
                  placeHolder="Confirm password"
                  wrapperClass="form-control-group"
                  value={this.state.confirmPassword}
                  type="password"
                  onChange={this.onChange}
                  errors={this.state.errors.rePassword}
                />

                <div className="forgot-btn-container">
                  <button className="btn-forgot" type="submit">
                    Set New Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="forgot-header">
              A password change link has been sent to your e-mail address.{' '}
            </h3>
          </div>
        )}
        <img className="footer" src={pageFooter} alt="" />
      </div>
    );
  }
}
export default UserResetPassword;
