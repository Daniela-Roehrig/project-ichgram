import type { SVGProps } from "react"
const ExploreIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m13.941 13.953-6.36 2.471 2.48-6.368 6.36-2.471-2.48 6.368Z"
    />
    <path
      fill="#000"
      fillRule="evenodd"
      d="m10.06 10.056 3.89 3.889-6.369 2.479 2.48-6.368Z"
      clipRule="evenodd"
    />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12.001 22.505c5.799 0 10.5-4.701 10.5-10.5s-4.701-10.5-10.5-10.5-10.5 4.701-10.5 10.5 4.701 10.5 10.5 10.5Z"
    />
  </svg>
)
export default ExploreIcon;
