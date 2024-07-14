import { ShowModalOptions } from "@/@types/modal";
import { ReactNode } from "react";

import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  title: string;
  text?: string;
  onConfirm?: () => void;
  onRequestClose?: () => void;
  children?: ReactNode;
  showControls?: boolean;
  showModal: (options: ShowModalOptions) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: "",
  text: "",
  onConfirm: undefined,
  onRequestClose: undefined,
  children: null,
  showControls: true,
  showModal: (options) =>
    set({
      isOpen: true,
      ...options,
    }),
  closeModal: () => set({ isOpen: false, showControls: true }),
}));
