import { useState } from 'react';

export default function useInput(initialValue: string, { type = 'text', placeholder = 'Text', name = '' }) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError('');
  };

  return { value, error, onChange, setError, type, placeholder, name };
}
