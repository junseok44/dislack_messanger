import React, { useState } from "react";
import { useCreateChannel } from "../hooks";
import useModal from "@/hooks/useModal";
import Switch from "react-switch";
import { ChannelType } from "@/@types/channel";

const CreateChannelForm = ({ serverId }: { serverId: number }) => {
  const [name, setName] = useState("");
  const [channelType, setChannelType] = useState<ChannelType>(ChannelType.TEXT);

  const { closeModal } = useModal();
  const { mutate: createChannel } = useCreateChannel({
    successCallback: () => {
      closeModal();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createChannel({ name, serverId: Number(serverId), type: channelType });
    setName("");
  };

  const handleSwitchChange = (checked: boolean) => {
    setChannelType(checked ? ChannelType.VOICE : ChannelType.TEXT);
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
      <label className="mb-2 text-text-light-default dark:text-text-dark-default flex items-center">
        채널의 타입 :{" "}
        {channelType === ChannelType.TEXT ? "텍스트 채널" : "음성채팅"}
        <Switch
          onChange={handleSwitchChange}
          checked={channelType === ChannelType.VOICE}
          onColor="#86d3ff"
          onHandleColor="#2693e6"
          offColor="#ccc"
          offHandleColor="#fff"
          handleDiameter={30}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          className="react-switch"
          id="material-switch"
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
