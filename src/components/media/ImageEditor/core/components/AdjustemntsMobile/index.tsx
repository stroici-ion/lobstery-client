import React, { useState } from 'react';

import styles from './styles.module.scss';
import { IControl } from '../Adjustment';
import Slider from '../../../../../UI/Slider';
import ScrollAreaHorizontal from '../../../../../UI/ScrollAreaHorizontal';
import { ISlider } from '../../../types/interfaces';
import classNames from 'classnames';

interface IAdjustemntsMobile {
  controlList: IControl[];
}

const AdjustemntsMobile: React.FC<IAdjustemntsMobile> = ({ controlList }) => {
  const [activeSliderId, setActiveSliderId] = useState<number>();

  const activeSlider = controlList
    .find((c) => c.sliders.find((s) => s.id === activeSliderId))
    ?.sliders.find((s) => s.id === activeSliderId);

  return (
    <div className={styles.root}>
      {controlList.map((panel) =>
        panel.sliders.map(
          (slider) =>
            activeSlider?.id === slider.id && <Slider {...slider} key={slider.title} title={' '} icon={undefined} />
        )
      )}
      <ScrollAreaHorizontal>
        <div className={styles.root__row}>
          {controlList.map((panel) =>
            panel.sliders.map((slider) => (
              <button
                key={slider.id}
                className={classNames(styles.root__button, activeSliderId === slider.id && styles.active)}
                onClick={() => setActiveSliderId(slider.id)}
              >
                {slider.icon}
                {slider.title}
              </button>
            ))
          )}
        </div>
      </ScrollAreaHorizontal>
    </div>
  );
};

export default AdjustemntsMobile;
