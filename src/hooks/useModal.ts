import { useState } from "react";

interface ModalState {
  isOpen: boolean;
  message: string;
  title?: string;
  type?: "success" | "error" | "info";
  onConfirm?: () => void;
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    message: "",
    title: "",
    type: "info",
  });

  const showModal = (
    message: string,
    type: "success" | "error" | "info" = "info",
    title?: string,
    onConfirm?: () => void
  ) => {
    setModalState({
      isOpen: true,
      message,
      title,
      type,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    modalState,
    showModal,
    closeModal,
  };
};
