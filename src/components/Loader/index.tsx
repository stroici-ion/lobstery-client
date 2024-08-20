import React from 'react';
import { LineWave } from 'react-loader-spinner';

import styles from './styles.module.scss';

interface ILoader {
  height?: number;
  size?: number;
}

const Loader: React.FC<ILoader> = ({ height = 80, size = 40 }) => {
  return (
    <div className={styles.root} style={{ height }}>
      <LineWave width={size} height={size} />
    </div>
  );
};

export default Loader;
