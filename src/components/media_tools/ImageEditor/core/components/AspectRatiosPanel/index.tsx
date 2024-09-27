import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { EnumAspectRatios } from '../../types/enumerations';
import { aspectRatioList } from '../AspectRatiosList';
import styles from './styles.module.scss';
import ScrollAreaHorizontal from '../../../../../UI/ScrollAreaHorizontal';

interface IAspectRatiosPanel {
  selected: EnumAspectRatios | undefined;
  setAspectRatio: (id: EnumAspectRatios) => void;
  hide: () => void;
}

const AspectRatiosPanel: React.FC<IAspectRatiosPanel> = ({ selected, setAspectRatio, hide }) => {
  const [selectedAspectRatioId, setSelectedAspectRatioId] = useState(selected);

  useEffect(() => {
    setSelectedAspectRatioId(selected);
  }, [selected]);

  const hanldeSelectAspectRatio = (id: EnumAspectRatios) => {
    setAspectRatio(id);
    setSelectedAspectRatioId(id);
  };

  return (
    <div className={styles.root}>
      <ScrollAreaHorizontal className={styles.root__scrollArea}>
        <div className={styles.root__list}>
          {aspectRatioList.map((aspectRatioType) => (
            <button
              className={classNames(styles.root__button, selectedAspectRatioId === aspectRatioType.id && styles.active)}
              key={aspectRatioType.title}
              onClick={() => hanldeSelectAspectRatio(aspectRatioType.id)}
            >
              {aspectRatioType.icon}
              {aspectRatioType.title}
            </button>
          ))}
        </div>
      </ScrollAreaHorizontal>

      <div className={styles.root__row}>
        <button className={styles.root__done} onClick={hide}>
          Done
        </button>
      </div>
    </div>
  );
};

export default AspectRatiosPanel;

export const getOppositeAspectRatio = (aspectRatioId: EnumAspectRatios) => {
  switch (aspectRatioId) {
    case EnumAspectRatios.ratio_9_16:
      return EnumAspectRatios.ratio_16_9;
    case EnumAspectRatios.ratio_16_9:
      return EnumAspectRatios.ratio_9_16;
    case EnumAspectRatios.ratio_4_5:
      return EnumAspectRatios.ratio_5_4;
    case EnumAspectRatios.ratio_5_4:
      return EnumAspectRatios.ratio_4_5;
    case EnumAspectRatios.ratio_3_4:
      return EnumAspectRatios.ratio_4_3;
    case EnumAspectRatios.ratio_4_3:
      return EnumAspectRatios.ratio_3_4;
    case EnumAspectRatios.ratio_2_3:
      return EnumAspectRatios.ratio_3_2;
    case EnumAspectRatios.ratio_3_2:
      return EnumAspectRatios.ratio_2_3;
    case EnumAspectRatios.ratio_1_2:
      return EnumAspectRatios.ratio_2_1;
    case EnumAspectRatios.ratio_2_1:
      return EnumAspectRatios.ratio_1_2;
  }
  return aspectRatioId;
};
