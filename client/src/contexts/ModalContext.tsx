import CommonModal from "@/components/CommonModal";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface ShowModalOptions {
  title: string;
  text?: string;
  onConfirm?: () => void;
  onRequestClose?: () => void;
  children?: ReactNode;
  showControls?: boolean;
}

interface ModalContextType {
  showModal: (options: ShowModalOptions) => void;
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
    text?: string;
    onConfirm?: () => void;
    onRequestClose?: () => void;
    children?: ReactNode;
    showControls?: boolean;
  }>({
    isOpen: false,
    title: "",
    text: "",
    onConfirm: undefined,
    onRequestClose: undefined,
    children: null,
    showControls: true,
  });

  const showModal = useCallback(
    ({
      title,
      text,
      onConfirm,
      onRequestClose,
      children,
      showControls,
    }: ShowModalOptions) => {
      setModalState({
        isOpen: true,
        title,
        text,
        onConfirm,
        onRequestClose,
        children,
        showControls,
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
        showControls={modalState.showControls}
        onConfirm={modalState.onConfirm}
        onRequestClose={modalState.onRequestClose || closeModal}
      >
        {modalState.children}
      </CommonModal>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

export default ModalProvider;
