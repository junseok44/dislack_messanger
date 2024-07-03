import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { login } = useAuth();

  return (
    <div>
      <Navbar />
      this is home!!
    </div>
  );
};

export default Home;
