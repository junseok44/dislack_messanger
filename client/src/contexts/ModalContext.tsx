import CommonModal from "@/components/CommonModal";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface ModalContextType {
  showModal: (title: string, text: string, onConfirm: () => void) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  showModal: () => {},
  closeModal: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    text: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    text: "",
    onConfirm: () => {},
  });

  const showModal = useCallback(
    (title: string, text: string, onConfirm: () => void) => {
      setModalState({
        isOpen: true,
        title,
        text,
        onConfirm,
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState((prevState) => ({
      ...prevState,
      isOpen: false,
    }));
  }, []);

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      <CommonModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        text={modalState.text}
        onConfirm={modalState.onConfirm}
        onRequestClose={closeModal}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

export default ModalProvider;
