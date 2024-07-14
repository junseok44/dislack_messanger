import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-300 via-yellow-400 to-pink-200">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-xl">The page you are looking for does not exist.</p>
        <button
          onClick={handleClick}
          className="px-6 py-3 mt-4 text-lg text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
