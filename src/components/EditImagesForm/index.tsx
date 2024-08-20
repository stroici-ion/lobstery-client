import { useSelector } from 'react-redux';
import React, { Suspense, useEffect } from 'react';
import classNames from 'classnames';

import { selectActiveImage, selectActiveImageIndex, selectImageEditOperationType, selectImages } from '../../redux/images/selectors';
import { addImages, setActiveImageIndex, setImageEditOperationType } from '../../redux/images/slice';
import ImageTagFriends from './Core/ImageTagFriends';
import { ImageEditOperationsEnum } from '../../models/ImageEditOperationsEnum';
import ImageToolBar from './Core/ImageToolBar';
import { IImage } from '../../models/IImage';
import { useAppDispatch } from '../../redux';
import { ArrowDownSvg } from '../../icons';
import styles from './styles.module.scss';
import Loader from '../Loader';
const ImageEditor = React.lazy(() => import('../ImageEditor'));

interface IEditImagesForm {
  onHide?: () => void;
}

const EditImagesForm: React.FC<IEditImagesForm> = ({ onHide }) => {
  const dispatch = useAppDispatch();
  const images = useSelector(selectImages);
  const activeImage = useSelector(selectActiveImage);
  const imageEditOperationType = useSelector(selectImageEditOperationType);
  const activeIndex = useSelector(selectActiveImageIndex);

  const handleSetActiveImage = (index: number) => {
    dispatch(setActiveImageIndex(index));
  };

  const handleSelectNextImage = () => {
    dispatch(setActiveImageIndex(activeIndex + 1));
  };

  const handleSelectPreviousImage = () => {
    dispatch(setActiveImageIndex(activeIndex - 1));
  };

  const handleSaveCrop = (newImage: IImage) => {
    if (newImage && activeImage) {
      dispatch(addImages([newImage]));
      onHide?.();
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setActiveImageIndex(-1));
      dispatch(setImageEditOperationType(ImageEditOperationsEnum.TAG));
    };
  }, []);

  return (
    <div className={styles.root}>
      {activeImage && onHide && (
        <button className={classNames(styles.root__return)} onClick={onHide}>
          ✖
        </button>
      )}
      <p className={styles.root__title}>
        {imageEditOperationType === ImageEditOperationsEnum.TAG && 'Tag users'}
        {imageEditOperationType === ImageEditOperationsEnum.CROP && 'Edit Image'}
      </p>
      <div className={styles.root__body}>
        {activeImage && imageEditOperationType === ImageEditOperationsEnum.CROP && (
          <Suspense fallback={<Loader size={400} />}>
            <ImageEditor image={activeImage} onSave={handleSaveCrop} />
          </Suspense>
        )}
        {activeImage && imageEditOperationType === ImageEditOperationsEnum.TAG && (
          <>
            <div
              className={styles.root__left}
              style={{
                background: `url('${activeImage.image_thumbnail}') center/cover`,
              }}
            >
              <div className={classNames(styles.root__image, styles.image)}>
                {activeIndex > 0 && (
                  <button className={classNames(styles.image__arrow, styles.left)} onClick={handleSelectPreviousImage}>
                    <div>
                      <ArrowDownSvg />
                    </div>
                  </button>
                )}
                <ImageTagFriends activeImage={activeImage} />
                {activeIndex < images.length - 1 && (
                  <button className={classNames(styles.image__arrow, styles.right)} onClick={handleSelectNextImage}>
                    <div>
                      <ArrowDownSvg />
                    </div>
                  </button>
                )}
              </div>
              <div className={classNames(styles.root__dots, styles.dots)}>
                {images.length > 1 &&
                  images.map((image, index) => (
                    <div
                      key={image.id}
                      className={classNames(styles.dots__dot, index === activeIndex && styles.active)}
                      onClick={() => handleSetActiveImage(index)}
                    />
                  ))}
              </div>
            </div>
            {imageEditOperationType === ImageEditOperationsEnum.TAG && (
              <div className={styles.root__right}>
                <ImageToolBar activeImage={activeImage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EditImagesForm;
