import React, { ReactNode, useRef } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import useClickOutside from '../../../../hooks/useClickOutside';
import { IModal } from '../../../../hooks/useModalDialog';
import DialogModalForm from '../forms/DialogModalForm';

const Modal: React.FC<IModal & { className?: string; children: ReactNode }> = ({
  modalRef,
  dialogRef,
  isOpen,
  onHide,
  className,
  isDialogOpen,
  children,
  dialogOptions,
  title,
  description,
}) => {
  if (!isOpen) return <></>;

  return (
    <>
      <div className={classNames(styles.modal, className)}>
        <div className={styles.modal__column}>
          <div className={styles.modal__content} ref={modalRef}>
            {children}
          </div>
        </div>
      </div>
      {isDialogOpen && title && (
        <div className={classNames(styles.modal)}>
          <div className={styles.modal__column}>
            <div className={styles.modal__content} ref={dialogRef}>
              <DialogModalForm title={title} description={description} options={dialogOptions} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
