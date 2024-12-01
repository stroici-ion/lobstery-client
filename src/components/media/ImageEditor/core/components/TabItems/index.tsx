import React from 'react';

import Adjustment from '../Adjustment';
import Filter from '../Filter';
import Markup from '../Markup';
import Crop from '../Crop';
import { ETabs } from '../../../types/enums';
import { IAdjustments, ICropHistory, IFilterHistory, IMarkupLine } from '../../../types/interfaces';

interface ITabItems {
  originalAspectRatio?: number;
  tab: ETabs;
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
  originalAspectRatio,
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
      {tab === ETabs.crop && (
        <Crop
          originalAspectRatio={originalAspectRatio}
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
      {tab === ETabs.adjustment && (
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
      {tab === ETabs.filter && (
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
      {tab === ETabs.markup && (
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
