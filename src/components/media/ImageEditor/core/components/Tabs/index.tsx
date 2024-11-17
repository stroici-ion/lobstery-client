import React from 'react';
import classNames from 'classnames';

import { AdjustmentSvg, CropSvg, FilterSvg, MarkupSvg } from '../../icons';
import { ETabs } from '../../../types/enums';
import styles from './styles.module.scss';

interface ITabs {
  tab: ETabs;
  setTab: (tab: ETabs) => void;
}

const Tabs: React.FC<ITabs> = ({ tab, setTab }) => {
  return (
    <div className={styles.tabs}>
      <button
        className={classNames(styles.tabs__tab, tab === ETabs.crop && styles.active)}
        onClick={() => setTab(ETabs.crop)}
      >
        <CropSvg /> <span>Crop</span>
      </button>
      <button
        className={classNames(styles.tabs__tab, tab === ETabs.adjustment && styles.active)}
        onClick={() => setTab(ETabs.adjustment)}
      >
        <AdjustmentSvg /> <span>Adjustment</span>
      </button>
      <button
        className={classNames(styles.tabs__tab, tab === ETabs.filter && styles.active)}
        onClick={() => setTab(ETabs.filter)}
      >
        <FilterSvg /> <span>Filter</span>
      </button>
      <button
        className={classNames(styles.tabs__tab, tab === ETabs.markup && styles.active)}
        onClick={() => setTab(ETabs.markup)}
      >
        <MarkupSvg />
        <span>Markup</span>
      </button>
    </div>
  );
};

export default Tabs;
