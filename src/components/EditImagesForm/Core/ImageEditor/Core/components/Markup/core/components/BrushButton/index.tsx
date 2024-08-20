import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { BrushArrowSvg, BrushDoubleArrowSvg } from '../../../../../../../../../../icons/imageEditor';
import { EnumMarkupBrushType } from '../../../../../Types/Enumerations';
import { IMarkupBrush } from '../../../../../Types/Interfaces';
import { ArrowSvg } from '../../../../../../../../../../icons';
import BrushSettings from '../BrushSettings';
import styles from './styles.module.scss';

interface IBrushButton {
  brush: IMarkupBrush;
  isActive: boolean;
  onClick: () => void;
  onChange: (newBrush: IMarkupBrush) => void;
}

const BrushButton: React.FC<IBrushButton> = ({ brush, isActive, onClick, onChange }) => {
  const [isBrushSettingsPanelVisible, setIsBrushSettingsPanelVisible] = useState(isActive);
  const parentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const hideSettings = () => {
    setIsBrushSettingsPanelVisible(false);
  };

  useEffect(() => {
    hideSettings();
  }, [isActive]);

  const handleButtonClick = () => {
    onClick();

    if (isActive) {
      setIsBrushSettingsPanelVisible(!isBrushSettingsPanelVisible);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (buttonRef.current && buttonRef.current.contains(e.target as Node)) return;

    if (parentRef.current && !parentRef.current.contains(e.target as Node)) {
      hideSettings();
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getBrushArrowIconByType = () => {
    switch (brush.type) {
      case EnumMarkupBrushType.freeHandArrow:
      case EnumMarkupBrushType.straightArrow:
        return <BrushArrowSvg />;
      case EnumMarkupBrushType.freeHandDoubleArrow:
      case EnumMarkupBrushType.straightDoubleArrow:
        return <BrushDoubleArrowSvg />;
    }
    return <></>;
  };

  return (
    <div className={styles.root}>
      <div className={styles.root__settings} ref={parentRef}>
        {isBrushSettingsPanelVisible && <BrushSettings activeBrush={brush} onChange={onChange} />}
      </div>
      <button ref={buttonRef} className={classNames(styles.brush, isActive && styles.active)} onClick={handleButtonClick}>
        <div className={styles.brush__type}>{getBrushArrowIconByType()}</div>
        <div className={styles.brush__status} style={{ stroke: brush.color }}>
          <ArrowSvg />
          <div className={styles.brush__color} style={{ backgroundColor: brush.color, height: Math.ceil(brush.size / 2) }} />
        </div>
        <div className={styles.brush__icon}>{brush.icon}</div>
      </button>
    </div>
  );
};

export default BrushButton;
