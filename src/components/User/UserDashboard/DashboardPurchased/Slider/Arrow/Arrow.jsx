import React from 'react';

const arrow = props => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        background: '#fff',
        borderRadius: '50%',
      }}
      onClick={onClick}
    />
  );
};

export default arrow;
