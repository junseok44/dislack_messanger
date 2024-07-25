import LoadingPage from "../@common/LoadingPage";
import ErrorPage from "../@common/ErrorPage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_ROUTE } from "@/constants/routeName";
import { useUserServersWithChannels } from "@/hooks/server";

const Home = () => {
  const { data: allServers, isLoading, isError } = useUserServersWithChannels();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && allServers) {
      if (allServers.length === 0) {
        navigate(PAGE_ROUTE.ONBOARDING);
      } else {
        navigate(
          PAGE_ROUTE.GOTO_CHANNEL(
            allServers[0].id,
            allServers[0].channels[0].id
          )
        );
      }
    }
  }, [allServers]);

  return isError ? (
    <ErrorPage />
  ) : (
    <LoadingPage loadingText="서버 정보를 불러오고 있어요..." />
  );
};

export default Home;
