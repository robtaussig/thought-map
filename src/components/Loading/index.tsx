import React, { FC } from 'react';
import './style.css';

interface LoadingProps {
  id?: string,
}

export const Loading: FC<LoadingProps> = ({ id }) => {

  return (
    <div id={id} className="loader">
      <div className="outer"></div>
      <div className="middle"></div>
      <div className="inner"></div>
    </div>
  );
};

export default Loading;
