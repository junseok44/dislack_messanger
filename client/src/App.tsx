import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import NotFound from "./pages/common/NotFound";
import { PAGE_ROUTE } from "./constants/routeName";
import PublicRoute from "./components/PublicRoute";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path={PAGE_ROUTE.HOME} element={<Home />} />
      <Route element={<PublicRoute />}>
        <Route path={PAGE_ROUTE.REGISTER} element={<Register></Register>} />
        <Route path={PAGE_ROUTE.LOGIN} element={<Login></Login>} />
      </Route>
      <Route path={PAGE_ROUTE.ALL} element={<NotFound></NotFound>} />
    </Routes>
  );
};

export default App;
