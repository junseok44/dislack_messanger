// useModal.js

import {
  ModalOptionsWithControls,
  ModalOptionsWithoutControls,
} from "@/@types/modal";
import { useModalStore } from "@/store/modalStore";

const useModal = () => {
  const showModal = useModalStore((state) => state.showModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const showModalWithControls = (
    options: Omit<ModalOptionsWithControls, "showControls">
  ) => {
    showModal({ ...options, showControls: true });
  };

  // 하나는 onConfirm이 없는 경우. showControls는 사용자가 컨트롤 하는게 아니라, type에서 빼버린 다음에
  // 시스템에서 값을 설정해주는 방법을 사용.
  const showModalWithoutControls = (
    options: Omit<ModalOptionsWithoutControls, "showControls">
  ) => {
    showModal({ ...options, showControls: false });
  };

  return {
    showModalWithControls,
    showModalWithoutControls,
    closeModal,
  };
};

export default useModal;
