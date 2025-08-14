import type { SVGProps } from "react";

const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
<svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.005 15.545a2.997 2.997 0 0 1 5.995 0V21h7V10.543L13 1 3 10.543V21h7.005v-5.455Z"
    />
  </svg>
)
export default HomeIcon;