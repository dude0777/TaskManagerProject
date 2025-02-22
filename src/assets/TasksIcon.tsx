import React from "react";
import { useWindowSize } from "../hooks/useWindowSize";
const TasksIcon = ({ width = 20, height = 20, fill = "white", opacity = 0.8 }) => {
    const isMobile = useWindowSize().isMobile;
  return (
    <svg
      width={width * (isMobile ? 0.8 : 1)}
      height={height * (isMobile ? 0.8 : 1)}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.6638 3.7508C14.2477 3.95599 14.6663 4.51228 14.6663 5.16634V11.833C14.6663 13.3978 13.3978 14.6663 11.833 14.6663H5.16634C4.51228 14.6663 3.95599 14.2477 3.7508 13.6638L5.14898 13.666L11.833 13.6663C12.8455 13.6663 13.6663 12.8455 13.6663 11.833V5.16634L13.6637 5.13235L13.6638 3.7508ZM11.4975 1.33301C12.326 1.33301 12.9975 2.00458 12.9975 2.83301V11.4975C12.9975 12.326 12.326 12.9975 11.4975 12.9975H2.83301C2.00458 12.9975 1.33301 12.326 1.33301 11.4975V2.83301C1.33301 2.00458 2.00458 1.33301 2.83301 1.33301H11.4975ZM8.97945 4.97945L6.3871 7.5718L5.73301 6.69967C5.56732 6.47876 5.25392 6.43399 5.03301 6.59967C4.81209 6.76536 4.76732 7.07876 4.93301 7.29967L5.93301 8.63301C6.11557 8.87643 6.47141 8.90172 6.68656 8.68656L9.68656 5.68656C9.88182 5.4913 9.88182 5.17472 9.68656 4.97945C9.4913 4.78419 9.17472 4.78419 8.97945 4.97945Z"
        fill={fill}
        fillOpacity={opacity}
      />
    </svg>
  );
};

export default TasksIcon;