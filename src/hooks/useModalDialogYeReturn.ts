import { useState } from 'react';

// Custom hook to manage modal and dialog behavior

export const useModalDialogYeReturn = (styes?: { yes: string; return: string }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setIsDialogOpen(false);
  };

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const dialogOptions = [
    {
      title: 'Yes',
      onClick: handleCloseModal,
      className: styes?.yes,
    },
    {
      title: 'Return',
      onClick: handleCloseDialog,
      className: styes?.return,
    },
  ];

  return {
    isModalOpen,
    isDialogOpen,
    handleOpenModal,
    handleCloseModal,
    handleOpenDialog,
    handleCloseDialog,
    dialogOptions,
  };
};
