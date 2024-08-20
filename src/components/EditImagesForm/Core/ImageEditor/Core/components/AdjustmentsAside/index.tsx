import React from 'react';

import styles from './styles.module.scss';
import { IControl } from '../Adjustment';
import Slider from '../Slider';

interface IAdjustmentsAside {
  controlList: IControl[];
}

const AdjustmentsAside: React.FC<IAdjustmentsAside> = ({ controlList }) => {
  return (
    <div className={styles.root}>
      {controlList.map((panel) => (
        <div className={styles.root__category} key={panel.categoryName}>
          <p className={styles.root__title}>{panel.categoryName}</p>
          <div className={styles.root__list}>
            {panel.sliders.map((slider) => (
              <Slider {...slider} key={slider.title} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdjustmentsAside;
