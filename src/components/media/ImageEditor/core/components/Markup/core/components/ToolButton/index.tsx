import React from 'react';
import classNames from 'classnames';

import { IMarkupTool } from '../../../../../../types/interfaces';
import styles from './styles.module.scss';

interface IToolButton {
  tool: IMarkupTool;
  isActive: boolean;
  onClick: () => void;
}

const ToolButton: React.FC<IToolButton> = ({ tool, isActive, onClick }) => {
  const handleButtonClick = () => {
    onClick();
  };

  return (
    <button className={classNames(styles.root, isActive && styles.active)} onClick={handleButtonClick}>
      <div className={styles.root__icon}>{tool.icon}</div>
    </button>
  );
};

export default ToolButton;
