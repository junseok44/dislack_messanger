import React from "react";
import { Outlet } from "react-router-dom";
import { useUserServersWithChannels } from "@/hooks/server";
import LoadingPage from "@/pages/@common/LoadingPage";
import ErrorPage from "@/pages/@common/ErrorPage";

const InitializeServer = () => {
  const { isLoading, isError } = useUserServersWithChannels();

  return (
    <>
      {isLoading ? (
        <LoadingPage loadingText="서버 정보를 불러오고 있어요..." />
      ) : isError ? (
        <ErrorPage />
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default InitializeServer;
