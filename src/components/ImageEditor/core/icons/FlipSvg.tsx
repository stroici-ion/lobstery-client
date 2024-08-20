import React from 'react';

const FlipSvg: React.FC = () => {
  return (
    <svg width="32" height="27" viewBox="0 0 32 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.5 25.5H1.5L14.5 1V25.5Z"
        fill="black"
        stroke="black"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        style={{ fill: 'none' }}
        d="M18 25.5H31L18 1V25.5Z"
        stroke="black"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FlipSvg;
