import { useModalStore } from "@/store/modalStore";
import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const CommonModal: React.FC = () => {
  const {
    isOpen,
    title,
    text,
    onConfirm,
    onRequestClose,
    children,
    showControls,
    closeModal,
  } = useModalStore();

  const renderTextWithLineBreaks = (text: string) => {
    return text.split("\n").map((str, index) => (
      <React.Fragment key={index}>
        {str}
        <br />
      </React.Fragment>
    ));
  };

  const handleCloseModal = () => {
    onRequestClose && onRequestClose();
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel={title}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      className="bg-background-light-subtle dark:bg-background-dark-subtle p-6 rounded-lg max-w-sm mx-auto"
    >
      <h2 className="text-xl font-semibold text-text-light-default dark:text-text-dark-default mb-4">
        {title}
      </h2>
      {text && (
        <p className="text-text-light-default dark:text-text-dark-default mb-4">
          {renderTextWithLineBreaks(text)}
        </p>
      )}
      {children}
      {showControls && (
        <div className="flex justify-end">
          {onRequestClose && (
            <button
              onClick={handleCloseModal}
              className="mr-4 bg-gray-500 text-white py-2 px-4 rounded-md"
            >
              Cancel
            </button>
          )}
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm();
                onRequestClose && onRequestClose();
              }}
              className="bg-primary-light dark:bg-primary-dark text-white py-2 px-4 rounded-md"
            >
              Confirm
            </button>
          )}
        </div>
      )}
    </Modal>
  );
};

export default CommonModal;
