import React, { Component } from 'react';
import { InfoWindow } from 'react-google-maps';
import { setInfoWindow } from '../../../../../actions/mapActions';
import { connect } from 'react-redux';
import StarsRating from '../../../../UI/StarsRating/StarsRating';
import './InfoWindowEx.css';

const mapDispatchToProps = {
  setInfoWindow,
};

class InfoWindowEx extends Component {
  render() {
    return (
      <InfoWindow onCloseClick={() => this.props.setInfoWindow({})}>
        <div className="info-window">
          <span
            className="iw-category"
            style={{ color: this.props.route.categories[0].color }}
          >
            {this.props.route.categories[0].name}
          </span>
          <h3 className="iw-title">{this.props.route.name}</h3>
          <div className="iw-rating">
            <StarsRating
              rating={
                this.props.route &&
                this.props.route.review &&
                this.props.route.review.rating
              }
            />
            {this.props.route.review.count} Reviews
          </div>
        </div>
      </InfoWindow>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(InfoWindowEx);
