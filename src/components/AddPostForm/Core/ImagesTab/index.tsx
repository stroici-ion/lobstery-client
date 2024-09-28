import { getMetadata, getThumbnails } from 'video-metadata-thumbnails';
import React, { Ref, useCallback, useRef, useState } from 'react';
import { getImageSize } from 'react-image-size';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { addImages, removeImage, setActiveImageId } from '../../../../redux/images/slice';
import { AddImageVideoSvg, CloseSvg, EditSvg, TagPeopleSvg } from '../../../../icons';
import { selectActiveImage, selectImages } from '../../../../redux/images/selectors';
import { getExtension, isVideo } from '../../../../utils/filesTypes';
import ImageEditor2 from '../../../media/ImageEditor';
import DeleteSvg from '../../../../icons/DeleteSvg';
import { useAppDispatch } from '../../../../redux';
import { IImage } from '../../../../models/IImage';
import ImagesPreview from '../../../ImagesPreview';
import ContextMenu from '../../../UI/ContextMenu';
import ScrollArea from '../../../UI/ScrollArea';
import styles from './styles.module.scss';

const ImagesTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const images = useSelector(selectImages);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeImage = useSelector(selectActiveImage);

  const [contextRef, setContextRef] = useState<HTMLElement>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getVideoPreview = async (file: File) => {
    if (isVideo(file.name)) {
      const metadata = await getMetadata(file);
      let thumbnail = (
        await getThumbnails(file, {
          quality: 1,
          start: Math.floor(metadata.duration / 2),
          end: Math.floor(metadata.duration / 2),
        })
      )[0];
      return thumbnail.blob;
    }
    return null;
  };

  const getSelectedFiles = async (acceptedFiles: File[]) => {
    const currentlyAddedImages: IImage[] = [];
    for await (const acceptedFile of acceptedFiles) {
      const acceptedFileUrl = URL.createObjectURL(acceptedFile);
      let image = '';
      let aspect_ratio = 1;
      let video = null;
      let is_video_file = false;
      let video_extension = undefined;
      let thumbnail_width = 0;
      let thumbnail_height = 0;
      if (isVideo(acceptedFile.name)) {
        const videoPreviewBlob = await getVideoPreview(acceptedFile);
        video_extension = getExtension(acceptedFile.name);
        if (videoPreviewBlob) {
          image = URL.createObjectURL(videoPreviewBlob);
          video = acceptedFileUrl;
          is_video_file = true;
        } else {
          image = '';
        }
      } else {
        image = acceptedFileUrl;
      }

      await getImageSize(image).then(({ width, height }) => {
        thumbnail_height = height;
        thumbnail_width = width;
        aspect_ratio = width / height;
      });

      currentlyAddedImages.push({
        id: Math.random() * -1,
        image_thumbnail: image,
        upload_progress: 0,
        image,
        aspect_ratio,
        caption: '',
        video,
        is_video_file,
        video_extension,
        thumbnail_width,
        thumbnail_height,
        isUpdated: true,
      });
    }
    dispatch(addImages(currentlyAddedImages));
  };

  const handleOnChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) getSelectedFiles(Array.from(e.target.files));
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    getSelectedFiles(acceptedFiles);
  }, []);

  const dropZoneProps =
    images.length > 0
      ? {
          onClick: (event: React.MouseEvent) => images.length > 0 && event.stopPropagation(),
        }
      : {};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSelectImage = (image: IImage, ref?: HTMLElement) => {
    dispatch(setActiveImageId(image.id));
    setContextRef(ref);
  };

  const handleRemoveImage = () => {
    if (activeImage) {
      dispatch(removeImage(activeImage));
      dispatch(setActiveImageId(undefined));
      setContextRef(undefined);
    }
  };

  const handleEditImage = () => {
    if (activeImage) {
      setContextRef(undefined);
      setIsModalVisible(true);
    }
  };
  const hanldeSaveEditedImage = (image: IImage) => {
    dispatch(addImages([image]));
    setIsModalVisible(false);
  };

  const handleHideContextMenu = () => setContextRef(undefined);
  const handleHideModal = () => setIsModalVisible(false);

  const isContextVisible = contextRef && activeImage;

  return (
    <>
      {activeImage && isModalVisible && (
        <div className={styles.modal__body}>
          <button className={styles.modal__return} onClick={handleHideModal}>
            <CloseSvg />
          </button>
          <ImageEditor2 image={activeImage} onSave={hanldeSaveEditedImage} />
        </div>
      )}
      {isContextVisible && (
        <ContextMenu triggerRef={contextRef} onHide={handleHideContextMenu}>
          <div className={classNames(styles.contextMenu, isContextVisible && styles.contextMenu__active)}>
            <button
              className={classNames(styles.contextMenu__button, styles.contextMenu__close)}
              onClick={handleHideContextMenu}
            >
              <CloseSvg />
            </button>
            <button
              className={classNames(styles.contextMenu__button, styles.contextMenu__delete)}
              onClick={handleRemoveImage}
            >
              <DeleteSvg />
            </button>
            <button
              className={classNames(styles.contextMenu__button, styles.contextMenu__edit)}
              onClick={handleEditImage}
            >
              <EditSvg />
            </button>
            <button className={classNames(styles.contextMenu__button, styles.contextMenu__tag)}>
              <TagPeopleSvg />
            </button>
          </div>
        </ContextMenu>
      )}
      <div className={styles.root}>
        <p className={styles.root__title}>Add images!</p>
        <div {...getRootProps()} className={styles.root__dropzone} {...dropZoneProps}>
          {(images.length === 0 || isDragActive) && (
            <div className={classNames(styles.root__placeholder, styles.placeholder, isDragActive && styles.active)}>
              <p className={styles.placeholder__drag_active_text}>Drop the files here ...</p>
              {images.length === 0 && (
                <>
                  <AddImageVideoSvg />
                  <p className={styles.placeholder__title}>Click to upload an image.</p>
                  <p className={styles.placeholder__subtitle}>Or drag and drop here.</p>
                </>
              )}
            </div>
          )}
          <ScrollArea>
            {images.length > 0 && (
              <ImagesPreview onRemove={handleRemoveImage} onSelect={handleSelectImage} images={images} />
            )}
          </ScrollArea>
          <input {...getInputProps()} accept="image/*, video/*" />
        </div>
        {images.length > 0 && (
          <div className={classNames(styles.root__tools, styles.tools)}>
            <button className={styles.tools__button} onClick={() => inputRef.current?.click()}>
              <AddImageVideoSvg />
              <input
                ref={inputRef}
                type={'file'}
                style={{ display: 'none' }}
                onChange={handleOnChangeImages}
                multiple
                accept="image/*, video/*"
              />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ImagesTab;
