import React from 'react';
import phoneImg from '../../../../assets/img/merchant/phone.png';

const PhoneNumber = ({ phone }) => (
  <li className="aside-item">
    <a href={`tel:${phone}`}>
      <img src={phoneImg} alt="phone_number" />
      <span>{phone}</span>
    </a>
  </li>
);

export default PhoneNumber;
