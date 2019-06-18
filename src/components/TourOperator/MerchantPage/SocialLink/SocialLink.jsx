import React from 'react';

const SocialLink = ({ link, type, img }) => (
  <li className="aside-item">
    <a target="_blank" rel="noopener noreferrer" href={link ? link : '/'}>
      <img src={img} alt={type} />
      <span>{link}</span>
    </a>
  </li>
);

export default SocialLink;
