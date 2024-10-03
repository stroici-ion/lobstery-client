import React from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';

interface IDialogModalForm {
  title: string;
  description?: string;
  options: { title: string; callback: () => void; className?: string }[];
}

const DialogModalForm: React.FC<IDialogModalForm> = ({ title, description, options }) => {
  return (
    <div className={styles.container}>
      <div className={styles.dialogModal}>
        <p className={styles.dialogModal__title}>{title}</p>
        <p className={styles.dialogModal__text}>{description}</p>
        <div className={styles.dialogModal__response}>
          {options.map((option) => (
            <button
              key={option.title}
              onClick={option.callback}
              className={classNames(styles.dialogModal__button, option.className)}
            >
              {option.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DialogModalForm;
