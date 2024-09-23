// import React from 'react';

// import classNames from 'classnames';

// interface IModal {
//   children: JSX.Element;
//   onHide: () => void;
//   fullSize?: boolean;
// }

// const Modal: React.FC<IModal> = ({ children, onHide, fullSize = false }) => {
//   return (
//     <div className={classNames(styles.root, fullSize && styles.fullSize)}>
//       <div className={styles.root__column}>{children}</div>
//       <div className={styles.root__back} onMouseDown={onHide}></div>
//     </div>
//   );
// };

// export default Modal;

import React from 'react';
import classNames from 'classnames';

import { useModal } from '../../../hooks/useModal';
import styles from './styles.module.scss';

interface ModalProps {
  isOpen: boolean;
  onHide: () => void;
  className?: string;
  children: (onHide: () => void) => React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onHide, className, children }) => {
  const { modalRef, isVisible, closeModal } = useModal({ isOpen, onHide });

  if (!isVisible) return null;

  return (
    <div className={classNames(styles.modal, className)}>
      <div className={styles.modal__column}>
        <div className={styles.modal__content} ref={modalRef}>
          {children(closeModal)}
        </div>
      </div>
    </div>
  );
};

export default Modal;
