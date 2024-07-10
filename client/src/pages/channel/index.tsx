import React from "react";
import Sidebar from "./components/Sidebar";

const Channel = () => {
  return (
    <div className="flex-grow h-full flex">
      <Sidebar />
      <div className="flex-grow h-full bg-background-dark">
        안녕하세요! 여기는 채널입니다.
      </div>
    </div>
  );
};

export default Channel;
