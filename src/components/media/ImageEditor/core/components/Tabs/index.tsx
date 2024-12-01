import React from 'react';
import classNames from 'classnames';

import { AdjustmentSvg, CropSvg, FilterSvg, MarkupSvg } from '../../icons';
import { ETabs } from '../../../types/enums';
import styles from './styles.module.scss';
import btnStyles from '../../../../../../styles/components/buttons/rippleButtons.module.scss';
import RippleButton from '../../../../../UI/buttons/RippleButton';

interface ITabs {
  tab: ETabs;
  setTab: (tab: ETabs) => void;
}

const Tabs: React.FC<ITabs> = ({ tab, setTab }) => {
  return (
    <div className={styles.tabs}>
      <RippleButton
        className={classNames(styles.tabs__tab, btnStyles.lightMain, tab === ETabs.crop && styles.active)}
        onClick={() => setTab(ETabs.crop)}
      >
        <CropSvg /> <p>Crop</p>
      </RippleButton>
      <RippleButton
        className={classNames(styles.tabs__tab, btnStyles.lightMain, tab === ETabs.adjustment && styles.active)}
        onClick={() => setTab(ETabs.adjustment)}
      >
        <AdjustmentSvg /> <p>Adjustment</p>
      </RippleButton>
      <RippleButton
        className={classNames(styles.tabs__tab, btnStyles.lightMain, tab === ETabs.filter && styles.active)}
        onClick={() => setTab(ETabs.filter)}
      >
        <FilterSvg /> <p>Filter</p>
      </RippleButton>
      <RippleButton
        className={classNames(styles.tabs__tab, btnStyles.lightMain, tab === ETabs.markup && styles.active)}
        onClick={() => setTab(ETabs.markup)}
      >
        <MarkupSvg />
        <p> Markup</p>
      </RippleButton>
    </div>
  );
};

export default Tabs;
