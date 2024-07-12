import { useCreateServer } from "@/hooks/server";
import React, { useEffect, useState } from "react";
import { set } from "react-hook-form";
import Modal from "react-modal";

Modal.setAppElement("#root"); // 애플리케이션의 루트 요소를 지정하여 접근성 향상

const CreateServerModal: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
}> = ({ isOpen, onRequestClose }) => {
  const [name, setName] = useState("");
  const { mutate: createServer } = useCreateServer({
    successCallback: onRequestClose,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createServer(name);
    setName("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create Server Modal"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      className="bg-background-light-subtle dark:bg-background-dark-subtle p-6 rounded-lg max-w-lg mx-auto"
    >
      <h2 className="text-xl font-semibold text-text-light-default dark:text-text-dark-default mb-4">
        Create New Server
      </h2>
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
    </Modal>
  );
};

export default CreateServerModal;
