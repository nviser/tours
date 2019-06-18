import React from 'react';
import SocialLogin from 'react-social-login';
import { Glyphicon, Button } from 'react-bootstrap';

const getLogin = (e, triggerLogin) => {
  e.preventDefault();
  triggerLogin();
};

const SocButton = ({ children, triggerLogin, ...props }) => (
  <div>
    <Button
      onClick={e => getLogin(e, triggerLogin)}
      bsStyle="warning"
      {...props}
    >
      <Glyphicon glyph="star" />
      {children}
    </Button>
  </div>
);

export default SocialLogin(SocButton);
