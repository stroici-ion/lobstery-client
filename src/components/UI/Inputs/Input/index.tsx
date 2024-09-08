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

const Input: React.FC<IInput> = ({ type, name, value, onChange, error, className, placeholder }) => {
  return (
    <div className={classNames(styles.inputBox, className)}>
      {!error && <span className={styles.inputBox__label}>{error}</span>}
      <input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
};

Input.defaultProps = {
  name: '',
  value: '',
  placeholder: '',
  type: '',
  className: '',
  error: '',
  onChange: () => {},
};

export default Input;
