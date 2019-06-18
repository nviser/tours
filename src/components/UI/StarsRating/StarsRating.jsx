import React, { Component } from 'react';
import './StarsRating.css';

class StarsRating extends Component {
  state = {
    totalStars: 5,
  };
  onChange = () => {};
  render() {
    let rating = [];
    for (let i = 0; i < this.state.totalStars; i++) {
      if (i < this.props.rating) {
        rating.push(<i className="fa fa-star" aria-hidden="true" />);
      } else {
        rating.push(<i className="fa fa-star empty" aria-hidden="true" />);
      }
    }
    return (
      <div className="stars-rating">
        <div className="rating-group">
          {rating.map((rate, index) => (
            <span className="" key={index}>
              {rate}
            </span>
          ))}
        </div>
      </div>
    );
  }
}

StarsRating.defaultProps = {
  rating: 5,
};

export default StarsRating;
