import { PAGE_ROUTE } from "@/constants/routeName";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserServersWithChannels } from "../hooks";
import { Channel } from "@/@types";

const ChannelSideBar = ({
  channels,
  onClickChannels,
}: {
  channels: Channel[];
  onClickChannels: (channelId: number) => void;
}) => {
  return (
    <div className="w-60 bg-secondary-dark h-full">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="h-12 bg-secondary-dark flex items-center cursor-pointer"
          onClick={() => onClickChannels(channel.id)}
        >
          {channel.name}
        </div>
      ))}
    </div>
  );
};

export default ChannelSideBar;
