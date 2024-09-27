import React from 'react';

import Adjustment from '../Adjustment';
import Filter from '../Filter';
import Markup from '../Markup';
import Crop from '../Crop';
import { EnumTabs } from '../../types/enumerations';
import { IAdjustments, ICropHistory, IFilterHistory, IMarkupLine } from '../../types/interfaces';

interface ITabItems {
  tab: EnumTabs;
  zoomTrigger: number;
  canvasAsImage?: HTMLCanvasElement;
  optimizedImageData?: ImageData;
  selectedHistoryCropStep?: ICropHistory;
  selectedHistoryAdjStep?: IAdjustments;
  selectedHistoryMarkupStep?: IMarkupLine[];
  selectedHistoryFilterStep?: IFilterHistory;
  imageRef: React.RefObject<HTMLImageElement>;
  canvasMarkup?: HTMLCanvasElement;
  addToHistory: (historyStep: ICropHistory | IAdjustments | IMarkupLine[] | IFilterHistory, type: number) => void;
}

const TabItems: React.FC<ITabItems> = ({
  tab,
  zoomTrigger,
  canvasAsImage,
  optimizedImageData,
  selectedHistoryCropStep,
  selectedHistoryAdjStep,
  selectedHistoryMarkupStep,
  selectedHistoryFilterStep,
  imageRef,
  canvasMarkup,
  addToHistory,
}) => {
  if (!selectedHistoryCropStep || !optimizedImageData) return <></>;

  return (
    <>
      {tab === EnumTabs.crop && (
        <Crop
          zoomTrigger={zoomTrigger}
          canvasAsImage={canvasAsImage}
          markupCanvas={canvasMarkup}
          historyCropState={selectedHistoryCropStep}
          historyAdjustmentState={selectedHistoryAdjStep}
          historyMarkupState={selectedHistoryMarkupStep}
          historyFilterState={selectedHistoryFilterStep}
          imageRef={imageRef}
          addToHistory={addToHistory}
        />
      )}
      {tab === EnumTabs.adjustment && (
        <Adjustment
          optimizedImageData={optimizedImageData}
          markupCanvas={canvasMarkup}
          imageRef={imageRef}
          historyCropState={selectedHistoryCropStep}
          historyAdjustmentState={selectedHistoryAdjStep}
          historyMarkupState={selectedHistoryMarkupStep}
          historyFilterState={selectedHistoryFilterStep}
          addToHistory={addToHistory}
        />
      )}
      {tab === EnumTabs.filter && (
        <Filter
          optimizedImageData={optimizedImageData}
          canvasAsImage={canvasAsImage}
          markupCanvas={canvasMarkup}
          imageRef={imageRef}
          historyCropState={selectedHistoryCropStep}
          historyAdjustmentState={selectedHistoryAdjStep}
          historyMarkupState={selectedHistoryMarkupStep}
          historyFilterState={selectedHistoryFilterStep}
          addToHistory={addToHistory}
        />
      )}
      {tab === EnumTabs.markup && (
        <Markup
          canvasAsImage={canvasAsImage}
          imageRef={imageRef}
          historyCropState={selectedHistoryCropStep}
          historyAdjustmentState={selectedHistoryAdjStep}
          historyMarkupState={selectedHistoryMarkupStep}
          historyFilterState={selectedHistoryFilterStep}
          addToHistory={addToHistory}
        />
      )}
    </>
  );
};

export default TabItems;
