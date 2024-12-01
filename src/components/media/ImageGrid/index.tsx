/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { IImage } from '../../../redux/images/types';
import styles from './styles.module.scss';
import { TGridCell } from './types';
import { PlaySvg } from '../../../icons';
import { useVideo } from '../../../hooks/useVideo';

type ImageGridProps = {
  images: IImage[];
  orderedGrid?: TGridCell;
  onSelect?: (id: number, ref?: HTMLElement) => void;
};

const ImageGrid: React.FC<ImageGridProps> = ({ images, onSelect, orderedGrid }) => {
  const [grid, setGrid] = useState<TGridCell>();
  const [parentWidth, setParentWidth] = useState<number>(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const checkMainCellHeight = useCallback(
    (cell: TGridCell) => {
      let height = parentWidth / cell.ar;
      let width = parentWidth;
      if (parentWidth / cell.ar > 400) {
        width = 400 * cell.ar;
        height = 400;
      }

      return { ...cell, height, width };
    },
    [parentWidth]
  );

  const getComputedGrid = (cell: TGridCell, isMain: boolean = false) => {
    if (cell.cells?.length) {
      const cells = cell.cells;
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        if (c.cells.length) cells[i] = getComputedGrid(c);
      }

      // If the cell has children, calculate their size recursively
      let totalAspectRatio = cells.reduce((sum, c) => sum + c.ar, 0);
      cell.ar = totalAspectRatio;

      if (cell.direction) {
        totalAspectRatio = cells.reduce((sum, c) => sum + 1 / c.ar, 0);
        cell.ar = 1 / totalAspectRatio;
      }

      // Calculate percentage width for each image
      for (let i = 0; i < cells.length; i++) {
        const prevCell = cells[i - 1];
        const currCell = cells[i];
        const imageData = getImageByOrderId(currCell.orderId);
        if (imageData) {
          currCell.imageSrc = imageData.imageUrl;
          currCell.video = imageData.videoUrl || undefined;
        }

        if (cell.direction) {
          currCell.height = (1 / currCell.ar / totalAspectRatio) * 100;
          if (i) {
            currCell.y = prevCell.height + prevCell.y;
            if (i !== cells.length - 1) currCell.styles.height = `calc(${currCell.height}% - 5px)`;
            else currCell.styles.height = `calc(${currCell.height}% - 2.5px)`;
            currCell.styles.top = `calc(${currCell.y}% + 2.5px)`;
          } else {
            currCell.styles.height = `calc(${currCell.height}% - ${cells.length > 1 ? 2.5 : 0}px)`;
            currCell.styles.top = '0';
          }
        } else {
          currCell.width = (currCell.ar / totalAspectRatio) * 100;
          if (i) {
            currCell.x = prevCell.width + prevCell.x;
            if (i !== cells.length - 1) currCell.styles.width = `calc(${currCell.width}% - 5px)`;
            else currCell.styles.width = `calc(${currCell.width}% - 2.5px)`;
            currCell.styles.left = `calc(${currCell.x}% + 2.5px)`;
          } else {
            currCell.styles.width = `calc(${currCell.width}% - ${cells.length > 1 ? 2.5 : 0}px)`;
            currCell.styles.left = '0';
          }
        }
      }

      if (isMain) return checkMainCellHeight({ ...cell, cells });
      else return { ...cell, cells };
    } else {
      const imageData = getImageByOrderId(cell.orderId);
      if (imageData) {
        if (isMain) return checkMainCellHeight({ ...cell, imageSrc: imageData.imageUrl, video: imageData.videoUrl });
        else return { ...cell, imageSrc: imageData.imageUrl, video: imageData.videoUrl };
      } else {
        if (isMain) return checkMainCellHeight(cell);
        else return cell;
      }
    }
  };

  const handleOnSelect = (id: number, node?: HTMLElement) => {
    const parent = (node as Node).parentNode as HTMLDivElement;
    onSelect?.(id, parent);
  };

  useEffect(() => {
    if (parentWidth && orderedGrid) {
      const gridss = getComputedGrid(JSON.parse(JSON.stringify(orderedGrid)), true);
      setGrid(gridss);
    }
  }, [parentWidth, orderedGrid, images]);

  useEffect(() => {
    if (gridRef.current) setParentWidth(gridRef.current.getBoundingClientRect().width);
  }, [gridRef.current]);

  const getImageByOrderId = (orderId: number) => {
    const candidate = images.find((i) => i.orderId === orderId);
    if (candidate)
      return {
        imageUrl: candidate.imageThumbnail,
        videoUrl: candidate.video || undefined,
      };
  };

  const video = useVideo();

  return (
    <div
      className={styles.grid}
      ref={gridRef}
      style={{
        height: `${grid?.height}px`,
      }}
    >
      {grid && (
        <div
          className={classNames(styles.cell, styles.mainCell)}
          style={{
            width: grid.width,
            height: grid.height,
          }}
          onClick={(e) => !video.isPlaying && handleOnSelect?.(grid.imageId, e.target as HTMLElement)}
        >
          {grid.video && <video {...video.videoParams} hidden={!grid.video} src={grid.video} controls />}
          {!video.isPlaying && (
            <>
              {grid.imageSrc && <img src={grid.imageSrc} alt="Failed o upload" />}
              {grid.video && (
                <button className={styles.videoDecoration} onClick={video.onClickPlay}>
                  <span>
                    <PlaySvg />
                  </span>
                </button>
              )}
            </>
          )}
          {grid.cells.map((cell) => (
            <RecursiveCell key={cell.key} cell={cell} onSelect={handleOnSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

const RecursiveCell: React.FC<{
  cell: TGridCell;
  onSelect?: (id: number, node?: HTMLElement) => void;
}> = ({ cell, onSelect }) => {
  const video = useVideo();

  return (
    <div
      key={cell.key}
      className={classNames(styles.cell)}
      style={{
        ...cell.styles,
      }}
      onClick={(e) => !video.isPlaying && onSelect?.(cell.imageId, e.target as HTMLElement)}
    >
      {cell.video && <video src={cell.video} controls {...video.videoParams} />}
      {!video.isPlaying && (
        <>
          {cell.imageSrc && <img src={cell.imageSrc} alt="Failed o upload" />}
          {cell.video && (
            <button className={styles.videoDecoration} onClick={video.onClickPlay}>
              <span>
                <PlaySvg />
              </span>
            </button>
          )}
        </>
      )}
      {cell.cells.map((childCell) => (
        <RecursiveCell key={childCell.key} cell={childCell} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default ImageGrid;
