import classNames from 'classnames';
import React from 'react';

import styles from './styles.module.scss';
import RippleButton from '../../UI/buttons/RippleButton';

interface IMenuButton {
  icon: any;
  children?: any;
  active?: boolean;
  onClick: any;
  className?: string;
  collapsed?: boolean;
}

const MenuButton: React.FC<IMenuButton> = ({ active = false, children, onClick, icon, collapsed, className }) => {
  return (
    <RippleButton
      onClick={onClick}
      className={classNames(styles.root, className, active && styles.active, collapsed && styles.collapsed)}
    >
      {icon()}
      {children}
    </RippleButton>
  );
};

export default MenuButton;
