import React, { useEffect, useRef } from "react";
import useMediaChat, { RemoteStream } from "../hooks/useMediaChat";

const LocalVideo = React.memo(
  ({ localVideoRef }: { localVideoRef: React.RefObject<HTMLVideoElement> }) => {
    return (
      <video ref={localVideoRef} autoPlay muted style={{ width: "300px" }} />
    );
  }
);

export const RemoteVideos = React.memo(
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

const MediaChat = () => {
  const {
    localVideoRef,
    remoteStreams,
    toggleAudio,
    toggleVideo,
    audioEnabled,
    videoEnabled,
  } = useMediaChat({
    roomId: 1,
    initialVideoEnabled: true,
    initialAudioEnabled: true,
  });

  return (
    <div>
      <LocalVideo localVideoRef={localVideoRef} />
      <RemoteVideos remoteStreams={remoteStreams} />
      <div>
        <button onClick={toggleVideo}>
          {videoEnabled ? "Turn off Video" : "Turn on Video"}
        </button>
        <button onClick={toggleAudio}>
          {audioEnabled ? "Turn off Audio" : "Turn on Audio"}
        </button>
      </div>
    </div>
  );
};

export default MediaChat;
