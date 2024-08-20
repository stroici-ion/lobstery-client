import React from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';

interface IModal {
  children: JSX.Element;
  onHide: () => void;
  fullSize?: boolean;
}

const Modal: React.FC<IModal> = ({ children, onHide, fullSize = false }) => {
  return (
    <div className={classNames(styles.root, fullSize && styles.fullSize)}>
      <div className={styles.root__column}>{children}</div>
      <div className={styles.root__back} onMouseDown={onHide}></div>
    </div>
  );
};

export default Modal;
