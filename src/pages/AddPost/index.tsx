import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import $api from '../../http';
import { IPost } from '../../models/IPost';

import styles from './styles.module.scss';

type FormType = {
  title: string;
  text: string;
};

const AddPost: React.FC = () => {
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<File>();
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit } = useForm<FormType>();

  const handleAddFileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addFileInputRef.current?.click();
  };

  const handelOnChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setSelectedImage(selectedFile);
      const selectedFileUrl = URL.createObjectURL(selectedFile);
      setSelectedImageUrl(selectedFileUrl);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const post = await $api.post<IPost>('/api/posts/', {
      title: data.title,
      text: data.text,
      images: { caption: 'Jora', image: selectedImage },
    });

    const formData = new FormData();
    if (selectedImage) formData.set('image', selectedImage);
    formData.set('caption', 'Jora');
    formData.set('post', post.data.id + '');
    $api.post('/api/multimedia/', formData);
  });

  return (
    <div className={classNames(styles.root, 'container')}>
      <form className={classNames(styles.root__form, styles.form)} onSubmit={onSubmit}>
        <div className={styles.form__row}>
          <button onClick={handleAddFileClick} className={styles.form__button}>
            Select Image
          </button>
          <input hidden type="file" ref={addFileInputRef} onChange={handelOnChangeFile} />
          {selectedImageUrl.length > 0 && (
            <img className={styles.form__preview} src={selectedImageUrl} />
          )}
        </div>
        <input {...register('title')} className={styles.form__input} placeholder="Product title" />
        <input {...register('text')} className={styles.form__input} placeholder="Product text" />
        <button type="submit" className={styles.form__button}>
          Create Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
