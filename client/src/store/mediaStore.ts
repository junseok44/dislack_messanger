import { create } from "zustand";
import { useRef, MutableRefObject } from "react";

interface RemoteStream {
  id: string;
  stream: MediaStream;
}

interface StoreState {
  mediaRoomId: number | null;
  setMediaRoomId: (roomId: number | null) => void;

  localStream: MediaStream | null;
  setLocalStream: (stream: MediaStream | null) => void;

  remoteStreams: RemoteStream[];
  resetRemoteStreams: () => void;
  addNewRemoteStream: (newStream: { id: string; stream: MediaStream }) => void;
  removeRemoteStream: (id: string) => void;

  videoEnabled: boolean;
  audioEnabled: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;

  setMediaEnabled: (video: boolean, audio: boolean) => void;

  globalMode: boolean;
  setGlobalMode: (mode: boolean) => void;
  toggleMode: () => void;

  disconnect: () => void;
}

const useMediaChatStore = create<StoreState>((set) => ({
  mediaRoomId: null,
  setMediaRoomId: (roomId) =>
    set(() => ({
      mediaRoomId: roomId,
      videoEnabled: true,
      audioEnabled: true,
    })),

  localStream: null,
  setLocalStream: (stream) => set(() => ({ localStream: stream })),

  remoteStreams: [],
  resetRemoteStreams: () => set(() => ({ remoteStreams: [] })),
  addNewRemoteStream: (newStream) =>
    set((state) => {
      const streamExists = state.remoteStreams.some(
        (stream) => stream.id === newStream.id
      );
      if (!streamExists) {
        return { remoteStreams: [...state.remoteStreams, newStream] };
      }
      return state;
    }),

  removeRemoteStream: (id) =>
    set((state) => ({
      remoteStreams: state.remoteStreams.filter((stream) => stream.id !== id),
    })),

  videoEnabled: true,
  audioEnabled: true,
  toggleVideo: () => set((state) => ({ videoEnabled: !state.videoEnabled })),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),

  setMediaEnabled: (video, audio) =>
    set(() => ({
      videoEnabled: video,
      audioEnabled: audio,
    })),

  globalMode: true,
  setGlobalMode: (mode) => set(() => ({ globalMode: mode })),
  toggleMode: () => set((state) => ({ globalMode: !state.globalMode })),

  disconnect: () => {
    set(() => ({ mediaRoomId: null }));
  },
}));

export default useMediaChatStore;
