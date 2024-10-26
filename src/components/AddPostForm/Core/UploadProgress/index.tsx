import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import toast from 'react-hot-toast';
import 'react-circular-progressbar/dist/styles.css';

import styles from './styles.module.scss';
import { selectActivePost, selectPostCreateStatus } from '../../../../redux/posts/selectors';
import { selectImages } from '../../../../redux/images/selectors';
import { FetchStatusEnum } from '../../../../models/response/FetchStatus';
import fulfilleAnimationGif from '../../../../assets/posts/checked.svg';
import { FulfilledSvgAnim } from '../../../../icons';

interface IUploadProgress {
  handleError: () => void;
  handleFullfilled: () => void;
}

const UploadProgress: React.FC<IUploadProgress> = ({ handleError, handleFullfilled }) => {
  const post = useSelector(selectActivePost);
  const images = useSelector(selectImages);
  const fetchStatus = useSelector(selectPostCreateStatus);

  const uploadImages = images.filter(
    (image) =>
      !post.fetched_images_id.includes(image.id) || (post.fetched_images_id.includes(image.id) && image.isUpdated)
  );

  const totalProgress =
    fetchStatus.progress + uploadImages.reduce((sum, image) => sum + (image.upload_progress || 0), 0);

  const newImages = images.filter((image) => image.id < 0);
  const updatedImages = images.filter((image) => image.isUpdated && image.id >= 0);

  const maxProgress = 100 + (newImages.length + updatedImages.length) * 100;
  const percentage = Math.floor((totalProgress / maxProgress) * 100);
  console.log('totalProgress', totalProgress, ' maxProgress', maxProgress);

  const color = `rgb(${210 - (percentage * 74) / 100}, ${83 + (percentage * 109) / 100}, ${
    36 + (percentage * 36) / 100
  })`;

  useEffect(() => {
    if (fetchStatus.status === FetchStatusEnum.SUCCESS) {
      setTimeout(() => handleFullfilled(), 600);
    }
    if (fetchStatus.status === FetchStatusEnum.ERROR && fetchStatus.errors) {
      toast.error(fetchStatus.errors.message);
      handleError();
    }
  }, [fetchStatus]);

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
      {/* <div className={styles.root__images}>
        {uploadImages.map((image) => (
          <div
            key={image.image}
            className={classNames(
              styles.root__imageBlock,
              image.upload_progress === 100 && styles.uploaded,
              image.upload_progress === 0 && styles.pending
            )}
          >
            <img className={styles.root__image} src={image.image} alt="" />
            <div className={styles.root__progressBarBlock}>
              <div
                style={{ width: image.upload_progress + '%' }}
                className={styles.root__progressBar}
              />
            </div>
            <p
              className={classNames(
                styles.root__imageProgress,
                image.upload_progress === 0 && styles.pending
              )}
            >
              {image.upload_progress ? `${image.upload_progress} %` : 'Pending'}
            </p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default UploadProgress;
