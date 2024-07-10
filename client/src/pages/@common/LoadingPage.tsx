import FullScreenCenter from "@/components/FullScreenCenter";
import React from "react";

const LoadingPage = ({
  loadingText = "Loading...",
}: {
  loadingText?: string;
}) => {
  return (
    <FullScreenCenter>
      <div className="flex flex-col items-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <p className="text-xl">{loadingText}</p>
      </div>
    </FullScreenCenter>
  );
};

export default LoadingPage;
