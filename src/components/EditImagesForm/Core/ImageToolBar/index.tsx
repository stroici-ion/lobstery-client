import React from 'react';

import styles from './styles.module.scss';
import WriteText from '../../../WriteText';
import SelectedUsers from '../../../SelectedUsers';
import { IImage } from '../../../../models/IImage';
import { IUser } from '../../../../models/IUser';
import { useAppDispatch } from '../../../../redux';
import {
  removeImageTaggedFriend,
  setImageCaption,
  setImageEditOperationType,
} from '../../../../redux/images/slice';
import { ImageEditOperationsEnum } from '../../../../models/ImageEditOperationsEnum';
import { useSelector } from 'react-redux';
import { selectImageEditOperationType } from '../../../../redux/images/selectors';

interface IImageToolBar {
  activeImage: IImage;
}

const ImageToolBar: React.FC<IImageToolBar> = ({ activeImage }) => {
  const dispatch = useAppDispatch();
  const imageEditOperationType = useSelector(selectImageEditOperationType);

  const handleRemoveFriend = (friend: IUser) => {
    dispatch(removeImageTaggedFriend(friend.id));
  };

  const onChangeImageCaption = (value: string) => {
    dispatch(setImageCaption(value));
  };

  const onChangeImageEditOperationType = () => {
    dispatch(
      setImageEditOperationType(
        imageEditOperationType === ImageEditOperationsEnum.CROP
          ? ImageEditOperationsEnum.TAG
          : ImageEditOperationsEnum.CROP
      )
    );
  };

  return (
    <>
      <button className={styles.properties__button} onClick={onChangeImageEditOperationType}>
        {imageEditOperationType === ImageEditOperationsEnum.TAG && 'Crop Image'}
        {imageEditOperationType === ImageEditOperationsEnum.CROP && 'Tag Friends'}
      </button>
      <div className={styles.properties__taggedFriends}>
        <p>Tagged friends :</p>
        <p className={styles.properties__taggedFriendCount}>
          {activeImage.tagged_friends?.length || 0}
        </p>
      </div>
      <div className={styles.properties__selectedUsers}>
        <SelectedUsers
          taggedFriends={activeImage.tagged_friends?.map((obj) => obj.user)}
          onRemove={handleRemoveFriend}
        />
      </div>
      <p className={styles.properties__hr} />
      <WriteText value={activeImage.caption} setValue={onChangeImageCaption} />
    </>
  );
};

export default ImageToolBar;
