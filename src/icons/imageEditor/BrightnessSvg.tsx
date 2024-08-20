import React from 'react';

const BrightnessSvg: React.FC = () => {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13" cy="13" r="6" fill="black" />
      <path
        d="M1 13H4M25 13H22M13 1V4M13 25V22M4 4L6.25 6.25M22 22L19.75 19.75M22 4L19.75 6.25M4 22L6.25 19.75"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default BrightnessSvg;
