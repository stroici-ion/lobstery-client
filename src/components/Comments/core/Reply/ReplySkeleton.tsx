import React, { useState } from 'react';
import styles from './styles.module.scss';

const ReplySkeleton: React.FC = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeleton__avatar} />
      <div className={styles.skeleton__body}>
        <div className={styles.skeleton__top}>
          <div className={styles.skeleton__name} />
          <div className={styles.skeleton__context} />
        </div>
        <div className={styles.skeleton__text} />
        <div className={styles.skeleton__likes}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default ReplySkeleton;
