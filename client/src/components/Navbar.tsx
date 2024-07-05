import { PAGE_ROUTE } from "@/constants/routeName";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <Link to={PAGE_ROUTE.HOME}>Home</Link>
        </li>

        {!user && (
          <>
            <li>
              <Link to={PAGE_ROUTE.LOGIN}>Login</Link>
            </li>
            <li>
              <Link to={PAGE_ROUTE.REGISTER}>Register</Link>
            </li>
          </>
        )}
        {user && (
          <li>
            <button onClick={() => logout()}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
