import React from 'react';
import envImg from '../../../../assets/img/merchant/envelope.png';

const EmailAddress = ({ email }) => (
  <li className="aside-item">
    <a href={`mailto:${email}`}>
      <img src={envImg} alt="email" />
      <span>{email}</span>
    </a>
  </li>
);

export default EmailAddress;
