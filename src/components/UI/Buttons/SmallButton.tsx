import classNames from 'classnames';
import React, { FC, useRef, useState } from 'react';

import styles from './styles.module.scss';

interface ISmallButton {
  children?: any;
  className?: string;
  onClick?: () => void;
  hoverColor?: string;
}

const SmallButton: FC<ISmallButton> = ({ children, className, onClick }) => {
  const [isActive, setIsActive] = useState(false);
  const timmerRef = useRef<any>(null);

  const handleOnClick = () => {
    if (!isActive) {
      setIsActive(true);
      timmerRef.current = setTimeout(() => {
        setIsActive(false);
      }, 300);
    }
    onClick?.();
  };

  return (
    <button
      style={{}}
      onClick={handleOnClick}
      className={classNames(styles.smallButton, isActive && styles.active, className)}
    >
      <span className={styles.smallButton__wrapper}></span>
      {children}
    </button>
  );
};

export default SmallButton;
