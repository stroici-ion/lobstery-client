import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { PlaySvg } from '../../../../icons';
import { IImage } from '../../../../models/IImage';

import styles from './styles.module.scss';

interface IImagesGrid {
  images: IImage[];
  onSelect?: (image: IImage, ref?: HTMLElement) => void;
  onRemove?: (image: IImage) => void;
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

const ImagesGrid: React.FC<IImagesGrid> = ({ images, onSelect, onRemove }) => {
  const [localImages, setLocalImages] = useState<IImage[]>(images);
  const isEditable = false;
  const [isVisible, setIsVisible] = useState(false);

  const sortByAspectRatio = (array: IImage[]) => {
    return array.sort((a, b) => b.aspect_ratio - a.aspect_ratio);
  };

  // const onClickImage

  const getImagesGrid = () => {
    if (localImages.length) {
      let gridType = GridTypeEnum.GRID;
      let fristRowImages: IImage[] = [];
      let firstRowType = FirstRowTypeEnum.NONE;
      let secondRowImages: IImage[] = [];
      const sortedImages = sortByAspectRatio([...localImages]);
      let mainImage: IImage | undefined = undefined;
      mainImage = sortedImages.find((image) => image.is_video_file && image.aspect_ratio < 2.1);
      if (!mainImage) mainImage = sortedImages.find((image) => image.aspect_ratio < 2.1);

      if (mainImage) {
        const otherImages = sortedImages.filter((image) => image.image != mainImage?.image);
        const horizontalImages = otherImages.filter((image) => image.aspect_ratio > 1.2);
        const verticalImages = otherImages.filter((image) => image.aspect_ratio < 0.8);
        const squareImages = otherImages.filter((image) => image.aspect_ratio <= 1.2 && image.aspect_ratio >= 0.8);

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
          if (horizontalImages.length >= 3) {
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
            if (verticalImages.length > 0) {
              fristRowImages = [mainImage, ...squareImages.slice(0, 1)];
              mainImage = verticalImages[0];
              firstRowType = FirstRowTypeEnum.DOUBLE_SQUARE;
              secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image) && image !== mainImage);
            } else {
              fristRowImages = squareImages.slice(0, 1);
              firstRowType = FirstRowTypeEnum.SINGLE_SQUARE;
              secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
            }
          } else if (verticalImages.length > 0) {
            fristRowImages = verticalImages.slice(0, 1);
            firstRowType = FirstRowTypeEnum.SIGLE_VERTICAL;
            secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
          } else {
            secondRowImages = otherImages;
          }
        } else {
          if (squareImages.length > 0) {
            fristRowImages = squareImages.slice(0, 2);
            firstRowType = FirstRowTypeEnum.DOUBLE_SQUARE;
            secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
          } else if (horizontalImages.length >= 3) {
            fristRowImages = horizontalImages.slice(0, 3);
            firstRowType = FirstRowTypeEnum.ALL_HORIZONTAL;
            secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
          } else if (verticalImages.length > 0) {
            fristRowImages = verticalImages.slice(0, 3);
            firstRowType = FirstRowTypeEnum.ALL_VERTICAL;
            secondRowImages = otherImages.filter((image) => !fristRowImages.includes(image));
          } else {
            secondRowImages = otherImages;
          }
        }
      } else {
        mainImage = sortedImages.find((image) => image.is_video_file);
        if (!mainImage) mainImage = sortedImages[0];
        const otherImages = sortedImages.filter((image) => image.image_thumbnail != mainImage?.image_thumbnail);
        gridType = GridTypeEnum.VERTICAL;
        fristRowImages = [mainImage, ...otherImages];
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
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
    setLocalImages(images);
  }, [images]);

  useEffect(() => {
    if (localImages.length) {
      getImagesGrid();
    }
  }, [localImages]);

  const getToatalHeight = (arr: IImage[]) => {
    let sum = 0;
    arr.forEach((element) => {
      sum += 1 / element.aspect_ratio;
    });
    return sum;
  };

  if (!imagesGrid) {
    return <></>;
  }

  return (
    <div className={styles.root} style={{ display: isVisible ? 'flex' : 'none' }}>
      {imagesGrid.gridType === GridTypeEnum.VERTICAL ? (
        imagesGrid.fristRowImages.map((image) => (
          <div className={classNames(styles.root__row, styles.verticalGrid)}>
            <div className={classNames(styles.verticalGrid__imageBlock, styles.imageParent)}>
              <img
                className={styles.verticalGrid__image}
                src={image.image_thumbnail}
                onClick={(event) => {
                  onSelect?.(image, event.target as HTMLElement);
                }}
              />
              {image.is_video_file && (
                <button className={styles.videoButton}>
                  <PlaySvg />
                </button>
              )}
              {isEditable && (
                <div className={styles.imageParent__decorationRemove} onClick={() => onRemove?.(image)}>
                  🗙
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <>
          <div className={classNames(styles.root__row, !imagesGrid.secondRowImages.length && styles.single)}>
            <div
              className={styles.row__decorationLeft}
              style={{ backgroundImage: `url('${imagesGrid.mainImage.image_thumbnail}')` }}
            />
            <div
              className={styles.row__decorationRight}
              style={{
                backgroundImage: `url('${
                  imagesGrid.fristRowImages[imagesGrid.fristRowImages.length - 1]?.image_thumbnail ||
                  imagesGrid.mainImage.image_thumbnail
                }')`,
              }}
            />
            <div className={classNames(styles.root__nearVideoBlock, styles.imageParent)}>
              <img
                src={imagesGrid.mainImage.image_thumbnail}
                className={styles.root__nearVideoBlock_image}
                onClick={(event) => {
                  onSelect?.(imagesGrid.mainImage, event.target as HTMLElement);
                }}
              />
              {imagesGrid.mainImage.is_video_file && (
                <button className={styles.videoButton}>
                  <PlaySvg />
                </button>
              )}
              {isEditable && (
                <div className={styles.imageParent__decorationRemove} onClick={() => onRemove?.(imagesGrid.mainImage)}>
                  🗙
                </div>
              )}
            </div>

            {(imagesGrid.firstRowType === FirstRowTypeEnum.ALL_HORIZONTAL ||
              imagesGrid.firstRowType === FirstRowTypeEnum.DOUBLE_SQUARE) && (
              <div className={classNames(styles.tripleVertical)}>
                {imagesGrid.fristRowImages.map((image) => (
                  <div
                    key={image.image}
                    className={classNames(styles.tripleVertical__block, styles.imageParent)}
                    style={{
                      maxHeight: (400 * (1 / image.aspect_ratio)) / getToatalHeight(imagesGrid.fristRowImages),
                    }}
                  >
                    <img
                      alt=''
                      src={image.image_thumbnail}
                      className={styles.root__nearVideoBlock_image}
                      onClick={(event) => {
                        onSelect?.(image, event.target as HTMLElement);
                      }}
                    />
                    {image.is_video_file && (
                      <button className={styles.videoButton}>
                        <PlaySvg />
                      </button>
                    )}
                    {isEditable && (
                      <div className={styles.imageParent__decorationRemove} onClick={() => onRemove?.(image)}>
                        🗙
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {imagesGrid.firstRowType !== FirstRowTypeEnum.ALL_HORIZONTAL &&
              imagesGrid.firstRowType !== FirstRowTypeEnum.DOUBLE_SQUARE && (
                <>
                  {imagesGrid.fristRowImages.map((image) => (
                    <div key={image.image} className={classNames(styles.root__nearVideoBlock, styles.imageParent)}>
                      <img
                        alt=''
                        src={image.image_thumbnail}
                        className={styles.root__nearVideoBlock_image}
                        onClick={(event) => {
                          onSelect?.(image, event.target as HTMLElement);
                        }}
                      />
                      {isEditable && (
                        <div className={styles.imageParent__decorationRemove} onClick={() => onRemove?.(image)}>
                          🗙
                        </div>
                      )}
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
                    imagesGrid.secondRowImages[imagesGrid.secondRowImages.length - 1].image_thumbnail
                  }')`,
                }}
              />
              {imagesGrid.secondRowImages.map((image) => (
                <div key={image.image_thumbnail} className={classNames(styles.root__imageBlock, styles.imageParent)}>
                  <img
                    alt=''
                    src={image.image_thumbnail}
                    className={styles.root__imageBlock_image}
                    onClick={(event) => {
                      onSelect?.(image, event.target as HTMLElement);
                    }}
                  />
                  {image.is_video_file && (
                    <button className={styles.videoButton}>
                      <PlaySvg />
                    </button>
                  )}
                  {isEditable && (
                    <div className={styles.imageParent__decorationRemove} onClick={() => onRemove?.(image)}>
                      🗙
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImagesGrid;
