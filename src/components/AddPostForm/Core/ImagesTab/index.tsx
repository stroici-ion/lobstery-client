import { getMetadata, getThumbnails } from 'video-metadata-thumbnails';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getImageSize } from 'react-image-size';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { EnumModalDialogOptionType, useModalDialog } from '../../../../hooks/useModalDialog';
import {
  addImages,
  removeImage,
  setActiveImageId,
  setImages,
  updatedEditedImage,
} from '../../../../redux/images/slice';
import { AddImageVideoSvg, CloseSvg, EditSvg, TagPeopleSvg, ToFrontSvg } from '../../../../icons';
import { selectActiveImage, selectImages } from '../../../../redux/images/selectors';
import { getFileExtension, checkIsVideoFile } from '../../../../utils/filesTypes';
import { dirtyFormWarningDialog } from '../../../UI/modals/dialog-options';
import ImageEditor2 from '../../../media/ImageEditor';
import DeleteSvg from '../../../../icons/DeleteSvg';
import { useAppDispatch } from '../../../../redux';
import { convertToWebP } from './convertFunction';
import HighlightContextMenu from '../../../UI/HighlightContextMenu';
import ImageGrid from '../../../media/ImageGrid';
import ScrollArea from '../../../UI/ScrollArea';
import Modal from '../../../UI/modals/Modal';
import styles from './styles.module.scss';
import { getOrderedGrid } from '../../../media/ImageGrid/core/getOrderedGrid';
import { setImagesLayout } from '../../../../redux/posts/slice';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { IImage } from '../../../../redux/images/types';
import modalBtnStyles from '../../../../styles/components/buttons/solidLightButtons.module.scss';
import btnStyles from '../../../../styles/components/buttons/buttons.module.scss';
import { v4 } from 'uuid';
import VideoEditor from '../../../media/VideoEditor';

const ImagesTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const images = useSelector(selectImages);
  const post = useSelector(selectActivePost);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeImage = useSelector(selectActiveImage);

  const [contextRef, setContextRef] = useState<HTMLElement>();
  const [isActiveImageModified, setIsActiveImageModified] = useState(false);

  const getVideoPreviewImage = async (file: File) => {
    const metadata = await getMetadata(file);
    const thumbnail = (
      await getThumbnails(file, {
        quality: 1,
        start: Math.floor(metadata.duration / 3),
        end: Math.floor(metadata.duration / 3),
      })
    )[0];

    return thumbnail.blob;
  };

  const getSelectedFiles = async (acceptedFiles: File[]) => {
    const currentlyAddedImages: IImage[] = [];
    for await (const acceptedFile of acceptedFiles) {
      if (acceptedFile) {
        try {
          let imageUrl;
          let video = '';
          const fileName = v4();
          const isVideoFile = acceptedFile.type.startsWith('video/');
          if (isVideoFile) {
            video = URL.createObjectURL(acceptedFile);
            const videoPreviewImageBlob = await getVideoPreviewImage(acceptedFile);
            if (videoPreviewImageBlob) {
              const file = new File([videoPreviewImageBlob], fileName + '.webp', { type: 'image/webp' });
              const previewImageWEBPBlob = await convertToWebP(file, 1200, 1200, 0.8);
              imageUrl = URL.createObjectURL(previewImageWEBPBlob);
            } else throw new Error('Failed to obtain image thumbnail');
          } else {
            const previewImageWEBPBlob = await convertToWebP(acceptedFile, 1200, 1200, 0.8);
            imageUrl = URL.createObjectURL(previewImageWEBPBlob);
          }

          let thumbnailHeight = 1,
            thumbnailWidth = 1,
            aspectRatio = 1;

          await getImageSize(imageUrl).then(({ width, height }) => {
            thumbnailHeight = height;
            thumbnailWidth = width;
            aspectRatio = width / height;
          });

          const id = +(Math.random() + '').slice(2, 5) * -1;
          currentlyAddedImages.push({
            id,
            orderId: id,
            image: imageUrl,
            imageThumbnail: imageUrl,
            uploadProgress: 0,
            caption: '',
            video,
            isVideoFile,
            videoExtension: '',
            thumbnailHeight,
            thumbnailWidth,
            aspectRatio,
            isUpdated: true,
          });
        } catch (error) {
          console.error('Error converting image:', error);
        }
      }
    }
    dispatch(addImages(currentlyAddedImages));
  };

  useEffect(() => {
    if (images.length) {
      dispatch(setImagesLayout(getOrderedGrid(images, 'bottom')));
    } else dispatch(setImagesLayout(undefined));
  }, [images]);

  const handleOnChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) getSelectedFiles(Array.from(e.target.files));
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    getSelectedFiles(acceptedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dropZoneProps =
    images.length > 0
      ? {
          onClick: (event: React.MouseEvent) => images.length > 0 && event.stopPropagation(),
        }
      : {};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleMakeImageMain = () => {
    if (activeImage) {
      dispatch(setImages([activeImage, ...images.filter((i) => i.id !== activeImage.id)]));
      setContextRef(undefined);
    }
  };

  const handleSelectImage = (id: number, ref?: HTMLElement) => {
    const img = images.find((i) => i.id === id);

    if (img) {
      dispatch(setActiveImageId(id));
      setContextRef(ref);
    }
  };

  const handleRemoveImage = () => {
    if (activeImage) {
      dispatch(removeImage(activeImage));
      dispatch(setActiveImageId(undefined));
      setContextRef(undefined);
    }
  };

  const modal = useModalDialog();

  const handleEditImage = () => {
    if (activeImage) {
      setContextRef(undefined);
      modal.open();
    }
  };

  const handleHideModal = () => {
    if (isActiveImageModified) modal.dialog.setDialogParams(dirtyFormWarningDialog, true);
    else modal.forceHide();
  };

  const updateVideoThumbnail = (image: IImage) => {
    dispatch(updatedEditedImage(image));
  };

  const handleSaveEditedImage = (image: IImage) => {
    const dialogParams = {
      title: 'Save Image!',
      description: 'Save as - to keep the original image',
      options: [
        {
          type: EnumModalDialogOptionType.RETURN,
          title: 'Cancel',
          callback: () => {},
          className: modalBtnStyles.redLight,
        },
        {
          type: EnumModalDialogOptionType.OTHER,
          title: 'Save',
          callback: () => {
            dispatch(updatedEditedImage(image));
          },
          className: modalBtnStyles.orangeLight,
        },
        {
          type: EnumModalDialogOptionType.OTHER,
          title: 'Save copy',
          callback: () => {
            const id = +(Math.random() + '').slice(2, 5) * -1;
            image.id = id;
            image.orderId = id;
            dispatch(addImages([image]));
          },
          className: modalBtnStyles.greenSolid,
        },
      ],
    };

    modal.dialog.setDialogParams(dialogParams, true);
  };

  useEffect(() => {
    if (isActiveImageModified) modal.dialog.setDialogParams(undefined);
  }, [isActiveImageModified]);

  const handleSetIsActiveImageModified = (isModified: boolean) => setIsActiveImageModified(isModified);

  const handleHideContextMenu = () => setContextRef(undefined);
  const isContextVisible = contextRef && activeImage;

  return (
    <>
      {activeImage && activeImage.video && (
        <Modal {...modal}>
          <div className={styles.modal__body}>
            <button className={classNames(styles.modal__return, btnStyles.close)} onClick={modal.forceHide}>
              <CloseSvg />
            </button>
            <VideoEditor image={activeImage} onSave={updateVideoThumbnail} />
          </div>
        </Modal>
      )}
      {activeImage && !activeImage.video && (
        <Modal {...modal}>
          <div className={styles.modal__body}>
            <button className={classNames(styles.modal__return, btnStyles.close)} onClick={handleHideModal}>
              <CloseSvg />
            </button>
            <ImageEditor2
              image={activeImage}
              onSave={handleSaveEditedImage}
              setIsModified={handleSetIsActiveImageModified}
            />
          </div>
        </Modal>
      )}
      {isContextVisible && (
        <HighlightContextMenu triggerRef={contextRef} onHide={handleHideContextMenu}>
          <div className={classNames(styles.contextMenu, isContextVisible && styles.contextMenu__active)}>
            {activeImage.id !== images[0].id && (
              <button
                className={classNames(styles.contextMenu__button, styles.contextMenu__makeMain)}
                onClick={handleMakeImageMain}
              >
                <ToFrontSvg />
              </button>
            )}

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
        </HighlightContextMenu>
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
          {images.length > 0 && (
            <ScrollArea>
              <ImageGrid images={images} orderedGrid={post.imagesLayout} onSelect={handleSelectImage} />
            </ScrollArea>
          )}
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
