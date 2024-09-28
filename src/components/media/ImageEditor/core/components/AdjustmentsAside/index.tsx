import React, { useEffect, useState } from 'react';

import styles from './styles.module.scss';
import { IControl } from '../Adjustment';
import Slider from '../../../../../UI/Slider';
import AdjustemntsMobile from '../AdjustemntsMobile';
import ScrollArea from '../../../../../UI/ScrollArea';

interface IAdjustmentsAside {
  controlList: IControl[];
}

const AdjustmentsAside: React.FC<IAdjustmentsAside> = ({ controlList }) => {
  const [deviceType, setDeviceType] = useState<string>('');

  const checkDeviceWidth = () => {
    if (window.innerWidth < 1200) setDeviceType('mobile');
    else setDeviceType('desktop');
  };

  useEffect(() => {
    checkDeviceWidth();
    window.addEventListener('resize', checkDeviceWidth);

    return () => window.removeEventListener('resize', checkDeviceWidth);
  }, []);

  return (
    <>
      {deviceType === 'mobile' && <AdjustemntsMobile controlList={controlList} />} :
      {deviceType === 'desktop' && (
        <div className={styles.root}>
          <ScrollArea className={styles.root__scrollArea}>
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
          </ScrollArea>
        </div>
      )}
    </>
  );
};

export default AdjustmentsAside;
