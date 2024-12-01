import React from 'react';
import { LineWave } from 'react-loader-spinner';

import styles from './styles.module.scss';
import classNames from 'classnames';

interface ILoader {
  height?: number;
  size?: number;
  className?: string;
}

const Loader: React.FC<ILoader> = ({ height, size = 40, className }) => {
  return (
    <div className={classNames(styles.root, className)} style={{ height: height ? height : 'auto' }}>
      <LineWave height={size} />
    </div>
  );
};

export default Loader;
