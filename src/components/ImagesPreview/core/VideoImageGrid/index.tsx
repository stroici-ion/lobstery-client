import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { PlaySvg } from '../../../../icons';

import styles from './styles.module.scss';
import { IImage } from '../../../../redux/images/types';

interface IVideoImagesGrid {
  images: IImage[];
  fullPost?: boolean;
}

enum GridTypeEnum {
  VERTICAL = 'VERTICAL',
  GRID = 'GRID',
}

enum FirstRowTypeEnum {
  SINGLE_VERTICAL = 'SINGLE_VERTICAL',
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
  firstRowImages: IImage[];
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
    return array.sort((a, b) => b.aspectRatio - a.aspectRatio);
  };

  const getImagesGrid = () => {
    if (localImages.length) {
      let gridType = GridTypeEnum.GRID;
      let firstRowImages: IImage[] = [];
      let firstRowType = FirstRowTypeEnum.NONE;
      let secondRowImages: IImage[] = [];
      const sortedImages = sortByAspectRatio([...localImages]);
      let mainImage = sortedImages.find((image) => image.aspectRatio < 1.8 && image.isVideoFile);
      if (mainImage) {
        const otherImages = sortedImages.filter((image) => image.image != mainImage?.image);
        const horizontalImages = otherImages.filter((image) => image.aspectRatio > 1.2);
        const verticalImages = otherImages.filter((image) => image.aspectRatio < 0.8);
        const squareImages = otherImages.filter((image) => image.aspectRatio <= 1.2 && image.aspectRatio >= 0.8);
        if (mainImage.aspectRatio > 1.2) {
          if (squareImages.length > 1) {
            firstRowImages = squareImages.slice(0, 2);
            firstRowType = FirstRowTypeEnum.DOUBLE_SQUARE;
            secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
          } else if (verticalImages.length > 0) {
            firstRowImages = verticalImages.slice(0, 1);
            firstRowType = FirstRowTypeEnum.SINGLE_VERTICAL;
            secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
          } else {
            secondRowImages = otherImages;
          }
        } else if (mainImage.aspectRatio <= 1.2 && mainImage.aspectRatio >= 0.8) {
          if (horizontalImages.length > 3) {
            firstRowImages = horizontalImages.slice(0, 3);
            firstRowType = FirstRowTypeEnum.ALL_HORIZONTAL;
            secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
          } else if (squareImages.length > 1) {
            firstRowImages = squareImages.slice(0, 2);
            firstRowType = FirstRowTypeEnum.DOUBLE_SQUARE;
            secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
          } else if (verticalImages.length > 1) {
            firstRowImages = verticalImages.slice(0, 2);
            firstRowType = FirstRowTypeEnum.DOUBLE_VERTICAL;
            secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
          } else if (squareImages.length > 0) {
            firstRowImages = squareImages.slice(0, 1);
            firstRowType = FirstRowTypeEnum.SINGLE_SQUARE;
            secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
          } else if (verticalImages.length > 0) {
            firstRowImages = verticalImages.slice(0, 1);
            firstRowType = FirstRowTypeEnum.SINGLE_VERTICAL;
            secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
          } else {
            secondRowImages = otherImages;
          }
        } else {
          if (verticalImages.length > 0) {
            firstRowImages = verticalImages.slice(0, 3);
            firstRowType = FirstRowTypeEnum.ALL_VERTICAL;
            secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
          } else {
            secondRowImages = otherImages;
          }
        }
      } else {
        mainImage = sortedImages[0];
        const otherImages = sortedImages.filter((image) => image.imageThumbnail !== mainImage?.imageThumbnail);
        gridType = GridTypeEnum.VERTICAL;
        firstRowImages = otherImages.slice(0, 1);
        secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
      }
      if (mainImage) {
        const newImagesGrid: ImagesGridType = {
          mainImage,
          gridType,
          firstRowImages,
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
            <img src={imagesGrid.mainImage.imageThumbnail} className={styles.root__nearVideoBlock_image} alt="" />

            {imagesGrid.firstRowImages.map((image) => (
              <img key={image.image} alt="" src={image.imageThumbnail} className={styles.root__nearVideoBlock_image} />
            ))}
          </div>
          {imagesGrid.secondRowImages.length > 0 && (
            <div className={styles.root__row}>
              <div
                className={styles.row__decorationLeft}
                style={{
                  backgroundImage: `url('${imagesGrid.secondRowImages[0].imageThumbnail}')`,
                }}
              />
              <div
                className={styles.row__decorationRight}
                style={{
                  backgroundImage: `url('${
                    imagesGrid.secondRowImages[imagesGrid.secondRowImages.length - 1].imageThumbnail
                  }')`,
                }}
              />
              {imagesGrid.secondRowImages.map((image) => (
                <div key={image.imageThumbnail} className={classNames(styles.root__imageBlock)}>
                  <img src={image.imageThumbnail} className={styles.root__imageBlock_image} alt="" />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className={classNames(styles.root__row, !imagesGrid.secondRowImages.length && styles.single)}>
            <div
              className={styles.row__decorationLeft}
              style={{ backgroundImage: `url('${imagesGrid.mainImage.imageThumbnail}')` }}
            />
            <div
              className={styles.row__decorationRight}
              style={{
                backgroundImage: `url('${
                  imagesGrid.firstRowImages[imagesGrid.firstRowImages.length - 1]?.imageThumbnail ||
                  imagesGrid.mainImage.imageThumbnail
                }')`,
              }}
            />
            <div className={classNames(styles.root__nearVideoBlock)} onClick={() => handlePlayVideo()}>
              <div
                ref={topVideoRef}
                style={{
                  top: -1,
                  position: 'absolute',
                  height: 2,
                }}
              />
              <img
                alt=""
                src={imagesGrid.mainImage.imageThumbnail}
                className={classNames(styles.root__nearVideoBlock_image, isStarted && styles.invisible)}
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
                  src={imagesGrid.firstRowImages[0].imageThumbnail}
                  className={styles.root__nearVideoBlock_image}
                />
                <div className={styles.doubleSquare__decoration}></div>
                <img
                  alt=""
                  src={imagesGrid.firstRowImages[1].imageThumbnail}
                  className={styles.root__nearVideoBlock_image}
                />
              </div>
            )}
            {imagesGrid.firstRowType === FirstRowTypeEnum.ALL_HORIZONTAL && (
              <div className={classNames(styles.root__nearVideoBlock, styles.tripleVertical)}>
                {imagesGrid.firstRowImages.map((image) => (
                  <img
                    key={image.image}
                    alt=""
                    src={image.imageThumbnail}
                    className={styles.root__nearVideoBlock_image}
                  />
                ))}
              </div>
            )}
            {imagesGrid.firstRowType !== FirstRowTypeEnum.ALL_HORIZONTAL &&
              imagesGrid.firstRowType !== FirstRowTypeEnum.DOUBLE_SQUARE && (
                <>
                  {imagesGrid.firstRowImages.map((image) => (
                    <div key={image.image} className={classNames(styles.root__nearVideoBlock)}>
                      <img alt="" src={image.imageThumbnail} className={styles.root__nearVideoBlock_image} />
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
                  backgroundImage: `url('${imagesGrid.secondRowImages[0].imageThumbnail}')`,
                }}
              />
              <div
                className={styles.row__decorationRight}
                style={{
                  backgroundImage: `url('${
                    imagesGrid.secondRowImages[imagesGrid.secondRowImages.length - 1].imageThumbnail
                  }')`,
                }}
              />
              {imagesGrid.secondRowImages.map((image) => (
                <div key={image.imageThumbnail} className={classNames(styles.root__imageBlock)}>
                  <img alt="" src={image.imageThumbnail} className={styles.root__imageBlock_image} />
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
