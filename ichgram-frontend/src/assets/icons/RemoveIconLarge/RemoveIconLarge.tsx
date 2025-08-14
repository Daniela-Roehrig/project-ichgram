import type { SVGProps } from "react";

const RemoveIconLarge = (props: SVGProps<SVGSVGElement>) => (
  <svg
    // className={styles.removeIcon}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 44 44"
    fill="none"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.667}
      d="M33 11 11 33M11 11l22 22"
    />
  </svg>
)
export default RemoveIconLarge;