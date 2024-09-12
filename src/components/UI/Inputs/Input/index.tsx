import React from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface IInput {
  name: string;
  value: string;
  placeholder: string;
  type: string;
  className: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<IInput> = ({ value, onChange, error, className, type, name, placeholder }) => {
  return (
    <div className={classNames(styles.inputBox, className, !!error.length && styles.error)}>
      {!!error.length && <p className={styles.inputBox__label}>{error}</p>}
      <input name={name} autoComplete={name} type={type} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
};

export default Input;
