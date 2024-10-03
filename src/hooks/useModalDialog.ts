import { useRef, useState } from 'react';
import useClickOutside from './useClickOutside';

export enum EnumModalDialogOptionType {
  RETURN = 0,
  OTHER = 1,
}

export type ModalDialogOption = {
  type?: EnumModalDialogOptionType;
  title: string;
  callback: () => void;
  className?: string;
};

export type IModalDialogType = {
  title: string;
  description?: string;
  className?: string;
  options: ModalDialogOption[];
};

export interface IModal {
  dialogOptions: Omit<ModalDialogOption, 'type'>[];
  modalRef: React.MutableRefObject<null>;
  dialogRef: React.MutableRefObject<null>;
  description?: string | undefined;
  icon?: React.ReactNode;
  title?: string;
  isOpen: boolean;
  open: () => void;
  onHide: () => void;
  isDialogOpen: boolean;
}

type IUseModalDialog = (dialog?: IModalDialogType) => IModal;

export const useModalDialog: IUseModalDialog = (dialog) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const modalRef = useRef(null);
  const dialogRef = useRef(null);

  const showModal = () => setIsModalOpen(true);

  const onModalHide = () => {
    dialog ? setIsDialogOpen(true) : setIsModalOpen(false);
  };

  const onDialogHide = () => setIsDialogOpen(false);

  const onDialogFullfill = () => {
    setIsModalOpen(false);
    setIsDialogOpen(false);
  };

  useClickOutside(modalRef, onModalHide);
  useClickOutside(dialogRef, onDialogHide);

  const dialogOptions = [];

  if (dialog?.options?.length) {
    dialog.options.forEach((option) => {
      switch (option.type) {
        case EnumModalDialogOptionType.RETURN: {
          dialogOptions.push({
            ...option,
            callback: () => {
              option.callback();
              onDialogHide();
            },
          });
          break;
        }
        default:
          dialogOptions.push({
            ...option,
            callback: () => {
              option.callback();
              onDialogFullfill();
            },
          });
      }
    });
  } else dialogOptions.push({ title: 'Ok', callback: onDialogFullfill });

  return {
    modalRef,
    dialogRef,
    isOpen: isModalOpen,
    isDialogOpen,
    open: showModal,
    onHide: onModalHide,
    title: dialog?.title,
    description: dialog?.description,
    className: dialog?.className,
    dialogOptions,
  };
};

// import { useRef, useState } from 'react';
// import useClickOutside from './useClickOutside';

// export enum EnumModalDialogOptionType {
//   RETURN = 0,
//   OTHER = 1,
// }

// export type ModalDialogOption = {
//   type?: EnumModalDialogOptionType;
//   title: string;
//   callback: () => void;
//   className?: string;
// };

// export interface IModalDialog {
//   id: number;
//   title: string;
//   description?: string;
//   className?: string;
//   dialogOptions: ModalDialogOption[];
// }

// export interface IModal {
//   modalRef: React.MutableRefObject<null>;
//   isOpen: boolean;
//   open: () => void;
//   onHide: () => void;
//   dialog: {
//     id?: number | undefined;
//     title?: string | undefined;
//     description?: string | undefined;
//     className?: string | undefined;
//     dialogOptions?: ModalDialogOption[] | undefined;
//     isDialogOpen: boolean;
//     dialogRef: React.MutableRefObject<null>;
//   };
// }
// type IUseModalDialog = (dialogType: number, dialogs: IModalDialog[]) => IModal;

// export const useModalDialog: IUseModalDialog = (dialogType, dialogs) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const modalRef = useRef(null);
//   const dialogRef = useRef(null);

//   const showModal = () => setIsModalOpen(true);

//   const onModalHide = () => setIsDialogOpen(true);

//   const onDialogHide = () => setIsDialogOpen(false);

//   const onDialogFullfill = () => {
//     setIsModalOpen(false);
//     setIsDialogOpen(false);
//   };

//   useClickOutside(modalRef, onModalHide);
//   useClickOutside(dialogRef, onDialogHide);

//   const dialog = dialogs.find((d) => d.id === dialogType);

//   if (dialog) {
//     dialog.dialogOptions.map((o) =>
//       o.type === EnumModalDialogOptionType.RETURN
//         ? {
//             ...o,
//             callback: () => {
//               o.callback();
//               onDialogHide();
//             },
//           }
//         : {
//             ...o,
//             callback: () => {
//               o.callback();
//               onDialogFullfill();
//             },
//           }
//     );
//   }
//   return {
//     modalRef,
//     isOpen: isModalOpen,
//     open: showModal,
//     onHide: onModalHide,
//     dialog: {
//       isDialogOpen,
//       dialogRef,
//       ...dialog,
//     },
//   };
// };
