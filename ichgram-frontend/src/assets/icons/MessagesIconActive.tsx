import type { SVGProps } from "react"
const MessagesIconActive = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path fill="#fff" d="M0 0h24v24H0z" />
    <path
      fill="#000"
      stroke="#000"
      strokeMiterlimit={10}
      strokeWidth={1.739}
      d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.88 10.88 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.802.802 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 9.999-9.7Z"
    />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M17.79 10.132a.66.66 0 0 0-.962-.873l-2.556 2.05a.63.63 0 0 1-.758.002L11.06 9.47a1.576 1.576 0 0 0-2.277.42l-2.567 3.98a.659.659 0 0 0 .961.875l2.556-2.049a.63.63 0 0 1 .76-.002l2.451 1.84a1.576 1.576 0 0 0 2.278-.42l2.568-3.982Z"
      clipRule="evenodd"
    />
  </svg>
)
export default MessagesIconActive;