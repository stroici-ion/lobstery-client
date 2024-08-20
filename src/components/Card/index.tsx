import React from 'react';

import styles from './styles.module.scss';

interface ICard {
  children: JSX.Element;
}

const Card: React.FC<ICard> = ({ children }) => {
  return <div className={styles.root}>{children}</div>;
};

export default Card;
