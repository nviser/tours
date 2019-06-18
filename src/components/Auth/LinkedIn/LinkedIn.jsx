import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { LINKEDIN } from '../../../utils/const';
import { REDIR_URL } from '../../../config';

const redirectUri = encodeURIComponent(REDIR_URL);
const authurl = `${LINKEDIN.OAUTH2_API_1}?response_type=code&client_id=${
  LINKEDIN.CLIENT_ID
}&redirect_uri=${redirectUri}&state=${LINKEDIN.STATE}&scope=r_basicprofile`;

const LinkedInAuth = () => (
  <div className="App">
    <a href={authurl}>
      <Button bsStyle="warning">
        <Glyphicon glyph="info-sign" />
        Sign in with Linkedin
      </Button>
    </a>
  </div>
);

export default LinkedInAuth;
