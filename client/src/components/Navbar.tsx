import { PAGE_ROUTE } from "@/constants/routeName";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "./ui/Container";
// import { SunIcon, MoonIcon, MenuIcon, XIcon } from "@heroicons/react/solid";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [colorMode, setColorMode] = useState("light");

  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const bg =
    colorMode === "light"
      ? "bg-background-light-subtle"
      : "bg-background-dark-subtle";
  const color =
    colorMode === "light"
      ? "text-text-light-default"
      : "text-text-dark-default";
  const buttonBg =
    colorMode === "light" ? "bg-secondary-light" : "bg-secondary-dark";
  const buttonTextColor =
    colorMode === "light"
      ? "text-text-light-default"
      : "text-text-dark-default";

  return (
    <div className={`${bg} shadow-md`}>
      <Container>
        <div className="flex h-16 items-center justify-between">
          <button
            className="md:hidden"
            aria-label="Open Menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* {isOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )} */}
          </button>
          <div className="flex items-center space-x-8">
            <div className={`font-bold text-xl ${color}`}>
              <Link to={PAGE_ROUTE.HOME}>MyApp</Link>
            </div>
            <nav className="hidden md:flex space-x-4 items-center">
              {!user && (
                <>
                  <Link to={PAGE_ROUTE.LOGIN}>
                    <button className={`text-sm ${color}`}>Login</button>
                  </Link>
                  <Link to={PAGE_ROUTE.REGISTER}>
                    <button
                      className={`text-sm ${buttonBg} ${buttonTextColor} px-3 py-1 rounded-md`}
                    >
                      Register
                    </button>
                  </Link>
                </>
              )}
              {user && (
                <button
                  className={`text-sm ${buttonBg} ${buttonTextColor} px-3 py-1 rounded-md`}
                  onClick={() => logout()}
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
          <div className="flex items-center">
            <button
              aria-label="Toggle Color Mode"
              onClick={toggleColorMode}
              className="mr-2"
            >
              {/* {colorMode === "light" ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6" />
              )} */}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden pb-4">
            <nav className="space-y-4">
              {!user && (
                <>
                  <Link to={PAGE_ROUTE.LOGIN}>
                    <button
                      className={`block w-full text-left ${color}`}
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </button>
                  </Link>
                  <Link to={PAGE_ROUTE.REGISTER}>
                    <button
                      className={`block w-full text-left ${buttonBg} ${buttonTextColor} px-3 py-1 rounded-md`}
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </button>
                  </Link>
                </>
              )}
              {user && (
                <button
                  className={`block w-full text-left ${buttonBg} ${buttonTextColor} px-3 py-1 rounded-md`}
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Navbar;
