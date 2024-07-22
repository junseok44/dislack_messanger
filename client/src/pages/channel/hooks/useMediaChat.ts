// src/components/MediaChat.tsx
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "@/constants/sockets";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseMediaChatProps {
  roomId: number;
  initialVideoEnabled: boolean;
  initialAudioEnabled: boolean;
}

export interface RemoteStream {
  id: string;
  stream: MediaStream;
}

const useMediaChat = ({
  roomId,
  initialAudioEnabled,
  initialVideoEnabled,
}: UseMediaChatProps) => {
  const socket = useRef<Socket | null>(null);
  const peerConnections = useRef<{ [id: string]: RTCPeerConnection }>({});
  const localStream = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const isLocalStreamReady = useRef<boolean>(false);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [videoEnabled, setVideoEnabled] = useState(initialVideoEnabled);
  const [audioEnabled, setAudioEnabled] = useState(initialAudioEnabled);

  useEffect(() => {
    if (!roomId) return;

    if (!socket.current) {
      socket.current = io(
        process.env.REACT_APP_API_URL + SOCKET_NAMESPACES.MEDIA_CHAT
      );

      socket.current.emit(SOCKET_EVENTS.MEDIA_CHAT.JOIN, roomId);

      socket.current.on(SOCKET_EVENTS.MEDIA_CHAT.NEW_PEER, ({ peerId }) => {
        createPeerConnection(peerId);
        sendOffer(peerId);
      });

      socket.current.on(SOCKET_EVENTS.MEDIA_CHAT.PEER_LEFT, ({ peerId }) => {
        console.log("Peer left", peerId);

        if (peerConnections.current[peerId]) {
          peerConnections.current[peerId].close();
          delete peerConnections.current[peerId];
        }

        setRemoteStreams((prevStreams) =>
          prevStreams.filter((stream) => stream.id !== peerId)
        );
      });

      socket.current.on(
        SOCKET_EVENTS.MEDIA_CHAT.SDP_OFFER,
        async ({ sdpOffer, from }) => {
          await handleOffer(sdpOffer, from);
        }
      );

      socket.current.on(
        SOCKET_EVENTS.MEDIA_CHAT.SDP_ANSWER,
        async ({ sdpAnswer, from }) => {
          await handleAnswer(sdpAnswer, from);
        }
      );

      socket.current.on(
        SOCKET_EVENTS.MEDIA_CHAT.ICE_CANDIDATE,
        async ({ iceCandidate, from }) => {
          await handleCandidate(iceCandidate, from);
        }
      );
    }

    const startMedia = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }
        isLocalStreamReady.current = true; // 로컬 스트림 준비 완료
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    startMedia();

    const handleBeforeUnload = () => {
      console.log("Unmounting media chat component", roomId, socket.current);

      // Emit PEER_LEFT event when the component unmounts
      if (socket.current) {
        socket.current.emit(SOCKET_EVENTS.MEDIA_CHAT.LEAVE, roomId, () => {
          socket.current?.disconnect();
        });
      }

      // Close all peer connections
      Object.keys(peerConnections.current).forEach((peerId) => {
        peerConnections.current[peerId].close();
        delete peerConnections.current[peerId];
      });

      // Stop all local media tracks
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }

      // Clean up remote video elements
      setRemoteStreams([]);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomId]);

  useEffect(() => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        track.enabled = track.kind === "video" ? videoEnabled : audioEnabled;
      });

      Object.values(peerConnections.current).forEach((peerConnection) => {
        if (!localStream.current) return;

        localStream.current?.getTracks().forEach((track) => {
          if (!localStream.current) return;

          const sender = peerConnection
            .getSenders()
            .find((s) => s.track?.kind === track.kind);
          if (sender) {
            sender.replaceTrack(track);
          } else {
            peerConnection.addTrack(track, localStream.current);
          }
        });
      });
    }
  }, [videoEnabled, audioEnabled]);

  const createPeerConnection = (peerId: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections.current[peerId] = peerConnection;

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.current?.emit(SOCKET_EVENTS.MEDIA_CHAT.ICE_CANDIDATE, {
          roomId,
          iceCandidate: candidate,
          to: peerId,
        });
      } else {
        // console.log("All ICE candidates have been sent");
      }
    };

    peerConnection.ontrack = (event) => {
      setRemoteStreams((prevStreams) => {
        const streamExists = prevStreams.some((stream) => stream.id === peerId);
        if (!streamExists) {
          return [...prevStreams, { id: peerId, stream: event.streams[0] }];
        }
        return prevStreams;
      });
    };

    addTracksToPeerConnection(peerConnection);

    return peerConnection;
  };

  const sendOffer = async (peerId: string) => {
    const peerConnection = peerConnections.current[peerId];
    if (peerConnection) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.current?.emit(SOCKET_EVENTS.MEDIA_CHAT.SDP_OFFER, {
        roomId,
        sdpOffer: offer,
        to: peerId,
      });
    }
  };

  const handleOffer = async (
    sdpOffer: RTCSessionDescriptionInit,
    from: string
  ) => {
    await waitForLocalStream();

    const peerConnection = createPeerConnection(from);
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(sdpOffer)
    );
    // console.log("Handling offer from", from);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.current?.emit(SOCKET_EVENTS.MEDIA_CHAT.SDP_ANSWER, {
      roomId,
      sdpAnswer: answer,
      to: from,
    });

    addTracksToPeerConnection(peerConnection);
  };

  const handleAnswer = async (
    sdpAnswer: RTCSessionDescriptionInit,
    from: string
  ) => {
    const peerConnection = peerConnections.current[from];
    // console.log("Handling answer from", from);

    if (peerConnection && peerConnection.signalingState !== "closed") {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(sdpAnswer)
      );
    }
  };

  const handleCandidate = async (
    iceCandidate: RTCIceCandidateInit,
    from: string
  ) => {
    const peerConnection = peerConnections.current[from];
    if (peerConnection && peerConnection.signalingState !== "closed") {
      await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
    }
  };

  const waitForLocalStream = async () => {
    while (!isLocalStreamReady.current) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms 대기
    }
  };

  const addTracksToPeerConnection = (peerConnection: RTCPeerConnection) => {
    if (localStream.current) {
      const existingTracks = new Set(
        peerConnection.getSenders().map((sender) => sender.track)
      );
      localStream.current.getTracks().forEach((track) => {
        if (!existingTracks.has(track)) {
          // console.log(`Adding track ${track.kind} to peer connection`);
          peerConnection.addTrack(track, localStream.current!);
        } else {
          // console.log(`Track ${track.kind} already added to peer connection`);
        }
      });
    }
  };

  const toggleVideo = () => {
    setVideoEnabled((prev) => !prev);
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
  };

  return {
    localVideoRef,
    remoteStreams,
    toggleVideo,
    toggleAudio,
    audioEnabled,
    videoEnabled,
  };
};

export default useMediaChat;
