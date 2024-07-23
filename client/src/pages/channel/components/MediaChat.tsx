import React, { useEffect, useRef } from "react";
import useMediaChat, { RemoteStream } from "../hooks/useMediaChat";
import useMediaChatStore from "@/store/mediaStore";

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

const TestVideoSet = ({ localStream }: { localStream: MediaStream | null }) => {
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

const MediaChat = () => {
  useMediaChat({
    roomId: 1,
  });

  const {
    toggleVideo,
    toggleAudio,
    localStream,
    remoteStreams,
    globalMode,
    toggleMode,
    audioEnabled,
    videoEnabled,
  } = useMediaChatStore();

  return (
    <div>
      <div>
        <RemoteVideos remoteStreams={remoteStreams} />
        <button onClick={toggleVideo}>
          {videoEnabled ? "Turn off Video" : "Turn on Video"}
        </button>
        <button onClick={toggleAudio}>
          {audioEnabled ? "Turn off Audio" : "Turn on Audio"}
        </button>
        <button
          onClick={() => {
            toggleMode();
          }}
        >
          toggle Mode : {globalMode ? "Global" : "Local"}
        </button>
      </div>
      {!globalMode && <TestVideoSet localStream={localStream} />}
    </div>
  );
};

export default MediaChat;
