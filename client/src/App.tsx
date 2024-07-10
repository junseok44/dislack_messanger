import React from "react";
import Router from "./Router";
import { useAuth } from "./contexts/AuthContext";
import LoadingPage from "./pages/@common/LoadingPage";

const App: React.FC = () => {
  const { authLoading, authError } = useAuth();

  if (authLoading) {
    return <LoadingPage loadingText="checking loggedIn..." />;
  }

  if (authError) {
    return <div className="w-screen h-screen bg-background-dark">Error!!</div>;
  }

  return <Router />;
};

export default App;
