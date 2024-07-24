import React, { useEffect, useRef } from "react";
import useMediaChatStore from "@/store/mediaStore";
import { RemoteStream } from "@/pages/channel/hooks/useMediaChat";

const RemoteVideos = React.memo(
  ({ remoteStreams }: { remoteStreams: RemoteStream[] }) => {
    return (
      <div id="remote-videos">
        {remoteStreams.map((remoteStream) => (
          <video
            key={remoteStream.id}
            ref={(video) => {
              if (video) {
                video.srcObject = remoteStream.stream;
                video.onloadeddata = () => {
                  video.play().catch((error) => {
                    console.error("Error playing remote video:", error);
                  });
                };
              }
            }}
            autoPlay
            style={{ width: "300px" }}
          ></video>
        ))}
      </div>
    );
  }
);

const LocalVideo = ({ localStream }: { localStream: MediaStream | null }) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <video ref={localVideoRef} autoPlay muted style={{ width: "300px" }} />
  );
};

const GlobalMediaChat = () => {
  const { localStream, remoteStreams, globalMode, mediaRoomId } =
    useMediaChatStore();

  return globalMode && mediaRoomId ? (
    <div className="fixed z-10 hidden">
      <LocalVideo localStream={localStream} />
      <RemoteVideos remoteStreams={remoteStreams} />
    </div>
  ) : null;
};

export default GlobalMediaChat;
