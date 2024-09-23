import React, { useCallback, useRef } from 'react';
import { getImageSize } from 'react-image-size';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../../../redux';
import styles from './styles.module.scss';
import { AddImageVideoSvg } from '../../../../icons';
import classNames from 'classnames';
import ImagesPreview from '../../../ImagesPreview';
import { getExtension, isVideo } from '../../../../utils/filesTypes';
import { getMetadata, getThumbnails } from 'video-metadata-thumbnails';
import { IImage } from '../../../../models/IImage';
import { addImages, removeImage, setActiveImageId, setImages } from '../../../../redux/images/slice';
import { selectImages } from '../../../../redux/images/selectors';
import ScrollArea from '../../../UI/ScrollArea';

interface IImagesTab {
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}

const ImagesTab: React.FC<IImagesTab> = ({ setSelectedTab }) => {
  const dispatch = useAppDispatch();
  const images = useSelector(selectImages);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSelectImage = (image: IImage) => {
    dispatch(setImages(images));
    dispatch(setActiveImageId(image.id));
    setSelectedTab(10);
  };

  const handleRemoveImage = (image: IImage) => {
    dispatch(removeImage(image));
  };

  const dropZoneProps =
    images.length > 0
      ? {
          onClick: (event: React.MouseEvent) => images.length > 0 && event.stopPropagation(),
        }
      : {};

  return (
    <div className={styles.root}>
      <p className={styles.root__title}>Add images</p>
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
        <input {...getInputProps()} accept='image/*, video/*' />
      </div>
      {images.length > 0 && (
        <button className={styles.root__add} onClick={() => inputRef.current?.click()}>
          <AddImageVideoSvg />
          <input
            ref={inputRef}
            type={'file'}
            style={{ display: 'none' }}
            onChange={handleOnChangeImages}
            multiple
            accept='image/*, video/*'
          />
        </button>
      )}
    </div>
  );
};

export default ImagesTab;
