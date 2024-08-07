import { useCreateServer, useUserServersWithChannels } from "@/hooks/server";
import React, { useState } from "react";

const CreateServerForm: React.FC = () => {
  const [name, setName] = useState("");
  const { mutate: createServer } = useCreateServer();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createServer(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2 text-text-light-default dark:text-text-dark-default">
        Server Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter server name"
          required
          className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
        />
      </label>

      <button
        type="submit"
        className="mt-4 bg-primary-light dark:bg-primary-dark text-white py-2 px-4 rounded-md"
      >
        Create
      </button>
    </form>
  );
};

export default CreateServerForm;
