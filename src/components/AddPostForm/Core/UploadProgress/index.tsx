import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import styles from './styles.module.scss';
import { selectActivePost } from '../../../../redux/posts/selectors';
import { selectImages } from '../../../../redux/images/selectors';

const UploadProgress: React.FC = () => {
  const post = useSelector(selectActivePost);
  const images = useSelector(selectImages);
  const uploadImages = images.filter(
    (image) =>
      !post.fetched_images_id.includes(image.id) ||
      (post.fetched_images_id.includes(image.id) && image.isUpdated)
  );

  const { upload_progress } = useSelector(selectActivePost);
  const totalProgress =
    upload_progress + uploadImages.reduce((sum, image) => sum + (image.upload_progress || 0), 0);
  const maxProgress = 100 + uploadImages.length * 100;
  const percentage = Math.floor((totalProgress * 100) / maxProgress) || 0;

  const color = `rgb(${210 - (percentage * 74) / 100}, ${83 + (percentage * 109) / 100}, ${
    36 + (percentage * 36) / 100
  })`;

  return (
    <div className={classNames(styles.root, styles.centerContent)}>
      <div className={styles.root__top}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            trailColor: '#f3f3f3',
            pathColor: color,
            textColor: color,
          })}
        />
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
