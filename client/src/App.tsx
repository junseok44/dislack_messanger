import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router-dom";
import ErrorFallback from "./components/ErrorFallback";
import PublicRoute from "./components/PublicRoute";
import { PAGE_ROUTE } from "./constants/routeName";
import NotFound from "./pages/@common/NotFound";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./pages/@common/MainLayout";
import Channel from "./pages/channel";
import MyPage from "./pages/mypage";
import Friends from "./pages/friends";
import MyPageLayout from "./pages/@common/MyPageLayout";

const App: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      key={PAGE_ROUTE.HOME}
      onReset={() => {
        window.location.reload();
      }}
    >
      <Routes>
        <Route path={PAGE_ROUTE.HOME} element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path={PAGE_ROUTE.CHANNELS} element={<Channel />} />
            <Route element={<MyPageLayout />}>
              <Route path={PAGE_ROUTE.CHANNELS_ME} element={<MyPage />} />
              <Route path={PAGE_ROUTE.CHANNELS_FRIENDS} element={<Friends />} />
            </Route>
          </Route>
        </Route>
        <Route element={<PublicRoute />}>
          <Route path={PAGE_ROUTE.REGISTER} element={<Register></Register>} />
          <Route path={PAGE_ROUTE.LOGIN} element={<Login></Login>} />
        </Route>
        <Route path={PAGE_ROUTE.ALL} element={<NotFound></NotFound>} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
