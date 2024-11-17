import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { EMarkupBrushTypes } from '../../../../../../types/enums';
import { IMarkupBrush } from '../../../../../../types/interfaces';
import styles from './styles.module.scss';
import {
  BrushTypeFreeHandArrowSvg,
  BrushTypeFreeHandDoubleArrowSvg,
  BrushTypeFreeHandSvg,
  BrushTypeStraightArrowSvg,
  BrushTypeStraightDoubleArrowSvg,
  BrushTypeStraightSvg,
} from '../../../../../icons';
import Slider from '../../../../../../../../UI/Slider';

interface IBrushSettings {
  activeBrush: IMarkupBrush;
  onChange: (newBrush: IMarkupBrush) => void;
}

const BrushSettings: React.FC<IBrushSettings> = ({ activeBrush, onChange }) => {
  const [thickness, setThickness] = useState(activeBrush.size);

  const [activeColor, setActiveColor] = useState<string>(activeBrush.color);
  const [activeType, setActiveType] = useState<number>(activeBrush.type);
  const standartColors = [
    ['#fed430', '#fbae17', '#f36323', '#e3182d', '#5b318d', '#914bb8', '#cf1278', '#c10051'],
    ['#3eccfd', '#0078d7', '#0051ba', '#7ec400', '#00b44b', '#ebebeb', '#b6b6b6', '#1f1f1f'],
  ];

  const standartBrushTypes = [
    {
      type: EMarkupBrushTypes.freeHand,
      icon: <BrushTypeFreeHandSvg />,
    },
    {
      type: EMarkupBrushTypes.freeHandArrow,
      icon: <BrushTypeFreeHandArrowSvg />,
    },
    {
      type: EMarkupBrushTypes.freeHandDoubleArrow,
      icon: <BrushTypeFreeHandDoubleArrowSvg />,
    },
    {
      type: EMarkupBrushTypes.straight,
      icon: <BrushTypeStraightSvg />,
    },
    {
      type: EMarkupBrushTypes.straightArrow,
      icon: <BrushTypeStraightArrowSvg />,
    },
    {
      type: EMarkupBrushTypes.straightDoubleArrow,
      icon: <BrushTypeStraightDoubleArrowSvg />,
    },
  ];

  useEffect(() => {
    const newBrush: IMarkupBrush = {
      ...activeBrush,
      size: thickness,
      color: activeColor,
      type: activeType,
    };
    onChange(newBrush);
  }, [thickness, activeColor, activeType]);

  return (
    <div className={styles.root}>
      <div className={styles.root__thickness}>
        <div className={styles.root__preview}>
          <div className={styles.root__previewThickness} style={{ backgroundColor: activeColor, height: thickness }}>
            <div
              className={styles.root__previewThickness_top}
              style={{ transform: `rotate(${-0.8 + (10 - thickness) / 10}deg)` }}
            />
            <div
              className={styles.root__previewThickness_bottom}
              style={{ transform: `rotate(${0.8 - (10 - thickness) / 10}deg)` }}
            />
          </div>
        </div>
        <div className={styles.root__slider}>
          <div className={styles.slider}>
            <Slider
              id={0}
              value={thickness}
              initialValue={1}
              minValue={1}
              maxValue={15}
              onChange={(id: number = 0, value: number) => {
                setThickness(value);
              }}
            />
          </div>
          <p className={styles.slider__value}>{thickness}</p>
        </div>
      </div>

      <div className={styles.root__colors}>
        {standartColors.map((colorsRow, index) => (
          <div key={index} className={styles.root__colorsRow}>
            {colorsRow.map((color) => (
              <button
                className={classNames(styles.root__color, color === activeColor && styles.active)}
                style={{ backgroundColor: color }}
                key={color}
                onClick={() => setActiveColor(color)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className={styles.root__types}>
        {standartBrushTypes.map((type) => (
          <button
            className={classNames(styles.root__typesButton, activeType === type.type && styles.active)}
            onClick={() => setActiveType(type.type)}
            key={type.type}
          >
            {type.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrushSettings;
