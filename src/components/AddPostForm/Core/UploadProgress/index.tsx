import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import toast from 'react-hot-toast';
import 'react-circular-progressbar/dist/styles.css';

import styles from './styles.module.scss';
import { selectActivePost, selectPostCreateStatus } from '../../../../redux/posts/selectors';
import { selectImages } from '../../../../redux/images/selectors';
import { EFetchStatus } from '../../../../types/enums';
import { FulfilledSvgAnim } from '../../../../icons';
import ScrollArea from '../../../UI/ScrollArea';

interface IUploadProgress {
  handleError: () => void;
  handleFulfilled: () => void;
}

const UploadProgress: React.FC<IUploadProgress> = ({ handleError, handleFulfilled }) => {
  const post = useSelector(selectActivePost);
  const images = useSelector(selectImages);
  const fetchStatus = useSelector(selectPostCreateStatus);

  const uploadImages = images.filter(
    (image) => !post.fetchedImagesId.includes(image.id) || (post.fetchedImagesId.includes(image.id) && image.isUpdated)
  );

  const totalProgress =
    fetchStatus.progress + uploadImages.reduce((sum, image) => sum + (image.uploadProgress || 0), 0);

  const newImages = images.filter((image) => image.id < 0);
  const updatedImages = images.filter((image) => image.isUpdated && image.id >= 0);

  const maxProgress = 100 + (newImages.length + updatedImages.length) * 100;
  const percentage = Math.floor((totalProgress / maxProgress) * 100);

  const color = `rgb(${210 - (percentage * 74) / 100}, ${83 + (percentage * 109) / 100}, ${
    36 + (percentage * 36) / 100
  })`;

  useEffect(() => {
    if (fetchStatus.status === EFetchStatus.SUCCESS) {
      setTimeout(() => handleFulfilled(), 600);
    }
    if (fetchStatus.status === EFetchStatus.ERROR && fetchStatus.errors) {
      toast.error(fetchStatus.errors.message);
      handleError();
    }
  }, [fetchStatus, handleError, handleFulfilled]);

  return (
    <div className={classNames(styles.root, styles.centerContent)}>
      <div className={styles.root__top}>
        {percentage === 100 ? (
          <FulfilledSvgAnim />
        ) : (
          <CircularProgressbar
            maxValue={100}
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              trailColor: '#f3f3f3',
              pathColor: color,
              textColor: color,
            })}
          />
        )}
      </div>
      <div className={styles.root__images}>
        <ScrollArea>
          {uploadImages.map((image) => (
            <div
              key={image.id}
              className={classNames(
                styles.root__imageBlock,
                image.uploadProgress === 100 && styles.uploaded,
                image.uploadProgress === 0 && styles.pending
              )}
            >
              <div
                style={{ background: `url('${image.image}') center/contain no-repeat` }}
                className={styles.root__image}
              />
              <div className={styles.root__progress}>
                <div className={styles.root__progressBarBlock}>
                  <div style={{ width: image.uploadProgress + '%' }} className={styles.root__progressBar} />
                </div>
                <p className={classNames(styles.root__imageProgress, image.uploadProgress === 0 && styles.pending)}>
                  {image.uploadProgress ? `${image.uploadProgress} %` : 'Pending'}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default UploadProgress;
