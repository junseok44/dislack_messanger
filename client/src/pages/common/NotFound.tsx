import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div>
      not found!!
      <button onClick={handleClick}>Go to home</button>
    </div>
  );
};

export default NotFound;
