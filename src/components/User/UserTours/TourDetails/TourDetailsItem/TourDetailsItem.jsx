import React, { Fragment } from 'react';
import ReactImageFallback from 'react-image-fallback';
import noImg from '../../../../../assets/img/icons/no-photo.png';
import loader from '../../../../../assets/img/loading.gif';
import { API_URL } from '../../../../../config';
import './TourDetailsItem.css';
import TourPointMeasure from '../../TourStopList/TourPointMeasure/TourPointMeasure';

const imgType = type => {
  return type.substr(0, 5) === 'image';
};

const setImage = item => {
  const attach = item.attachments;
  if (attach && Array.isArray(attach)) {
    for (let i = 0; i < attach.length; i++) {
      if (attach[i].file && imgType(attach[i].file.mime_type)) {
        return `${API_URL}/posts/${item.id}/attachments/${
          attach[i].file_id
        }?width=200`;
      }
    }
  }
  return noImg;
};

const setAddress = info => {
  const arr = [];
  if (info.property_address_full) {
    return info.property_address_full.full_address;
  }
  [
    info.property_address_city,
    info.property_address_state,
    info.property_address_zip,
  ].forEach(item => {
    if (item) {
      arr.push(item);
    }
  });
  return arr.join(', ');
};

const TourDetailsItem = ({ posts, isPurchased, cost, morePosts }) => {
  return (
    posts &&
    posts.map((item, index) => (
      <Fragment key={index}>
        <div className="stop-point-container">
          <div className="stop-left">
            <div className="stop-img">
              <ReactImageFallback
                src={setImage(item)}
                initialImage={loader}
                fallbackImage={noImg}
                alt="point-img"
                className="point-image"
              />
            </div>
            <div className="stop-descr">
              <div className="stop-item-header">
                <h4>{item.title}</h4>
              </div>
              <div className="stop-info-text">
                {setAddress(item.property.info)}
              </div>
            </div>
          </div>
          <div className="stop-number pull-right">
            <span>{index + 1}</span>
          </div>
        </div>
        {!(
          index + 1 === posts.length &&
          (!morePosts || !cost || isPurchased)
        ) ? (
          <TourPointMeasure posts={posts} number={index} key={index} />
        ) : null}
      </Fragment>
    ))
  );
};

export default TourDetailsItem;
