import { useCallback, useEffect, useRef, useState } from 'react';

interface UseModalProps {
  isOpen: boolean;
  onHide: () => void;
}

interface ModalResult {
  modalRef: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
  handleOutsideClick: (event: MouseEvent) => void;
  closeModal: () => void;
}

export const useModal = ({ isOpen, onHide }: UseModalProps): ModalResult => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => {
    setIsVisible(false);
    onHide(); // Trigger the onHide callback
  }, [onHide]);

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      setIsVisible(false);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, handleOutsideClick]);

  return {
    modalRef,
    isVisible,
    handleOutsideClick,
    closeModal,
  };
};
