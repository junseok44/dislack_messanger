import React from "react";

const Divider = ({
  width = "w-full", // 기본값으로 100%
  height = "h-1", // 기본값으로 1 (기본값을 원하는 크기로 변경 가능)
  bgColor = "bg-secondary-dark", // 기본값으로 bg-secondary-dark
}) => {
  return <div className={`${width} ${height} ${bgColor}`}></div>;
};

export default Divider;
