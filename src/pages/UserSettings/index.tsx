import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import $api from '../../http';
import { selectUserId } from '../../redux/auth/selectors';

import styles from './styles.module.scss';

const UserSettings: React.FC = () => {
  const [avatar, setAvater] = useState<File>();
  const [cover, setCover] = useState<File>();
  const [firstName, setFirstName] = useState<string>('');
  const userId = useSelector(selectUserId);

  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvater(e.target.files?.[0]);
  };
  const handleChangeCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCover(e.target.files?.[0]);
  };

  const handleSave = () => {
    const fromData = new FormData();
    avatar && fromData.set('avatar', avatar);
    cover && fromData.set('cover', cover);
    $api.put('api/profiles/' + 2 + '/update/', { user: { first_name: firstName } });
  };

  return (
    <div className={styles.root}>
      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input type="file" onChange={handleChangeAvatar}></input>
      <input type="file" onChange={handleChangeCover}></input>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default UserSettings;
