import React from 'react';
import FacebookAuth from 'react-facebook-auth';
import { Button } from 'react-bootstrap';
import { FACEBOOK_CLIENT_ID } from '../../../config';
import AuthService from '../../../services/AuthService/AuthService';
import fbIcon from '../../../assets/img/facebook.svg';
import ReactSVG from 'react-svg';

const Auth = new AuthService();

const FBLogIn = (e, onClick) => {
  e.preventDefault();
  onClick();
};

const MyFacebookButton = ({ onClick }) => (
  <Button onClick={e => FBLogIn(e, onClick)} className="button-main btn-fb">
    <ReactSVG src={fbIcon} />
    Sign in with Facebook
  </Button>
);

const authenticate = (response, props) => {
  Auth.loginFacebook(response.accessToken)
    .then(() => {
      props.getAuthUserData();
    })
    .catch(err => console.log(err));
};

const FBAuth = props => (
  <div>
    <FacebookAuth
      appId={FACEBOOK_CLIENT_ID}
      callback={resp => authenticate(resp, props)}
      component={MyFacebookButton}
      profile={props.profile}
    />
  </div>
);

export default FBAuth;
