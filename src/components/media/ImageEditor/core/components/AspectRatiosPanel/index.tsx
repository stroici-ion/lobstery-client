import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { EAspectRatios } from '../../../types/enums';
import { aspectRatioList } from '../AspectRatiosList';
import styles from './styles.module.scss';
import ScrollAreaHorizontal from '../../../../../UI/ScrollAreaHorizontal';

interface IAspectRatiosPanel {
  selected: EAspectRatios | undefined;
  setAspectRatio: (id: EAspectRatios) => void;
  hide: () => void;
}

const AspectRatiosPanel: React.FC<IAspectRatiosPanel> = ({ selected, setAspectRatio, hide }) => {
  const [selectedAspectRatioId, setSelectedAspectRatioId] = useState(selected);

  useEffect(() => {
    setSelectedAspectRatioId(selected);
  }, [selected]);

  const hanldeSelectAspectRatio = (id: EAspectRatios) => {
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

export const getOppositeAspectRatio = (aspectRatioId: EAspectRatios) => {
  switch (aspectRatioId) {
    case EAspectRatios.ratio_9_16:
      return EAspectRatios.ratio_16_9;
    case EAspectRatios.ratio_16_9:
      return EAspectRatios.ratio_9_16;
    case EAspectRatios.ratio_4_5:
      return EAspectRatios.ratio_5_4;
    case EAspectRatios.ratio_5_4:
      return EAspectRatios.ratio_4_5;
    case EAspectRatios.ratio_3_4:
      return EAspectRatios.ratio_4_3;
    case EAspectRatios.ratio_4_3:
      return EAspectRatios.ratio_3_4;
    case EAspectRatios.ratio_2_3:
      return EAspectRatios.ratio_3_2;
    case EAspectRatios.ratio_3_2:
      return EAspectRatios.ratio_2_3;
    case EAspectRatios.ratio_1_2:
      return EAspectRatios.ratio_2_1;
    case EAspectRatios.ratio_2_1:
      return EAspectRatios.ratio_1_2;
  }
  return aspectRatioId;
};
