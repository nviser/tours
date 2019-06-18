import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loaders';
import PropTypes from 'prop-types';

import './LoaderComponent.css';

const mapStateToProps = state => ({
  isLoading: state.loader.isLoading,
});

const LoaderComponent = props => (
  <Fragment>
    {props.isLoading ? <Loader type="ball-clip-rotate-multiple" /> : null}
  </Fragment>
);

LoaderComponent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
export default connect(mapStateToProps)(LoaderComponent);
