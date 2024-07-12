import React from "react";
import { Outlet } from "react-router-dom";
import ServerSelector from "../../components/server/ServerSelector";

const MainLayout = () => {
  return (
    <div className="h-screen w-screen flex bg-background-dark">
      <ServerSelector />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
