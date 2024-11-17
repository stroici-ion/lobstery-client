import React from 'react';

import styles from './styles.module.scss';
import WriteText from '../../../WriteText';
import SelectedUsers from '../../../SelectedUsers';
import { IUser } from '../../../../redux/profile/types';
import { useAppDispatch } from '../../../../redux';
import { removeImageTaggedFriend, setImageCaption, setImageEditOperationType } from '../../../../redux/images/slice';
import { useSelector } from 'react-redux';
import { selectImageEditOperationType } from '../../../../redux/images/selectors';
import { CropSvg } from '../../../../icons/imageEditor';
import { EImageEditOperations, IImage } from '../../../../redux/images/types';

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
    dispatch(setImageEditOperationType(EImageEditOperations.CROP));
  };

  return (
    <>
      <button className={styles.properties__button} onClick={onChangeImageEditOperationType}>
        <CropSvg />
        Crop Image
      </button>
      <div className={styles.properties__taggedFriends}>
        <p>Tagged friends :</p>
        <p className={styles.properties__taggedFriendCount}>{activeImage.taggedFriends?.length || 0}</p>
      </div>
      <div className={styles.properties__selectedUsers}>
        <SelectedUsers users={activeImage.taggedFriends?.map((obj) => obj.user)} onRemove={handleRemoveFriend} />
      </div>
      <p className={styles.properties__hr} />
      <WriteText value={activeImage.caption} setValue={onChangeImageCaption} />
    </>
  );
};

export default ImageToolBar;
