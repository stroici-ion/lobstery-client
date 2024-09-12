import React, { useEffect, useRef, useState } from 'react';

import styles from './styles.module.scss';
import { IImage } from '../../../../models/IImage';
import { IUser } from '../../../../models/IUser';
import { useAppDispatch } from '../../../../redux';
import { addImageTaggedFriend } from '../../../../redux/images/slice';
import classNames from 'classnames';
import SearchFirends from '../../../SearchFriends';
import UserImage from '../../../UserImage';

interface IImageTagFriends {
  activeImage: IImage;
}

type BoundsSize = {
  image: { width: number; height: number };
  block: { width: number; height: number };
};

const ImageTagFriends: React.FC<IImageTagFriends> = ({ activeImage }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const imageBloclRef = useRef<HTMLImageElement>(null);
  const dispatch = useAppDispatch();
  const [isSelectionVisible, setIsSelectionVisible] = useState(false);
  const [selectionLocation, setSelectionLoacation] = useState<{
    left: string;
    top: string;
  }>({
    left: '0',
    top: '0',
  });

  const selectedLocation = useRef<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const [boundsSize, setBoundsSize] = useState<BoundsSize>({
    image: { width: 0, height: 0 },
    block: { width: 0, height: 0 },
  });

  const setSizeRefeences = () => {
    if (imageRef.current && imageBloclRef.current) {
      const boundsImage = imageRef.current.getBoundingClientRect();
      const boundsBlock = imageBloclRef.current.getBoundingClientRect();
      setBoundsSize({
        image: { width: boundsImage.width, height: boundsImage.height },
        block: { width: boundsBlock.width, height: boundsBlock.height },
      });
    }
  };

  const handleImageOnload = () => {
    setSizeRefeences();
  };

  const handleResize = () => {
    setSizeRefeences();
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddFriend = (friend: IUser) => {
    dispatch(addImageTaggedFriend({ user: friend, ...selectedLocation.current }));
    setIsSelectionVisible(false);
  };

  const handleImageBodyClick = () => {
    setIsSelectionVisible(false);
  };

  const getLocationStyle = (top: number, left: number) => {
    if (imageRef.current && imageBloclRef.current) {
      const boundsImage = imageRef.current.getBoundingClientRect();
      const boundsBlock = imageBloclRef.current.getBoundingClientRect();

      return {
        left:
          (100 -
            ((boundsSize.image.width || boundsImage.width) * 100) / (boundsSize.block.width || boundsBlock.width)) /
            2 +
          (left *
            (((boundsSize.image.width || boundsImage.width) * 100) / (boundsSize.block.width || boundsBlock.width))) /
            100 +
          '%',
        top:
          (100 -
            ((boundsSize.image.height || boundsImage.height) * 100) / (boundsSize.block.height || boundsBlock.height)) /
            2 +
          (top *
            (((boundsSize.image.height || boundsImage.height) * 100) /
              (boundsSize.block.height || boundsBlock.height))) /
            100 +
          '%',
      };
    }
  };

  const handleMouseClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (imageBloclRef.current && imageRef.current) {
      const boundsImage = imageRef.current.getBoundingClientRect();
      const left = ((e.clientX - boundsImage.left) * 100) / boundsImage.width;
      const top = ((e.clientY - boundsImage.top) * 100) / boundsImage.height;
      setIsSelectionVisible(true);
      selectedLocation.current = { top, left };
      setSelectionLoacation(getLocationStyle(top, left) || { left: '0', top: '0' });
    }
  };

  return (
    <div className={styles.mainImage} ref={imageBloclRef} onClick={handleImageBodyClick}>
      <img
        className={styles.mainImage__image}
        src={activeImage.image}
        ref={imageRef}
        onClick={handleMouseClick}
        onLoad={handleImageOnload}
      />
      {activeImage.tagged_friends?.map((tUser) => (
        <div
          key={tUser.user.id}
          style={getLocationStyle(tUser.top, tUser.left)}
          className={classNames(styles.mainImage__taggedFriend, styles.taggedFriend, tUser.top > 90 && styles.reverse)}
        >
          <div className={styles.taggedFriend__row}>
            <UserImage user={tUser.user} className={styles.taggedFriend__avatar} />
            <p className={styles.taggedFriend__name}>{tUser.user.first_name + ' ' + tUser.user.last_name}</p>
          </div>
          <div className={styles.taggedFriend__decoration}></div>
        </div>
      ))}
      <div
        className={classNames(styles.selection, isSelectionVisible && styles.visible)}
        style={{
          top: selectionLocation.top,
          left: selectionLocation.left,
        }}
      >
        <div className={styles.selection__selectArea}></div>
        <div
          className={classNames(
            styles.selection__search,
            100 - Number(selectionLocation.top.replace('%', '')) < 35 && styles.above
          )}
        >
          <SearchFirends
            taggedFriends={activeImage.tagged_friends?.map((obj) => obj.user)}
            onSelect={handleAddFriend}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageTagFriends;
