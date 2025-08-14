import React from "react";

const Lock = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={96}
    height={96}
    fill="none"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M48 95c25.957 0 47-21.043 47-47S73.957 1 48 1 1 22.043 1 48s21.043 47 47 47Z"
    />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M37.999 39.996v-6.998a10 10 0 0 1 20 0v6.998m2.932 30.005H35.065a5.034 5.034 0 0 1-5.068-5.004V46.005A5.037 5.037 0 0 1 35.065 41H60.93a5.037 5.037 0 0 1 5.066 5.004v18.992A5.033 5.033 0 0 1 60.93 70v.001Z"
    />
  </svg>
);

export default Lock;
