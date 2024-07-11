import React from "react";
import { Outlet } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import { useUserServersWithChannels } from "@/hooks/useUserServerWithChannels";

const InitializeMainPage = () => {
  const { data, isLoading, isError } = useUserServersWithChannels();

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

export default InitializeMainPage;
