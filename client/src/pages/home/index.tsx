import { API_ROUTE, PAGE_ROUTE } from "@/constants/routeName";
import { useAuth } from "@/contexts/AuthContext";
import { api, ApiError } from "@/lib/fetch";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  // useEffect(() => {
  //   navigate(PAGE_ROUTE.CHANNELS_ME);
  // }, []);

  const onClick = () => {
    navigate(PAGE_ROUTE.CHANNELS_ME);
  };

  return (
    <div className="w-screen h-screen bg-background-dark flex justify-center items-center flex-col">
      <h1 className="text-2xl">welcome {user ? user.username : null}</h1>
      <button onClick={onClick}>go to mypage</button>
    </div>
  );
};

export default Home;
