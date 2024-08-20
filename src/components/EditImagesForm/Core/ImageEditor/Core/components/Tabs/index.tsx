import React from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { EnumTabs } from '../../Types/Enumerations';
import { CropSvg, MarkupSvg } from '../../../../../../../icons/imageEditor';
import { AdjustmentSvg, FilterSvg } from '../../../../../../../icons';

interface ITabs {
  tab: EnumTabs;
  setTab: (tab: EnumTabs) => void;
}

const Tabs: React.FC<ITabs> = ({ tab, setTab }) => {
  return (
    <div className={styles.tabs}>
      <button className={classNames(styles.tabs__tab, tab === EnumTabs.crop && styles.active)} onClick={() => setTab(EnumTabs.crop)}>
        <CropSvg /> Crop
      </button>
      <button className={classNames(styles.tabs__tab, tab === EnumTabs.adjustment && styles.active)} onClick={() => setTab(EnumTabs.adjustment)}>
        <AdjustmentSvg /> Adjustment
      </button>
      <button className={classNames(styles.tabs__tab, tab === EnumTabs.filter && styles.active)} onClick={() => setTab(EnumTabs.filter)}>
        <FilterSvg /> Filter
      </button>
      <button className={classNames(styles.tabs__tab, tab === EnumTabs.markup && styles.active)} onClick={() => setTab(EnumTabs.markup)}>
        <MarkupSvg /> Markup
      </button>
    </div>
  );
};

export default Tabs;
