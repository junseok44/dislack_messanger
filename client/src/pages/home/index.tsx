import Navbar from "@/components/Navbar";
import { API_ROUTE, PAGE_ROUTE } from "@/constants/routeName";
import { useAuth } from "@/contexts/AuthContext";
import { api, ApiError } from "@/lib/fetch";
import { useMutation, useQuery } from "@tanstack/react-query";

const Home = () => {
  const { user, logout } = useAuth();

  const { mutate, isSuccess } = useMutation({
    mutationFn: () => api.get(API_ROUTE.CHECK, {}),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === 401) {
        logout(PAGE_ROUTE.LOGIN);
      }
    },
  });

  // query의 경우에는 어떻게? 만약에 401 에러가 발생한다면,
  //https://velog.io/@devohda/tanstack-query-V5-%EC%97%90%EC%84%9C-%EC%82%AC%EB%9D%BC%EC%A7%84-onSuccess-onError-onSettled

  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ["user"],
  //   queryFn: () => api.get(API_ROUTE.CHECK, {}),
  //   onError,
  // });

  return (
    <div>
      <Navbar />
      this is home!!
      {user && <div>{user.username}</div>}
      <button onClick={() => mutate()}>Check</button>
      {isSuccess && <div>Success</div>}
    </div>
  );
};

export default Home;
