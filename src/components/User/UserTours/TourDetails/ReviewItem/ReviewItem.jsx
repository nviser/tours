import React from 'react';
import ReactImageFallback from 'react-image-fallback';
import moment from 'moment';
import noImg from '../../../../../assets/img/icons/no-photo.png';
import loader from '../../../../../assets/img/loading.gif';
import StarsRating from '../../../../UI/StarsRating/StarsRating';
import { API_URL } from '../../../../../config';
import './ReviewItem.css';

const setImage = item => {
  return `${API_URL}/users/${item.id}/avatar?width=45`;
};

const ReviewItem = ({ reviews }) =>
  reviews &&
  reviews.map((item, index) => (
    <div className="review-container" key={index}>
      <div className="review-block">
        <div className="left-side">
          <div className="review-img">
            <ReactImageFallback
              src={setImage(item.created_by)}
              initialImage={loader}
              fallbackImage={noImg}
              alt="point-img"
              className="point-image"
            />
          </div>
          <div className="review-data">
            <h4 className="review-header">
              {item.created_by.first_name} {item.created_by.last_name}
            </h4>
            <StarsRating rating={item.rating} />
          </div>
        </div>
        <div className="right-side">
          <div className="review-date">
            {moment(item.created_at).format('ll')}
          </div>
        </div>
      </div>
      <div className="reviews-body">{item.body}</div>
    </div>
  ));

export default ReviewItem;
