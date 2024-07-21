import { useServerSocket } from "@/hooks/useServerSocket";
import { Outlet } from "react-router-dom";

const InitializeServer = () => {
  useServerSocket();

  return (
    <>
      <Outlet />
    </>
  );
};

export default InitializeServer;
