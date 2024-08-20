import classNames from 'classnames';
import React from 'react';

import styles from './styles.module.scss';

interface IMenuButton {
  icon: any;
  children?: any;
  active?: boolean;
  onClick: any;
  className?: string;
}

const MenuButton: React.FC<IMenuButton> = ({
  active = false,
  children,
  onClick,
  icon,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(styles.root, active && styles.active, className)}
    >
      {icon()}
      {children}
    </button>
  );
};

export default MenuButton;
