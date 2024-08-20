import { FC } from 'react';

interface IPinSvg {
  className?: string;
}

const UnpinSvg: FC<IPinSvg> = ({ className }) => {
  return (
    <svg
      className={className}
      width="445"
      height="445"
      viewBox="0 0 445 445"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M283.326 68.2839L158.381 69.2475C155.144 69.2725 152.784 72.3197 153.569 75.46L154.291 78.3469C156.049 85.3802 159.686 91.8034 164.812 96.9298L171.12 103.238L161.22 224.86L151.121 230.176C140.315 235.863 131.965 245.307 127.644 256.727L126.56 259.591C125.276 262.984 126.1 266.814 128.665 269.379C132.082 272.797 136.704 274.737 141.537 274.782L208.95 275.418L221.266 422.589C221.469 425.015 225.009 425.042 225.249 422.62L239.709 276.479L302.857 273.927C307.265 273.749 311.445 271.918 314.564 268.799C317.171 266.192 317.872 262.234 316.318 258.891L314.599 255.193C309.833 244.938 301.732 236.603 291.618 231.546L280.368 225.921L271.175 102.177L276.965 96.3876C282.417 90.9355 286.177 84.0238 287.793 76.4845L288.254 74.3314C288.924 71.2034 286.525 68.2593 283.326 68.2839Z"
        stroke="#CF2E2F"
        strokeWidth="10"
      />
      <g filter="url(#filter0_d_216_9)">
        <line
          x1="77.0711"
          y1="85"
          x2="345.772"
          y2="353.701"
          stroke="#CF2E2F"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_216_9"
          x="72.071"
          y="70"
          width="278.701"
          height="288.701"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-10" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_216_9"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_216_9"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default UnpinSvg;
