import { useModal } from "@/contexts/ModalContext";
import { useToast } from "@/contexts/ToastContext";
import { useJoinServer } from "@/hooks/server";
import React, { useState } from "react";

const InviteServerForm: React.FC = () => {
  const [code, setCode] = useState("");
  const { closeModal } = useModal();
  const { showToast } = useToast();

  const { mutate: joinServer } = useJoinServer({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    joinServer(code);

    setCode("");
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2 text-text-light-default dark:text-text-dark-default">
        Invite Code:
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter invite code"
          required
          className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
        />
      </label>
      <button
        type="submit"
        className="mt-4 bg-primary-light dark:bg-primary-dark text-white py-2 px-4 rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default InviteServerForm;
