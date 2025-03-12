import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import styles from './styles.module.scss';
import { selectIsPrimaryMenuCollapsed } from '../../redux/app/selectors';

interface Container {
  children: React.ReactNode;
  content?: 'center' | 'fill';
  className?: string;
}

const Container: React.FC<Container> = ({ children, content = 'fill', className }) => {
  const isPrimaryMenuCollapsed = useSelector(selectIsPrimaryMenuCollapsed);

  return (
    <div className={classNames(styles.root, className, styles[content], isPrimaryMenuCollapsed && styles.collapsed)}>
      {children}
    </div>
  );
};

export default Container;
