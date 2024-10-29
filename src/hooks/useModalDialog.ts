import { useRef, useState } from 'react';
import useClickOutside from './useClickOutside';

export enum EnumModalDialogOptionType {
  RETURN = 0,
  OTHER = 1,
}

export type TModalDialogOption = {
  type?: EnumModalDialogOptionType;
  title: string;
  callback?: () => void;
  className?: string;
};

export type IModalDialogType = {
  isMain?: boolean;
  title: string;
  description?: string;
  className?: string;
  options: TModalDialogOption[];
};

export interface IModal {
  modalRef: React.MutableRefObject<null>;
  isOpen: boolean;
  isDialogOpen: boolean;
  open: () => void;
  forceHide: () => void;
  onHide: () => void;
  dialog: {
    ref: React.MutableRefObject<null>;
    isOpen: boolean;
    title: string | undefined;
    description: string | undefined;
    className: string | undefined;
    options: TModalDialogOption[];
    setDialogParams: (dp: IModalDialogType | undefined, showInstantly?: boolean) => void;
  };
}

type IUseModalDialog = (dialogProps?: IModalDialogType) => IModal;

export const useModalDialog: IUseModalDialog = (dialogProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogParams, setDialogParams] = useState<IModalDialogType | undefined>(dialogProps);

  const modalRef = useRef(null);
  const dialogRef = useRef(null);

  const showModal = () => setIsModalOpen(true);

  const handleSetDialogParams = (dp: IModalDialogType | undefined, showInstantly?: boolean) => {
    setDialogParams(dp);
    if (showInstantly) setIsDialogOpen(true);
  };

  const onModalHide = () => (dialogParams && !dialogParams.isMain ? setIsDialogOpen(true) : setIsModalOpen(false));

  const onDialogHide = () => setIsDialogOpen(false);

  const forceHide = () => {
    setIsModalOpen(false);
    setIsDialogOpen(false);
  };

  const onDialogFullfill = () => {
    setIsModalOpen(false);
    setIsDialogOpen(false);
  };

  useClickOutside(modalRef, onModalHide);
  useClickOutside(dialogRef, onDialogHide);

  const options = [];

  if (dialogParams?.options?.length) {
    dialogParams.options.forEach((option) => {
      switch (option.type) {
        case EnumModalDialogOptionType.RETURN: {
          options.push({
            ...option,
            callback: () => {
              option.callback?.();
              onDialogHide();
            },
          });
          break;
        }
        default:
          options.push({
            ...option,
            callback: () => {
              option.callback?.();
              onDialogFullfill();
            },
          });
      }
    });
  } else options.push({ title: 'Ok', callback: onDialogFullfill });

  return {
    modalRef,
    isOpen: isModalOpen,
    isDialogOpen,
    open: showModal,
    onHide: onModalHide,
    forceHide,
    dialog: {
      ref: dialogRef,
      isOpen: isDialogOpen,
      title: dialogParams?.title,
      description: dialogParams?.description,
      className: dialogParams?.className,
      options,
      setDialogParams: handleSetDialogParams,
    },
  };
};
