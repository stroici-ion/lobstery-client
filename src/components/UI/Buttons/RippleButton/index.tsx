import classNames from 'classnames';
import React, { FC } from 'react';

import styles from './styles.module.scss';

interface IRippleButton {
  children?: any;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

const RippleButton: FC<IRippleButton> = ({ children, className, triggerRef, onClick }) => {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    const ripple = document.createElement('span');

    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add(styles.ripple);

    button.prepend(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });

    if (onClick) onClick(e);
  };
  return (
    <button ref={triggerRef} onClick={handleOnClick} className={classNames(styles.button, className)}>
      <div className={styles.button__body}>{children}</div>
    </button>
  );
};

export default RippleButton;
