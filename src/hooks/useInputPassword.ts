import React, { useEffect, useRef, useState } from 'react';

export default function useInputPassword(name = '', placeholder = 'Password') {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [type, setType] = useState('password');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError('');
  };

  const changeType = (type: string) => {
    setType(type);
  };

  return { value, error, onChange, setError, type, changeType, placeholder, name };
}
