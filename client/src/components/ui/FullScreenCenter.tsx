import React from "react";

const FullScreenCenter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      {children}
    </div>
  );
};

export default FullScreenCenter;
