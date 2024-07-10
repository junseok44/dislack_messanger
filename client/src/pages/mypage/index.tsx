import { useAuth } from "@/contexts/AuthContext";

const MyPage = () => {
  const { logout } = useAuth();

  return (
    <div
      className="flex-grow h-full"
      onClick={() => {
        logout();
      }}
    ></div>
  );
};

export default MyPage;
