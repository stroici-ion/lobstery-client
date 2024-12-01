import React, { useEffect, useRef, useState } from 'react';
import { getMetadata, getThumbnails } from 'video-metadata-thumbnails';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { IImage, IThumbnail } from '../../../redux/images/types';
import VideoTimeSelector from './core/VideoTimeSelector';
import Loader from '../../Loader';
import Modal from '../../UI/modals/Modal';
import { EnumModalDialogOptionType, useModalDialog } from '../../../hooks/useModalDialog';
import btnStyles from '../../../styles/components/buttons/buttons.module.scss';
import { CheckedSvg, CloseSvg, EditSvg, UploadSvg } from '../../../icons';
import ImageEditor2 from '../ImageEditor';
import modalBtnStyles from '../../../styles/components/buttons/solidLightButtons.module.scss';
import { dirtyFormWarningDialog } from '../../UI/modals/dialog-options';
import { useAppDispatch } from '../../../redux';
import { setImageThumbnails } from '../../../redux/images/slice';
import { useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { convertToWebP } from '../../AddPostForm/Core/ImagesTab/convertFunction';
import { getImageSize } from 'react-image-size';

interface IVideoEditor {
  image: IImage;
  onSave: (image: IImage) => void;
}

const VideoEditor: React.FC<IVideoEditor> = ({ image, onSave }) => {
  const [imageToEdit, setImageToEdit] = useState<IImage>(image);
  const [allThumbnails, setAllThumbnails] = useState<IThumbnail[]>([]);
  const [selectedThumbnails, setSelectedThumbnails] = useState<IThumbnail[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<IThumbnail>({ url: image.image, time: -1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectedThumbnailLoading, setIsSelectedThumbnailLoading] = useState(false);
  const [isActiveImageModified, setIsActiveImageModified] = useState(false);
  const dispatch = useAppDispatch();
  const fileRef = useRef<File>();
  const isModified = useRef(false);
  const refValues = useRef<{ t: IThumbnail[]; url: string }>({ t: [], url: '' });

  const getVideoThumbnails = async () => {
    if (image.video) {
      const videoFile = await fetch(image.video);
      const videoBlob = await videoFile.blob();
      fileRef.current = new File([videoBlob], 'video/mp4');
      if (!image.thumbnails) {
        const metadata = await getMetadata(fileRef.current);
        const thmbs = await getThumbnails(fileRef.current, {
          quality: 0.1,
          start: 0,
          end: metadata.duration,
          interval: 1,
        });

        const thumbnailsUrls: IThumbnail[] = [];

        thmbs.forEach((thmb) => {
          if (thmb.blob) {
            const url = URL.createObjectURL(thmb.blob);
            thumbnailsUrls.push({ url, time: thmb.currentTime });
          }
        });
        dispatch(setImageThumbnails({ thumbnails: thumbnailsUrls, id: image.id }));
        setAllThumbnails(thumbnailsUrls);
        refValues.current.t = thumbnailsUrls;
        setIsLoading(false);
      } else {
        setAllThumbnails(image.thumbnails);
        refValues.current.t = image.thumbnails;
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getVideoThumbnails();

    return () => {
      if (isModified.current) {
        const newImage = {
          ...image,
          image: refValues.current.url,
          imageThumbnail: refValues.current.url,
          thumbnails: refValues.current.t,
        };
        onSave(newImage);
      }
    };
  }, []);

  const selectThumbnail = async (thumbnail: IThumbnail) => {
    if (!fileRef.current) return;
    setIsSelectedThumbnailLoading(true);
    const thmb = (
      await getThumbnails(fileRef.current, {
        quality: 1,
        start: thumbnail.time,
        end: thumbnail.time,
      })
    )[0];
    if (thmb.blob) {
      const url = URL.createObjectURL(thmb.blob);
      setSelectedThumbnail({ url, time: -1 });
      refValues.current.url = url;
      isModified.current = true;
      setIsSelectedThumbnailLoading(false);
    }
  };

  const modal = useModalDialog();

  const handleHideModal = () => {
    if (isActiveImageModified) modal.dialog.setDialogParams(dirtyFormWarningDialog, true);
    else modal.forceHide();
  };

  const handleSaveEditedImage = (editedImage: IImage) => {
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
            const newThumbnail = { url: editedImage.image, time: -1 };
            setSelectedThumbnail({ url: editedImage.image, time: -1 });
            setAllThumbnails([newThumbnail, ...allThumbnails]);
            refValues.current.t = [newThumbnail, ...allThumbnails];
            isModified.current = true;
            refValues.current.url = editedImage.image;
          },
          className: modalBtnStyles.greenSolid,
        },
      ],
    };

    modal.dialog.setDialogParams(dialogParams, true);
  };

  const handleSetIsActiveImageModified = (isModified: boolean) => setIsActiveImageModified(isModified);

  const handleEditImage = () => {
    setImageToEdit({ ...image, image: selectedThumbnail.url });
    modal.open();
  };

  const getSelectedFiles = async (acceptedFiles: File[]) => {
    const acceptedFile = acceptedFiles[0];
    try {
      let imageUrl;
      const previewImageWEBPBlob = await convertToWebP(acceptedFile, 1200, 1200, 0.8);
      imageUrl = URL.createObjectURL(previewImageWEBPBlob);

      let thumbnailHeight = 1,
        thumbnailWidth = 1,
        aspectRatio = 1;

      await getImageSize(imageUrl).then(({ width, height }) => {
        thumbnailHeight = height;
        thumbnailWidth = width;
        aspectRatio = width / height;
      });

      const id = +(Math.random() + '').slice(2, 5) * -1;
      const newImage = {
        id,
        orderId: id,
        image: imageUrl,
        imageThumbnail: imageUrl,
        uploadProgress: 0,
        caption: '',
        video: '',
        isVideoFile: false,
        videoExtension: '',
        thumbnailHeight,
        thumbnailWidth,
        aspectRatio,
        isUpdated: true,
      };

      setImageToEdit(newImage);
      modal.open();
    } catch (error) {
      console.error('Error converting image:', error);
    }
  };
  const handleOnChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) getSelectedFiles(Array.from(e.target.files));
  };
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {imageToEdit && (
        <Modal {...modal}>
          <div className={styles.modal__body}>
            <button className={classNames(styles.modal__return, btnStyles.close)} onClick={handleHideModal}>
              <CloseSvg />
            </button>
            <ImageEditor2
              originalAspectRatio={image.aspectRatio}
              image={imageToEdit}
              onSave={handleSaveEditedImage}
              setIsModified={handleSetIsActiveImageModified}
            />
          </div>
        </Modal>
      )}
      <div className={styles.root}>
        <p className={styles.root__title}>Pick up a thumbnail from video</p>
        <div
          className={styles.root__thumbnail}
          style={{ background: `url(${selectedThumbnail.url}) center/contain no-repeat` }}
        >
          <div className={styles.root__tools}>
            <button className={classNames(styles.root__button, btnStyles.green)} onClick={handleEditImage}>
              <EditSvg />
            </button>
            <button
              className={classNames(styles.root__button, btnStyles.yellow)}
              onClick={() => inputRef.current?.click()}
            >
              <UploadSvg />
              <input
                ref={inputRef}
                type={'file'}
                style={{ display: 'none' }}
                onChange={handleOnChangeImage}
                multiple
                accept="image/*, video/*"
              />
            </button>
          </div>
          {isSelectedThumbnailLoading && <Loader className={styles.root__loader} size={100} />}
        </div>
        {!isLoading ? (
          <>
            <div className={styles.root__thumbnails}>
              {selectedThumbnails.map((thmb) => (
                <img key={thmb.time} src={thmb.url} alt="No thumbnail" onClick={() => selectThumbnail(thmb)} />
              ))}
            </div>
            <VideoTimeSelector
              thumbnails={allThumbnails}
              aspectRatio={image.aspectRatio}
              setSelectedThumbnails={setSelectedThumbnails}
            />
          </>
        ) : (
          <Loader size={160} />
        )}
      </div>
    </>
  );
};

export default VideoEditor;
