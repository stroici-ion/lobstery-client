import React from 'react';

const CropSvg: React.FC = () => {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 0V3.5M16.5 13H13.5M0 3.5H4M4 3.5V11C4 12.1046 4.89543 13 6 13H13.5M13.5 13V16.5M6 3.5H11.5C12.6046 3.5 13.5 4.39543 13.5 5.5V11"
        stroke="black"
        strokeWidth="2"
        style={{ fill: 'none' }}
      />
    </svg>
  );
};

export default CropSvg;
