// src/components/MediaChat.tsx
import { SOCKET_EVENTS, SOCKET_NAMESPACES } from "@/constants/sockets";
import { useAuth } from "@/contexts/AuthContext";
import { useGetCurrentServerFromChannelId } from "@/hooks/server";
import useMediaChatStore from "@/store/mediaStore";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface RemoteStream {
  id: string;
  stream: MediaStream;
}

const useMediaChat = () => {
  const socket = useRef<Socket | null>(null);
  const peerConnections = useRef<{ [id: string]: RTCPeerConnection }>({});
  const isLocalStreamReady = useRef<boolean>(false);

  const { user } = useAuth();

  const {
    mediaRoomId: roomId,
    audioEnabled,
    videoEnabled,
    localStream,
    setLocalStream,
    addNewRemoteStream,
    removeRemoteStream,
    resetRemoteStreams,
    remoteStreams,
    globalMode,
  } = useMediaChatStore();

  const serverId = useGetCurrentServerFromChannelId(roomId)?.id;

  // roomId가 있을때, startMedia하고 localStream을 설정한다.
  useEffect(() => {
    if (!roomId) return;

    startMedia();
  }, [roomId]);

  // roomId가 생기고, 그로 인해 startMedia가 실행되면, 소켓 연결을 한다.
  // localStream을 새롭게 설정하기 때문에,

  // 지금 문제는, roomid가 바뀌고, emit을 두번을 해버림. 왜? roomid 바뀐 다음에 한번 실행. 이때는 localStream이 null되기 전이라 한번 실행.
  // 그다음에 null 된다음에 다시 localstream이 생기고 나서 다시 보내줌.
  useEffect(() => {
    if (!roomId || !localStream) return;

    // 소켓 연결하기
    if (!socket.current) {
      socket.current = io(
        process.env.REACT_APP_API_URL + SOCKET_NAMESPACES.MEDIA_CHAT
      );

      // 이런 핸들러들은 방 바뀔때마다 등록할 필요가 있나? ㄴㄴ.
      socket.current.on(SOCKET_EVENTS.MEDIA_CHAT.NEW_PEER, ({ peerId }) => {
        createPeerConnection(peerId);
        sendOffer(peerId);
      });

      socket.current.on(SOCKET_EVENTS.MEDIA_CHAT.PEER_LEFT, ({ peerId }) => {
        if (peerConnections.current[peerId]) {
          peerConnections.current[peerId].close();
          delete peerConnections.current[peerId];
        }

        removeRemoteStream(peerId);
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

    socket.current.emit(SOCKET_EVENTS.MEDIA_CHAT.JOIN, {
      roomId,
      serverId,
      user,
    });

    // localStream을 deps로 등록하는 이유는? addtrack부분에서 localstream이 있어야 전송이 되더라고.
  }, [localStream]);

  // 새로고침, 혹은 다른 room으로의 변경, 혹은 아예 연결끊기시에 어떻게 할지.
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomId]);

  useEffect(() => {
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, []);

  // 비디오, 오디오 트랙 활성화/비활성화
  useEffect(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.enabled = track.kind === "video" ? videoEnabled : audioEnabled;
      });

      Object.values(peerConnections.current).forEach((peerConnection) => {
        if (!localStream) return;

        localStream?.getTracks().forEach((track) => {
          if (!localStream) return;

          const sender = peerConnection
            .getSenders()
            .find((s) => s.track?.kind === track.kind);
          if (sender) {
            sender.replaceTrack(track);
          } else {
            peerConnection.addTrack(track, localStream);
          }
        });
      });
    }
  }, [videoEnabled, audioEnabled, localStream]);

  const startMedia = async () => {
    try {
      const response = await navigator.mediaDevices.getUserMedia({
        audio: audioEnabled,
        video: videoEnabled,
      });

      setLocalStream(response);
      isLocalStreamReady.current = true;
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  // roomId가 바뀌거나, 새로고침될때는 모든 peerConnections를 닫고, leave한다.
  const handleBeforeUnload = () => {
    if (!roomId) return;

    if (socket.current) {
      socket.current.emit(SOCKET_EVENTS.MEDIA_CHAT.LEAVE, {
        roomId,
        serverId,
        userId: user?.id,
      });
    }

    // Close all peer connections
    Object.keys(peerConnections.current).forEach((peerId) => {
      peerConnections.current[peerId].close();
      delete peerConnections.current[peerId];
    });

    peerConnections.current = {};

    // localStream의 각 track을 stop하는거랑.
    // localStream 자체를 지워버리는거랑 차이는?

    // 방을 옮기는 경우. -> stop하지만 어차피, localStream을 다시 set해주고 있음.
    // 연결을 아예 끊는 경우 -> localStream을 null이지만,

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    // Clean up remote video elements
    resetRemoteStreams();
    setLocalStream(null);
  };

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
      addNewRemoteStream({
        id: peerId,
        stream: event.streams[0],
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
    if (localStream) {
      const existingTracks = new Set(
        peerConnection.getSenders().map((sender) => sender.track)
      );
      localStream.getTracks().forEach((track) => {
        if (!existingTracks.has(track)) {
          peerConnection.addTrack(track, localStream!);
        }
      });
    }
  };

  return {
    remoteStreams,
    audioEnabled,
    videoEnabled,
  };
};

export default useMediaChat;
