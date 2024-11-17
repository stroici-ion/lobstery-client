import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { PlaySvg } from '../../../../icons';

import styles from './styles.module.scss';
import { IImage } from '../../../../redux/images/types';

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

const ImagesGrid: React.FC<IImagesGrid> = ({ images, onSelect, onRemove }) => {
  const [localImages, setLocalImages] = useState<IImage[]>(images);
  const isEditable = false;
  const [isVisible, setIsVisible] = useState(false);

  const sortByAspectRatio = (array: IImage[]) => {
    return array.sort((a, b) => b.aspectRatio - a.aspectRatio);
  };

  // const onClickImage

  const getImagesGrid = () => {
    if (localImages.length) {
      let gridType = GridTypeEnum.GRID;
      let firstRowImages: IImage[] = [];
      let firstRowType = FirstRowTypeEnum.NONE;
      let secondRowImages: IImage[] = [];
      const sortedImages = sortByAspectRatio([...localImages]);
      let mainImage: IImage | undefined = undefined;
      mainImage = sortedImages.find((image) => image.isVideoFile && image.aspectRatio < 2.1);
      if (!mainImage) mainImage = sortedImages.find((image) => image.aspectRatio < 2.1);

      if (mainImage) {
        const otherImages = sortedImages.filter((image) => image.image !== mainImage?.image);
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
          if (horizontalImages.length >= 3) {
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
            if (verticalImages.length > 0) {
              firstRowImages = [mainImage, ...squareImages.slice(0, 1)];
              mainImage = verticalImages[0];
              firstRowType = FirstRowTypeEnum.DOUBLE_SQUARE;
              secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image) && image !== mainImage);
            } else {
              firstRowImages = squareImages.slice(0, 1);
              firstRowType = FirstRowTypeEnum.SINGLE_SQUARE;
              secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
            }
          } else if (verticalImages.length > 0) {
            firstRowImages = verticalImages.slice(0, 1);
            firstRowType = FirstRowTypeEnum.SINGLE_VERTICAL;
            secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
          } else {
            secondRowImages = otherImages;
          }
        } else {
          if (squareImages.length > 0) {
            firstRowImages = squareImages.slice(0, 2);
            firstRowType = FirstRowTypeEnum.DOUBLE_SQUARE;
            secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
          } else if (horizontalImages.length >= 3) {
            firstRowImages = horizontalImages.slice(0, 3);
            firstRowType = FirstRowTypeEnum.ALL_HORIZONTAL;
            secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
          } else if (verticalImages.length > 0) {
            firstRowImages = verticalImages.slice(0, 3);
            firstRowType = FirstRowTypeEnum.ALL_VERTICAL;
            secondRowImages = otherImages.filter((image) => !firstRowImages.includes(image));
          } else {
            secondRowImages = otherImages;
          }
        }
      } else {
        mainImage = sortedImages.find((image) => image.isVideoFile);
        if (!mainImage) mainImage = sortedImages[0];
        const otherImages = sortedImages.filter((image) => image.imageThumbnail !== mainImage?.imageThumbnail);
        gridType = GridTypeEnum.VERTICAL;
        firstRowImages = [mainImage, ...otherImages];
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
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
    setLocalImages(images);
  }, [images]);

  useEffect(() => {
    if (localImages.length) {
      getImagesGrid();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localImages]);

  const getToatalHeight = (arr: IImage[]) => {
    let sum = 0;
    arr.forEach((element) => {
      sum += 1 / element.aspectRatio;
    });
    return sum;
  };

  if (!imagesGrid) {
    return <></>;
  }

  return (
    <div className={styles.root} style={{ display: isVisible ? 'flex' : 'none' }}>
      {imagesGrid.gridType === GridTypeEnum.VERTICAL ? (
        imagesGrid.firstRowImages.map((image) => (
          <div className={classNames(styles.root__row, styles.verticalGrid)}>
            <div className={classNames(styles.verticalGrid__imageBlock, styles.imageParent)}>
              <img
                className={styles.verticalGrid__image}
                src={image.imageThumbnail}
                alt="Failed to upload"
                onClick={(event) => {
                  onSelect?.(image, event.target as HTMLElement);
                }}
              />
              {image.isVideoFile && (
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
            <div className={classNames(styles.root__nearVideoBlock, styles.imageParent)}>
              <img
                src={imagesGrid.mainImage.imageThumbnail}
                alt="Failed to upload"
                className={styles.root__nearVideoBlock_image}
                onClick={(event) => {
                  onSelect?.(imagesGrid.mainImage, event.target as HTMLElement);
                }}
              />
              {imagesGrid.mainImage.isVideoFile && (
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
                {imagesGrid.firstRowImages.map((image) => (
                  <div
                    key={image.image}
                    className={classNames(styles.tripleVertical__block, styles.imageParent)}
                    style={{
                      maxHeight: (400 * (1 / image.aspectRatio)) / getToatalHeight(imagesGrid.firstRowImages),
                    }}
                  >
                    <img
                      alt="Failed to upload"
                      src={image.imageThumbnail}
                      className={styles.root__nearVideoBlock_image}
                      onClick={(event) => {
                        onSelect?.(image, event.target as HTMLElement);
                      }}
                    />
                    {image.isVideoFile && (
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
                  {imagesGrid.firstRowImages.map((image) => (
                    <div key={image.image} className={classNames(styles.root__nearVideoBlock, styles.imageParent)}>
                      <img
                        alt="Failed to upload"
                        src={image.imageThumbnail}
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
                <div key={image.imageThumbnail} className={classNames(styles.root__imageBlock, styles.imageParent)}>
                  <img
                    alt=""
                    src={image.imageThumbnail}
                    className={styles.root__imageBlock_image}
                    onClick={(event) => {
                      onSelect?.(image, event.target as HTMLElement);
                    }}
                  />
                  {image.isVideoFile && (
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
