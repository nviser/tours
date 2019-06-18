import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { restrictedRoute } from '../../utils/paths';
import { AGENT_ROLE } from '../../utils/const';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  role: state.auth.userData.role,
});

const privateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      render={props => {
        return !rest.role || rest.role === AGENT_ROLE ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to={restrictedRoute} />
        );
      }}
    />
  );
};

export default connect(mapStateToProps)(privateRoute);
