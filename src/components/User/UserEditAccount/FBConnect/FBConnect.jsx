import React from 'react';
import FacebookAuth from 'react-facebook-auth';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { FACEBOOK_CLIENT_ID } from '../../../../config';
import { connectFacebookApiPath } from '../../../../utils/paths';
import ApiService from '../../../../services/ApiService/ApiService';
import { setLoader } from '../../../../actions/loaderActions';
import { setUserProfile } from '../../../../actions/authAction';
import fbIcon from '../../../../assets/img/facebook.svg';
import ReactSVG from 'react-svg';

const mapStateToProps = state => {
  return {
    facebookID: state.auth.userData.facebook_id,
  };
};

const mapDispatchToProps = {
  setLoader,
  setUserProfile,
};

const Api = new ApiService();

const switchFBConnect = (e, onClick, facebookID, setUserProfile) => {
  e.preventDefault();
  if (facebookID) {
    Api.deleteComponent(connectFacebookApiPath).then(res =>
      setUserProfile(res.data)
    );
  } else {
    onClick();
  }
};

const MyFacebookButton = props => {
  return (
    <Button
      onClick={e =>
        switchFBConnect(
          e,
          props.onClick,
          props.facebookID,
          props.setUserProfile
        )
      }
      className="button-main btn-fb"
    >
      <ReactSVG src={fbIcon} />
      {props.facebookID ? 'Disconnect from' : 'Connect with'} Facebook
    </Button>
  );
};

const authenticate = (response, props) => {
  Api.sendComponent(
    { access_token: response.accessToken },
    connectFacebookApiPath
  )
    .then(res => {
      props.handleConnect(res.data);
    })
    .catch(err => props.handleError(err));
};

const FBConnect = props => (
  <div>
    <FacebookAuth
      customProps={props}
      appId={FACEBOOK_CLIENT_ID}
      callback={resp => authenticate(resp, props)}
      component={MyFacebookButton}
      profile={props.profile}
    />
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FBConnect);
