import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface IInputPassword {
  name: string;
  value: string;
  placeholder: string;
  type: string;
  className: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeType: (type: string) => void;
}

const InputPassword: React.FC<IInputPassword> = ({
  name,
  type,
  changeType,
  value,
  onChange,
  error,
  className,
  placeholder,
}) => {
  const passwordBoxRef = useRef<HTMLDivElement>(null);
  const onclickHandler = () => {
    type === 'password' ? changeType('text') : changeType('password');
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (passwordBoxRef.current && !passwordBoxRef.current.contains(event.target as Node)) changeType('password');
  };

  return (
    <div className={classNames(styles.inputBox, className, !!error.length && styles.error)} ref={passwordBoxRef}>
      {!!error.length && <p className={styles.inputBox__label}>{error}</p>}
      <input
        name={name}
        autoComplete={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      ></input>
      <svg
        className={classNames(styles.inputBox__svg, value.length > 0 && styles.active)}
        onClick={onclickHandler}
        width="30"
        height="24"
        viewBox="0 0 30 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="15" cy="15" r="7.5" strokeWidth="3" />
        <path
          d="M2 14.4091L2.29638 12.7745C3.42755 6.53594 8.85989 2 15.2002 2V2C21.557 2 26.9985 6.55894 28.1118 12.8175L28.5 15"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default InputPassword;
