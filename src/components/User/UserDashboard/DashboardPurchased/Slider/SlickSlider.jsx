import React from 'react';
import Slider from 'react-slick';
import TourItem from '../../../../TourItem/TourItem';
import TourBottom from '../../../../TourBottom/TourBottom';
import Arrow from './Arrow/Arrow';

class SlickSlider extends React.Component {
  render() {
    var settings = {
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      centerMode: true,
      variableWidth: true,
      autoplay: false,
      arrows: true,
      nextArrow: <Arrow />,
      prevArrow: <Arrow />,
    };
    return (
      <Slider {...settings} className="purchased-slider">
        {this.props.toursPurchased &&
          this.props.toursPurchased.map(tour => (
            <TourItem key={tour.id} route={tour}>
              <TourBottom route={tour} />
            </TourItem>
          ))}
      </Slider>
    );
  }
}

export default SlickSlider;
