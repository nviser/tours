import React from 'react';
import locImg from '../../../../assets/img/merchant/pin.svg';

const LocationAddress = ({ address }) => (
  <li className="aside-item">
    <img src={locImg} alt="primary_address" />
    {address.short_address}
  </li>
);

export default LocationAddress;
