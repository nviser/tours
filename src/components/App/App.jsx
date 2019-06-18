import React, { Component } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import LoaderComponent from '../../components/LoaderComponent/LoaderComponent';
import { connect } from 'react-redux';
import './App.css';

const mapStateToProps = state => ({
  fullScreen: state.fullScreen,
});

class App extends Component {
  render() {
    return (
      <div
        className={
          this.props.fullScreen.fullScreen ? 'full-screen-fixed' : null
        }
      >
        <LoaderComponent />
        <Navigation />
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
