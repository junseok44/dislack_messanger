import useMediaChatStore from "@/store/mediaStore";
import React, { useEffect, useRef } from "react";
import { RemoteStream } from "../hooks/useMediaChat";

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

const VideoContainer = ({
  localStream,
  remoteStreams,
  currentChannelId,
  setGlobalMode,
  toggleVideo,
  toggleAudio,
  audioEnabled,
  videoEnabled,
}: {
  localStream: MediaStream | null;
  remoteStreams: RemoteStream[];
  currentChannelId: number;
  setGlobalMode: (mode: boolean) => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  audioEnabled: boolean;
  videoEnabled: boolean;
}) => {
  useEffect(() => {
    setGlobalMode(false);

    return () => {
      setGlobalMode(true);
    };
  }, [currentChannelId]);

  return (
    <div>
      <LocalVideo localStream={localStream} />
      <RemoteVideos remoteStreams={remoteStreams} />
      <button onClick={toggleVideo}>
        {videoEnabled ? "Turn off Video" : "Turn on Video"}
      </button>
      <button onClick={toggleAudio}>
        {audioEnabled ? "Turn off Audio" : "Turn on Audio"}
      </button>
    </div>
  );
};

const MediaChat = ({ currentChannelId }: { currentChannelId: number }) => {
  const {
    toggleVideo,
    toggleAudio,
    localStream,
    remoteStreams,
    setGlobalMode,
    audioEnabled,
    videoEnabled,
    mediaRoomId,
    setMediaRoomId,
  } = useMediaChatStore();

  return (
    <div>
      {currentChannelId === mediaRoomId ? (
        <VideoContainer
          localStream={localStream}
          remoteStreams={remoteStreams}
          currentChannelId={currentChannelId}
          setGlobalMode={setGlobalMode}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
        />
      ) : (
        <>
          <div>
            Join the channel to start video chat
            <button
              onClick={() => {
                setMediaRoomId(currentChannelId);
              }}
            >
              Join
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MediaChat;
