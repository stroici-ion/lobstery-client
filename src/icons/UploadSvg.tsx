import React from 'react';

const UploadSvg: React.FC = () => {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
      height="1em"
      width="1em"
    >
      <path style={{ fill: 'none' }} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline style={{ fill: 'none' }} points="17 8 12 3 7 8"></polyline>
      <line style={{ fill: 'none' }} x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  );
};

export default UploadSvg;
