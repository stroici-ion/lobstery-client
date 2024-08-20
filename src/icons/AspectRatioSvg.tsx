import React from 'react';

const AspectRatioSvg: React.FC = () => {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        style={{ fill: 'none' }}
        d="M18 1H10C8.89543 1 8 1.89543 8 3V19C8 20.1046 8.89543 21 10 21H18C19.1046 21 20 20.1046 20 19V3C20 1.89543 19.1046 1 18 1Z"
        stroke="black"
        strokeWidth="2"
      />
      <path
        style={{ fill: 'none' }}
        d="M1 9V3C1 1.89543 1.89543 1 3 1H5"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        style={{ fill: 'none' }}
        d="M27 9V3C27 1.89543 26.1046 1 25 1H23"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        style={{ fill: 'none' }}
        d="M27 13V19C27 20.1046 26.1046 21 25 21H23"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        style={{ fill: 'none' }}
        d="M1 13V19C1 20.1046 1.89543 21 3 21H5"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AspectRatioSvg;
