import React from 'react';

const LockSvg: React.FC = () => {
  return (
    <svg viewBox="0 0 124 146" fill="none">
      <path
        d="M103 77H22C19.2386 77 17 79.2386 17 82V132C17 134.761 19.2386 137 22 137H103C105.761 137 108 134.761 108 132V82C108 79.2386 105.761 77 103 77Z"
        fill="black"
        stroke="black"
        strokeWidth="10"
      />
      <path
        d="M33 73.5V49.75C33 33.8718 45.8718 21 61.75 21V21C77.6282 21 90.5 33.8718 90.5 49.75V73.5"
        stroke="black"
        style={{ fill: 'none' }}
        strokeWidth="20"
      />
    </svg>
  );
};

export default LockSvg;
