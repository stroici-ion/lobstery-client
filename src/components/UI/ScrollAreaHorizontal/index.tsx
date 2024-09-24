import React from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface IScrollArea {
  className?: string;
  children: React.ReactNode;
}

const ScrollAreaHorizontal: React.FC<IScrollArea> = ({ className, children }) => {
  return (
    <div className={classNames(styles.scrollArea, className)}>
      <div className={styles.scrollArea__content}>{children}</div>
    </div>
  );
};

export default ScrollAreaHorizontal;
