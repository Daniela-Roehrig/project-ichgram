import type { SVGProps } from "react";

const SearchIconActive = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z"
    />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16.511 16.511 22 22"
    />
  </svg>
)
export default SearchIconActive;
