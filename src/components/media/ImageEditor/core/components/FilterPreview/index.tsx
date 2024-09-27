import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { IFilterListItem } from '../../types/interfaces';
import { CheckedSvg } from '../../icons';

interface IFilterPreview {
  isActive: boolean;
  setActiveFilter: (id: number) => void;
  filter: IFilterListItem;
  imageData: ImageData;
}

const FilterPreview: React.FC<IFilterPreview> = ({ isActive, filter, imageData, setActiveFilter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.width = imageData.width;
    canvasRef.current.height = imageData.height;
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (filter.filter) {
      const data = new Uint8ClampedArray(imageData.data, imageData.data.length);

      filter.filter(100, data);

      ctx.putImageData(new ImageData(data, imageData.width, imageData.height), 0, 0);
    } else {
      ctx.putImageData(imageData, 0, 0);
    }
  }, [canvasRef.current, imageData]);

  const handleOnClick = () => {
    setActiveFilter(filter.id);
  };

  return (
    <div className={classNames(styles.filter, isActive && styles.active)} onClick={handleOnClick}>
      <canvas className={styles.filter__preview} ref={canvasRef} />
      <div className={classNames(styles.filter__preview, styles.filter__active)}>
        <CheckedSvg />
      </div>
      <p className={styles.filter__title}>{filter.title}</p>
    </div>
  );
};

export default FilterPreview;
