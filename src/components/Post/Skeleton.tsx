import React from 'react';

import styles from './styles.module.scss';

export const PostSkeleton: React.FC = ({}) => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeleton__body}>
        <div className={styles.skeleton__avatar}></div>
        <div className={styles.skeleton__content}>
          <p className={styles.skeleton__fullName}></p>
          <p className={styles.skeleton__date}></p>
        </div>
      </div>
      <h2 className={styles.skeleton__title}></h2>
      <div className={styles.skeleton__image} />
      <p className={styles.skeleton__tags}></p>
      <div className={styles.skeleton__bottom}></div>
    </div>
  );
};
