import React, { useEffect, useState } from 'react';

import { IFilterListItem } from '../../types/interfaces';
import FilterPreview from '../FilterPreview';
import styles from './styles.module.scss';
import Slider from '../../../../../UI/Slider';
import ScrollArea from '../../../../../UI/ScrollArea';
import ScrollAreaHorizontal from '../../../../../UI/ScrollAreaHorizontal';

interface IFiltersAside {
  filtersList: IFilterListItem[];
  imageData: ImageData;
  initialValue: number;
  value: number;
  setValue: (value: number) => void;
  filterId: number;
  setFilterId: (id: number) => void;
  addToHisotry: () => void;
}

const FiltersAside: React.FC<IFiltersAside> = ({
  imageData,
  filtersList,
  value,
  setValue,
  initialValue,
  filterId,
  setFilterId,
  addToHisotry,
}) => {
  const selectedFilterPosition = filtersList.find((f) => f.id === filterId)?.id || 0;
  const sliderPosition = selectedFilterPosition + 2 - (selectedFilterPosition % 3);
  const [isMobilePanelVisible, setIsMobilePanelVisible] = useState(false);

  const setActiveFilter = (id: number) => {
    setFilterId(id);
  };

  const hanldeSliderOnChange = (id: number, value: number) => {
    setValue(value);
  };

  const checkDeviceWidth = () => {
    if (window.innerWidth < 1200) setIsMobilePanelVisible(true);
    else setIsMobilePanelVisible(false);
  };

  useEffect(() => {
    checkDeviceWidth();
    window.addEventListener('resize', checkDeviceWidth);

    return () => window.removeEventListener('resize', checkDeviceWidth);
  }, []);

  return (
    <div className={styles.root}>
      {isMobilePanelVisible ? (
        <>
          <div className={styles.root__slider}>
            <Slider
              title='Intensity'
              id={0}
              value={value}
              initialValue={initialValue}
              minValue={0}
              maxValue={100}
              onChange={hanldeSliderOnChange}
              onMouseUp={addToHisotry}
            />
          </div>
          <ScrollAreaHorizontal>
            <div className={styles.root__row}>
              {filtersList.map((filter) => (
                <div className={styles.root__filter} key={filter.id}>
                  <FilterPreview
                    setActiveFilter={setActiveFilter}
                    isActive={filter.id === filterId}
                    filter={filter}
                    imageData={imageData}
                  />
                </div>
              ))}
            </div>
          </ScrollAreaHorizontal>
        </>
      ) : (
        <ScrollArea>
          <div className={styles.root__row}>
            {filtersList.map(
              (filter, index) =>
                index <= sliderPosition && (
                  <div className={styles.root__filter} key={filter.id}>
                    <FilterPreview
                      setActiveFilter={setActiveFilter}
                      isActive={filter.id === filterId}
                      filter={filter}
                      imageData={imageData}
                    />
                  </div>
                )
            )}
          </div>
          {!!filterId && (
            <div className={styles.root__slider}>
              <Slider
                title='Intensity'
                id={0}
                value={value}
                initialValue={initialValue}
                minValue={0}
                maxValue={100}
                onChange={hanldeSliderOnChange}
                onMouseUp={addToHisotry}
              />
            </div>
          )}
          <div className={styles.root__row}>
            {filtersList.map(
              (filter, index) =>
                index > sliderPosition && (
                  <div className={styles.root__filter} key={filter.id}>
                    <FilterPreview
                      setActiveFilter={setActiveFilter}
                      isActive={filter.id === filterId}
                      filter={filter}
                      imageData={imageData}
                    />
                  </div>
                )
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default FiltersAside;
