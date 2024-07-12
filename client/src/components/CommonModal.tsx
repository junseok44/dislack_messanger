import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const CommonModal: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
  title: string;
  text: string;
  onConfirm: () => void;
}> = ({ isOpen, onRequestClose, title, text, onConfirm }) => {
  const renderTextWithLineBreaks = (text: string) => {
    return text.split("\n").map((str, index) => (
      <React.Fragment key={index}>
        {str}
        <br />
      </React.Fragment>
    ));
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      className="bg-background-light-subtle dark:bg-background-dark-subtle p-6 rounded-lg max-w-lg mx-auto"
    >
      <h2 className="text-xl font-semibold text-text-light-default dark:text-text-dark-default mb-4">
        {title}
      </h2>
      <p className="text-text-light-default dark:text-text-dark-default mb-4">
        {renderTextWithLineBreaks(text)}
      </p>
      <div className="flex justify-end">
        <button
          onClick={onRequestClose}
          className="mr-4 bg-gray-500 text-white py-2 px-4 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onRequestClose();
          }}
          className="bg-primary-light dark:bg-primary-dark text-white py-2 px-4 rounded-md"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default CommonModal;
