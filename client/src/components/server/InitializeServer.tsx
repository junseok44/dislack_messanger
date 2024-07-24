import { useServerSocket } from "@/hooks/useServerSocket";
import useMediaChat from "@/pages/channel/hooks/useMediaChat";
import { Outlet } from "react-router-dom";
import GlobalMediaChat from "../GlobalMediaChat";

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
