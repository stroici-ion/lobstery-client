import React, { useEffect, useState } from 'react';
import { Outlet, useActionData, useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { CloseSvg, TagPeopleSvg } from '../../../icons';
import ImagesPreview from '../../ImagesPreview';
import { useSelector } from 'react-redux';
import { selectActiveImage, selectImages } from '../../../redux/images/selectors';
import { IImage } from '../../../models/IImage';
import { useAppDispatch } from '../../../redux';
import { setActiveImage, setActiveImageId } from '../../../redux/images/slice';
import { CropSvg } from '../../../icons/imageEditor';
import { cleanUpString } from '../../../utils/cleanUpString';
import ScrollArea from '../../UI/ScrollArea';

interface IAddPostForm {
  onHide: () => void;
}

const EditImages: React.FC<IAddPostForm> = ({ onHide }) => {
  const navigate = useNavigate();
  const images = useSelector(selectImages);
  const activeImage = useSelector(selectActiveImage);
  const dispatch = useAppDispatch();

  const handleHide = () => onHide();
  const handleSelectImage = (image: IImage) => dispatch(setActiveImageId(image.id));
  const onChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const caption = cleanUpString(e.target.value);
    if (activeImage) dispatch(setActiveImage({ ...activeImage, caption }));
  };

  return (
    <div className={styles.root}>
      <button className={styles.root__return} onClick={handleHide}>
        <CloseSvg />
      </button>
      <div className={classNames(styles.root__body, styles.body)}>
        <div className={styles.body__grid}>
          <ImagesPreview images={images} onSelect={handleSelectImage} />
        </div>
      </div>
      <div className={classNames(styles.root__aside, styles.aside)}>
        <div className={styles.aside__preview}>
          <img src={activeImage?.image_thumbnail} />
        </div>
        <div className={styles.aside__body}>
          <div className={styles.aside__tools}>
            <button className={classNames(styles.aside__button, styles.aside__button_crop)}>
              <CropSvg />
              Edit
            </button>
            <button className={styles.aside__button}>
              <TagPeopleSvg />
              Mention peoples
            </button>
          </div>
          <div className={styles.aside__text}>
            <ScrollArea>
              <TextareaAutosize
                value={activeImage?.caption}
                onChange={onChangeTitle}
                className={styles.aside__title}
                placeholder='Add a description to this image'
              />
            </ScrollArea>
          </div>
        </div>
      </div>
      {/* <Outlet /> */}
    </div>
  );
};

export default EditImages;
