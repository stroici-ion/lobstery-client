import React, { useState } from 'react';

import $api from '../../http';
import styles from './styles.module.scss';

const UserSettings: React.FC = () => {
  const [avatar, setAvatar] = useState<File>();
  const [cover, setCover] = useState<File>();
  const [firstName, setFirstName] = useState<string>('');

  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(e.target.files?.[0]);
  };
  const handleChangeCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCover(e.target.files?.[0]);
  };

  const handleSave = () => {
    const fromData = new FormData();
    avatar && fromData.set('avatar', avatar);
    cover && fromData.set('cover', cover);
    $api.put('api/profiles/' + 2 + '/update/', { user: { firstName: firstName } });
  };

  return (
    <div className={styles.root}>
      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input type='file' onChange={handleChangeAvatar}></input>
      <input type='file' onChange={handleChangeCover}></input>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default UserSettings;
