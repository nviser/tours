import React from 'react';
import GoogleLogin from 'react-google-login';
import AuthService from '../../../services/AuthService/AuthService';
import { GOOGLE_CLIENT_ID } from '../../../config';
import glIcon from '../../../assets/img/google.svg';

const Auth = new AuthService();

const responseGoogle = (resp, props) => {
  Auth.loginGoogle(resp.accessToken)
    .then(() => {
      props.getAuthUserData();
    })
    .catch(err => console.log(err));
};

const responseFailGoogle = err => {
  console.log(err);
};

const GoogleAuth = props => (
  <div className="gl-login">
    <img src={glIcon} alt="google" />
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      buttonText="Sign in with Google"
      onSuccess={resp => responseGoogle(resp, props)}
      onFailure={responseFailGoogle}
      className="button-main btn-google"
    />
  </div>
);

export default GoogleAuth;
