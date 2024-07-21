import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router-dom";
import InitializeServer from "./components/server/InitializeServer";
import ErrorFallback from "./components/utils/ErrorFallback";
import PrivateRoute from "./components/utils/PrivateRoute";
import PublicRoute from "./components/utils/PublicRoute";
import { PAGE_ROUTE } from "./constants/routeName";
import MainLayout from "./pages/@common/MainLayout";
import NotFound from "./pages/@common/NotFound";
import Channel from "./pages/channel";
import CheckoutPage from "./pages/checkout";
import Home from "./pages/home";
import Login from "./pages/login";
import OnboardingPage from "./pages/onboarding";
import ProductsPage from "./pages/products";
import Register from "./pages/register";

const Router = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      key={PAGE_ROUTE.HOME}
      onReset={() => {
        window.location.reload();
      }}
    >
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route element={<InitializeServer />}>
            <Route element={<MainLayout />}>
              <Route path={PAGE_ROUTE.CHANNELS} element={<Channel />} />
            </Route>
          </Route>
          <Route path={PAGE_ROUTE.HOME} element={<Home />} />
          <Route path={PAGE_ROUTE.PRODUCTS} element={<ProductsPage />} />
          <Route path={PAGE_ROUTE.CHECKOUT} element={<CheckoutPage />} />
          <Route path={PAGE_ROUTE.ONBOARDING} element={<OnboardingPage />} />
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

export default Router;
