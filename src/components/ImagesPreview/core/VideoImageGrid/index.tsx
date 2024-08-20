import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { PlaySvg } from '../../../../icons';
import { IImage } from '../../../../models/IImage';

import styles from './styles.module.scss';

interface IVideoImagesGrid {
  images: IImage[];
  fullPost?: boolean;
}

enum GridTypeEnum {
  VERTICAL = 'VERTICAL',
  GRID = 'GRID',
}

enum FirstRowTypeEnum {
  SIGLE_VERTICAL = 'SIGLE_VERTICAL',
  SINGLE_SQUARE = 'SINGLE_SQUARE',
  DOUBLE_VERTICAL = 'DOUBLE_VERTICAL',
  DOUBLE_SQUARE = 'DOUBLE_SQUARE',
  NONE = 'NONE',
  ALL_VERTICAL = 'ALL_VERTICAL',
  ALL_HORIZONTAL = 'ALL_HORIZONTAL',
}

type ImagesGridType = {
  gridType: GridTypeEnum;
  mainImage: IImage;
  fristRowImages: IImage[];
  firstRowType: FirstRowTypeEnum;
  secondRowImages: IImage[];
};

const VideoImagesGrid: React.FC<IVideoImagesGrid> = ({ images, fullPost = false }) => {
  const [localImages, setLocalImages] = useState<IImage[]>(images);

  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const topVideoRef = useRef<HTMLDivElement>(null);
  const bottomVideoRef = useRef<HTMLDivElement>(null);
  const [isStarted, setIsStarted] = useState(fullPost);
  const [isIntersectedTop, setIsIntersectedTop] = useState(false);
  const [isIntersectedBottom, setIsIntersectedBottom] = useState(false);

  const sortByAspectRatio = (array: IImage[]) => {
    return array.sort((a, b) => b.aspect_ratio - a.aspect_ratio);
  };

  const getImagesGrid = () => {
    if (localImages.length) {
      let gridType = GridTypeEnum.GRID;
      let fristRowImages: IImage[] = [];
      let firstRowType = FirstRowTypeEnum.NONE;
      let secondRowImages: IImage[] = [];
      const sortedImages = sortByAspectRatio([...localImages]);
      let mainImage = sortedImages.find((image) => image.aspect_ratio < 1.8 && image.is_video_file);
      if (mainImage) {
        const otherImages = sortedImages.filter((image) => image.image != mainImage?.image);
        const horizontalImages = otherImages.filter((image) => image.aspect_ratio > 1.2);
        const verticalImages = otherImages.filter((image) => image.aspect_ratio < 0.8);
        const squareImages = otherImages.filter(
          (image) => image.aspect_ratio <= 1.2 && image.aspect_ratio >= 0.8
        );
        if (mainImage.aspect_ratio > 1.2) {
          if (squareImages.length > 1) {
            fristRowImages = squareImages.slice(0, 2);
            firstRowType = FirstRowTypeEnum.DOUBLE_SQUARE;
            secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
          } else if (verticalImages.length > 0) {
            fristRowImages = verticalImages.slice(0, 1);
            firstRowType = FirstRowTypeEnum.SIGLE_VERTICAL;
            secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
          } else {
            secondRowImages = otherImages;
          }
        } else if (mainImage.aspect_ratio <= 1.2 && mainImage.aspect_ratio >= 0.8) {
          if (horizontalImages.length > 3) {
            fristRowImages = horizontalImages.slice(0, 3);
            firstRowType = FirstRowTypeEnum.ALL_HORIZONTAL;
            secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
          } else if (squareImages.length > 1) {
            fristRowImages = squareImages.slice(0, 2);
            firstRowType = FirstRowTypeEnum.DOUBLE_SQUARE;
            secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
          } else if (verticalImages.length > 1) {
            fristRowImages = verticalImages.slice(0, 2);
            firstRowType = FirstRowTypeEnum.DOUBLE_VERTICAL;
            secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
          } else if (squareImages.length > 0) {
            fristRowImages = squareImages.slice(0, 1);
            firstRowType = FirstRowTypeEnum.SINGLE_SQUARE;
            secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
          } else if (verticalImages.length > 0) {
            fristRowImages = verticalImages.slice(0, 1);
            firstRowType = FirstRowTypeEnum.SIGLE_VERTICAL;
            secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
          } else {
            secondRowImages = otherImages;
          }
        } else {
          if (verticalImages.length > 0) {
            fristRowImages = verticalImages.slice(0, 3);
            firstRowType = FirstRowTypeEnum.ALL_VERTICAL;
            secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
          } else {
            secondRowImages = otherImages;
          }
        }
      } else {
        mainImage = sortedImages[0];
        const otherImages = sortedImages.filter(
          (image) => image.image_thumbnail != mainImage?.image_thumbnail
        );
        gridType = GridTypeEnum.VERTICAL;
        fristRowImages = otherImages.slice(0, 1);
        secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
      }
      if (mainImage) {
        const newImagesGrid: ImagesGridType = {
          mainImage,
          gridType,
          fristRowImages,
          firstRowType,
          secondRowImages: secondRowImages.reverse(),
        };
        setImgaesGrid(newImagesGrid);
      }
    }
  };

  const [imagesGrid, setImgaesGrid] = useState<ImagesGridType>();

  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  useEffect(() => {
    if (localImages.length) {
      getImagesGrid();
    }
  }, [localImages]);

  const handlePauseVideo = () => {
    setIsStarted(false);
    mainVideoRef.current?.pause();
  };

  const handlePlayVideo = () => {
    setIsStarted(true);
    mainVideoRef.current?.play();
  };

  const handleVideoOnPlay = () => {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => video !== mainVideoRef.current && video.pause());
  };

  const observerTop = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        setIsIntersectedTop(false);
      } else {
        setIsIntersectedTop(true);
      }
    });
  }, {});

  const observerBottom = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        setIsIntersectedBottom(false);
      } else {
        setIsIntersectedBottom(true);
      }
    });
  }, {});

  useEffect(() => {
    if (isIntersectedBottom === true && isIntersectedTop === true) handlePlayVideo();
    else handlePauseVideo();
  }, [isIntersectedTop, isIntersectedBottom]);

  useEffect(() => {
    if (!fullPost) {
      if (topVideoRef.current) observerTop.observe(topVideoRef.current);
      if (bottomVideoRef.current) observerBottom.observe(bottomVideoRef.current);
    } else {
      setIsStarted(true);
    }
  }, []);

  if (!imagesGrid) {
    return <></>;
  }

  return (
    <div className={styles.root}>
      {imagesGrid.gridType === GridTypeEnum.VERTICAL ? (
        <>
          <div
            className={classNames(
              styles.root__row,
              styles.allVertical,
              !imagesGrid.secondRowImages.length && styles.single
            )}
          >
            <img
              src={imagesGrid.mainImage.image_thumbnail}
              className={styles.root__nearVideoBlock_image}
            />

            {imagesGrid.fristRowImages.map((image) => (
              <img
                key={image.image}
                alt=""
                src={image.image_thumbnail}
                className={styles.root__nearVideoBlock_image}
              />
            ))}
          </div>
          {imagesGrid.secondRowImages.length > 0 && (
            <div className={styles.root__row}>
              <div
                className={styles.row__decorationLeft}
                style={{
                  backgroundImage: `url('${imagesGrid.secondRowImages[0].image_thumbnail}')`,
                }}
              />
              <div
                className={styles.row__decorationRight}
                style={{
                  backgroundImage: `url('${
                    imagesGrid.secondRowImages[imagesGrid.secondRowImages.length - 1]
                      .image_thumbnail
                  }')`,
                }}
              />
              {imagesGrid.secondRowImages.map((image) => (
                <div key={image.image_thumbnail} className={classNames(styles.root__imageBlock)}>
                  <img src={image.image_thumbnail} className={styles.root__imageBlock_image} />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div
            className={classNames(
              styles.root__row,
              !imagesGrid.secondRowImages.length && styles.single
            )}
          >
            <div
              className={styles.row__decorationLeft}
              style={{ backgroundImage: `url('${imagesGrid.mainImage.image_thumbnail}')` }}
            />
            <div
              className={styles.row__decorationRight}
              style={{
                backgroundImage: `url('${
                  imagesGrid.fristRowImages[imagesGrid.fristRowImages.length - 1]
                    ?.image_thumbnail || imagesGrid.mainImage.image_thumbnail
                }')`,
              }}
            />
            <div
              className={classNames(styles.root__nearVideoBlock)}
              onClick={() => handlePlayVideo()}
            >
              <div
                ref={topVideoRef}
                style={{
                  top: -1,
                  position: 'absolute',
                  height: 2,
                }}
              />
              <img
                src={imagesGrid.mainImage.image_thumbnail}
                className={classNames(
                  styles.root__nearVideoBlock_image,
                  isStarted && styles.invisible
                )}
              />
              <button className={styles.videoButton}>
                <PlaySvg />
              </button>
              <video
                onPlay={handleVideoOnPlay}
                ref={mainVideoRef}
                className={classNames(styles.mainVideo, !isStarted && styles.invisible)}
                src={imagesGrid.mainImage.video || undefined}
                autoPlay={true}
                muted={true}
              />
              <div
                ref={bottomVideoRef}
                style={{
                  bottom: -1,
                  position: 'absolute',
                  height: 2,
                }}
              />
            </div>
            {imagesGrid.firstRowType === FirstRowTypeEnum.DOUBLE_SQUARE && (
              <div className={classNames(styles.root__nearVideoBlock, styles.doubleSquare)}>
                <img
                  alt=""
                  src={imagesGrid.fristRowImages[0].image_thumbnail}
                  className={styles.root__nearVideoBlock_image}
                />
                <div className={styles.doubleSquare__decoration}></div>
                <img
                  alt=""
                  src={imagesGrid.fristRowImages[1].image_thumbnail}
                  className={styles.root__nearVideoBlock_image}
                />
              </div>
            )}
            {imagesGrid.firstRowType === FirstRowTypeEnum.ALL_HORIZONTAL && (
              <div className={classNames(styles.root__nearVideoBlock, styles.tripleVertical)}>
                {imagesGrid.fristRowImages.map((image) => (
                  <img
                    key={image.image}
                    alt=""
                    src={image.image_thumbnail}
                    className={styles.root__nearVideoBlock_image}
                  />
                ))}
              </div>
            )}
            {imagesGrid.firstRowType !== FirstRowTypeEnum.ALL_HORIZONTAL &&
              imagesGrid.firstRowType !== FirstRowTypeEnum.DOUBLE_SQUARE && (
                <>
                  {imagesGrid.fristRowImages.map((image) => (
                    <div key={image.image} className={classNames(styles.root__nearVideoBlock)}>
                      <img
                        alt=""
                        src={image.image_thumbnail}
                        className={styles.root__nearVideoBlock_image}
                      />
                    </div>
                  ))}
                </>
              )}
          </div>
          {imagesGrid.secondRowImages.length > 0 && (
            <div className={styles.root__row}>
              <div
                className={styles.row__decorationLeft}
                style={{
                  backgroundImage: `url('${imagesGrid.secondRowImages[0].image_thumbnail}')`,
                }}
              />
              <div
                className={styles.row__decorationRight}
                style={{
                  backgroundImage: `url('${
                    imagesGrid.secondRowImages[imagesGrid.secondRowImages.length - 1]
                      .image_thumbnail
                  }')`,
                }}
              />
              {imagesGrid.secondRowImages.map((image) => (
                <div key={image.image_thumbnail} className={classNames(styles.root__imageBlock)}>
                  <img
                    alt=""
                    src={image.image_thumbnail}
                    className={styles.root__imageBlock_image}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoImagesGrid;
