import React, { ReactNode, useRef } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import useClickOutside from '../../../../hooks/useClickOutside';
import { IModal } from '../../../../hooks/useModalDialog';
import DialogModalForm from '../forms/DialogModalForm';

const Modal: React.FC<IModal & { className?: string; children?: ReactNode }> = ({
  modalRef,
  isOpen,
  className,
  isDialogOpen,
  children,
  dialog,
}) => {
  if (!isOpen) return <></>;

  return (
    <>
      {children ? (
        <>
          <div className={classNames(styles.modal, className)}>
            <div className={styles.modal__column}>
              <div className={styles.modal__content} ref={modalRef}>
                {children}
              </div>
            </div>
          </div>
          {isDialogOpen && (
            <div className={classNames(styles.modal)}>
              <div className={styles.modal__column}>
                <div className={styles.modal__content} ref={dialog.ref}>
                  <DialogModalForm title={dialog.title} description={dialog.description} options={dialog.options} />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={classNames(styles.modal)}>
          <div className={styles.modal__column}>
            <div className={styles.modal__content} ref={modalRef}>
              <DialogModalForm title={dialog.title} description={dialog.description} options={dialog.options} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
