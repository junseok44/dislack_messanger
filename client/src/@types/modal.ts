import { ReactNode } from "react";

interface BaseModalOptions {
  title: string;
  text?: string;
  onRequestClose?: () => void;
  children?: ReactNode;
  showControls?: boolean;
}

export interface ModalOptionsWithControls extends BaseModalOptions {
  showControls: true;
  onConfirm: () => void;
}

export interface ModalOptionsWithoutControls extends BaseModalOptions {
  showControls?: false;
  onConfirm?: never;
}

export type ShowModalOptions =
  | ModalOptionsWithControls
  | ModalOptionsWithoutControls;
