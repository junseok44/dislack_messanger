import React from "react";
import Sidebar from "../../components/server/ServerSelector";
import { Outlet } from "react-router-dom";

const MyPageLayout = () => {
  return (
    <div className="flex-grow h-full flex">
      <div className="w-60 bg-secondary-dark h-full">
        THIS IS MY PAGE LAYOUT
      </div>
      <Outlet />
    </div>
  );
};

export default MyPageLayout;
