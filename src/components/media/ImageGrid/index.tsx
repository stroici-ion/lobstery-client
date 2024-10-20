import React, { useEffect, useRef, useState } from 'react';
import { IImage } from '../../../models/IImage';

import styles from './styles.module.scss';
import { getLayout } from './core/autoOrderImages';
import classNames from 'classnames';
import { TGridCell } from '../../../models/media-tools/images-grid';
import { TRemainedImagesLocation } from '../../../models/media-tools/images-auto-order';

type ImageGridProps = {
  images: IImage[];
  onSelect?: (src: string, ref?: HTMLElement) => void;
};

const ImageGrid: React.FC<ImageGridProps> = ({ images, onSelect }) => {
  const [grid, setGrid] = useState<TGridCell>();
  const [parentWidth, setParentWidth] = useState<number>(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const [remainedImagesLocation, setRemainedImagesLocation] = useState<TRemainedImagesLocation>('left');

  const calculateCellSize = (cell: TGridCell, isMain: boolean = false) => {
    if (cell.cells.length) {
      const cells = cell.cells;
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        if (c.cells.length) cells[i] = calculateCellSize(c);
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
      if (isMain) return checkMainCellHeight(cell);
      else return cell;
    }
  };

  const checkMainCellHeight = (cell: TGridCell) => {
    let height = parentWidth / cell.ar;
    let width = parentWidth;
    if (parentWidth / cell.ar > 400) {
      width = 400 * cell.ar;
      height = 400;
    }

    return { ...cell, height, width };
  };

  const getMainCell = () => {
    console.log(remainedImagesLocation);

    const cell = getLayout(images, remainedImagesLocation);
    const resizedCell = calculateCellSize(cell, true);
    setGrid(resizedCell);
  };

  const isMoveActive = useRef(false);
  const isSelectBlocked = useRef(false);
  const cursorPosition = useRef({ x: 0, y: 0 });
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const parent = (e.target as Node).parentNode as HTMLDivElement;
    if (parent && parent.id === 'rest') {
      isMoveActive.current = true;
      cursorPosition.current.x = e.clientX;
      cursorPosition.current.y = e.clientY;
    }
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMoveActive.current) {
      isSelectBlocked.current = true;
      if (e.clientX - cursorPosition.current.x > 50) setRemainedImagesLocation('right');
      if (e.clientX - cursorPosition.current.x < -50) setRemainedImagesLocation('left');
      if (e.clientY - cursorPosition.current.y > 50) setRemainedImagesLocation('bottom');
      if (e.clientY - cursorPosition.current.y < -50) setRemainedImagesLocation('top');
    }
  };

  const onMouseUp = () => {
    isMoveActive.current = false;
    isSelectBlocked.current = false;
  };

  const onMouseLeave = () => {
    isMoveActive.current = false;
    isSelectBlocked.current = false;
  };

  const handleOnSelect = (src: string, ref?: HTMLElement) => {
    if (!isSelectBlocked.current) onSelect?.(src, ref);
  };

  useEffect(() => {
    if (parentWidth) getMainCell();
  }, [images, remainedImagesLocation]);

  useEffect(() => {
    if (parentWidth) getMainCell();
  }, [parentWidth]);

  useEffect(() => {
    if (!images.length && !gridRef.current) return;
    if (gridRef.current) {
      setParentWidth(gridRef.current.getBoundingClientRect().width);
    }
  }, [gridRef.current]);

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
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
          onClick={(e) => handleOnSelect?.(grid.src, e.target as HTMLElement)}
        >
          <div
            className={styles.cell__image}
            style={{
              background: `url(${grid.src}) center/contain no-repeat`,
            }}
          />
          {/* Render top-level cells */}
          {grid.cells.map((cell) => (
            <RecursiveCell key={cell.id} cell={cell} onSelect={handleOnSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

const RecursiveCell: React.FC<{ cell: TGridCell; onSelect?: (src: string, ref?: HTMLElement) => void }> = ({
  cell,
  onSelect,
}) => {
  return (
    <div
      id={cell.id}
      key={cell.src}
      className={classNames(styles.cell, cell.id === 'rest' && styles.movable)}
      style={{
        background: cell.src && `url(${cell.src}) center/cover no-repeat`,
        ...cell.styles,
      }}
      onClick={(e) => {
        if (cell.src) onSelect?.(cell.src, e.target as HTMLElement);
      }}
    >
      {/* Recursively render child cells */}
      {cell.cells.map((childCell) => (
        <RecursiveCell key={childCell.id} cell={childCell} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default ImageGrid;
