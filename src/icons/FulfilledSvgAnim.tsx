import React from 'react';

const FulfilledSvgAnim: React.FC = () => {
  return (
    <svg id="Group134" width="118" height="118" viewBox="0 0 118 118" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M40 58L40.3517 58.2878C47.3598 64.0217 52.9806 71.266 56.7937 79.4788V79.4788C57.0312 79.9902 57.7788 79.9222 57.9199 79.3763L60.1304 70.8292C63.3226 58.4861 69.6503 47.1774 78.5 38V38"
        stroke="#4AA33E"
        strokeWidth="10"
        stroke-linecap="round"
        stroke-dasharray="0,0,0,75.84602355957031"
      >
        <animate
          attributeType="XML"
          attributeName="stroke-dasharray"
          repeatCount="1"
          dur="0.9090909090909091s"
          values="0,0,0,75.84602355957031; 
    0,37.923011779785156,37.923011779785156,0; 
    75.84602355957031,0,0,0"
          keyTimes="0; 0.5; 1"
          fill="freeze"
        ></animate>
      </path>
      <circle cx="59" cy="59" r="54" stroke="#4AA33E" strokeWidth="10" stroke-dasharray="0,0,0,338.743896484375">
        <animate
          attributeType="XML"
          attributeName="stroke-dasharray"
          repeatCount="1"
          dur="0.9090909090909091s"
          values="0,0,0,338.743896484375; 
    0,169.3719482421875,169.3719482421875,0; 
    338.743896484375,0,0,0"
          keyTimes="0; 0.5; 1"
          fill="freeze"
        ></animate>
      </circle>
    </svg>
  );
};

export default FulfilledSvgAnim;
