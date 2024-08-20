import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

import { CheckedSvg } from '../../../../../../../../../../icons';
import { IFilterListItem } from '../../..';
import styles from './styles.module.scss';

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
      <canvas width={100} height={100} className={styles.filter__preview} ref={canvasRef} />
      <div className={classNames(styles.filter__preview, styles.filter__active)}>
        <CheckedSvg />
      </div>
      <p className={styles.filter__title}>{filter.title}</p>
    </div>
  );
};

export default FilterPreview;
