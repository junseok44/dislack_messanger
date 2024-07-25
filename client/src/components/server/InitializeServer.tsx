import useMediaChat from "@/pages/channel/hooks/useMediaChat";
import { Outlet } from "react-router-dom";
import GlobalMediaChat from "../GlobalMediaChat";
import { useServerSocket } from "@/hooks/server/useServerSocket";

const InitializeServer = () => {
  useServerSocket();
  useMediaChat();

  return (
    <>
      <GlobalMediaChat />
      <Outlet />
    </>
  );
};

export default InitializeServer;
