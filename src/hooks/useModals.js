import { useCallback, useState } from 'react';

export function useModals() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const openModal = useCallback((name) => {
    setActiveModal(name);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setActiveModal(null);
  }, []);

  return {
    isOpen,
    activeModal,
    openModal,
    closeModal,
  };
}
