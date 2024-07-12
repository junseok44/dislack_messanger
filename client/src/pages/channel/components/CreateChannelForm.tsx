import React, { useState } from "react";
import { useModal } from "@/contexts/ModalContext";
import { useParams } from "react-router-dom";
import { useCreateChannel } from "../hooks";

const CreateChannelForm = ({ serverId }: { serverId: number }) => {
  const [name, setName] = useState("");
  const { closeModal } = useModal();
  const { mutate: createChannel } = useCreateChannel({
    successCallback: () => {
      closeModal();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createChannel({ name, serverId: Number(serverId) });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2 text-text-light-default dark:text-text-dark-default">
        Enter the name of the channel :
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter channel name"
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

export default CreateChannelForm;
