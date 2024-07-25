import useMediaChat from "@/pages/channel/hooks/useMediaChat";
import { Outlet } from "react-router-dom";
import GlobalMediaChat from "../GlobalMediaChat";
import { useServerSocket } from "@/hooks/server/useServerSocket";
import useMediaChatStore from "@/store/mediaStore";
import { useEffect } from "react";

const InitializeServer = () => {
  useServerSocket();
  useMediaChat();

  const { disconnect } = useMediaChatStore();

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <>
      <GlobalMediaChat />
      <Outlet />
    </>
  );
};

export default InitializeServer;
