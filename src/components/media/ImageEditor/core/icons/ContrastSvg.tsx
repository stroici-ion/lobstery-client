import React from 'react';

const ContrastSvg: React.FC = () => {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13" cy="13" r="12.5" stroke="black" style={{ fill: 'none' }} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 26V0C5.8203 0 0 5.8203 0 13C0 20.1797 5.8203 26 13 26Z"
        fill="black"
      />
    </svg>
  );
};

export default ContrastSvg;
