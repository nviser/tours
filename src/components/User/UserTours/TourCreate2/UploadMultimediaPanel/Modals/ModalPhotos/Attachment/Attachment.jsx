import React from 'react';
import deleteImg from '../../../../../../../../assets/img/delete.png';
import './Attachment.css';

const Attachment = props => {
  return (
    <div className="photos-attachment">
      <img src={props.preview} alt={props.name} />
      <div
        className="photos-attachment-delete"
        onClick={() => props.onCancel(props.name)}
      >
        <img src={deleteImg} alt="delete attachment" />
      </div>
    </div>
  );
};

export default Attachment;
