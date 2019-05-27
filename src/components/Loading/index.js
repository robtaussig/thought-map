import React from 'react';
import './style.css';

export const Loading = ({ id }) => {

  return (
    <div id={id} className="loader">
      <div className="outer"></div>
      <div className="middle"></div>
      <div className="inner"></div>
    </div>
  );
};

export default Loading;
