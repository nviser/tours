import React, { Component } from 'react';
import './TourSuccess.css';
import successImg from '../../../../assets/img/tour_create_success.png';
import Header from '../../../Header/Header';
import { userToursPath } from '../../../../utils/paths';
import { connect } from 'react-redux';
import HeaderMobile from '../../../HeaderMobile/HeaderMobile';

class TourSuccess extends Component {
  clickHandler = () => {
    this.props.history.push(userToursPath);
  };
  render() {
    return (
      <div>
        <HeaderMobile />
        <Header hideSearch />
        <div className="tour-create-container">
          <div className="tour-create-img">
            <img src={successImg} alt="success" />
          </div>
          <h3 className="tour-create-title">
            {this.props.selectedSingleRoute.name} tour was published
            successfully
          </h3>
          <div className="tour-create-btn--container-center">
            <button
              onClick={this.clickHandler}
              className="tour-create-btn--return button-main"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedSingleRoute: state.routes.selectedSingleRoute,
  };
};

export default connect(mapStateToProps)(TourSuccess);
