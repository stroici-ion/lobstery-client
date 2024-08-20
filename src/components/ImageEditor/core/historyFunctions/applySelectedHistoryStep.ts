import { IAdjustments, ICropHistory, IFilterHistory, IHistoryIndexState, IHistoryJSON, IMarkupLine } from '../types/interfaces';
import { filtersList } from '../components/FiltersList/filtersList';
import { getNullAdjustments } from '../initialStateFunctions/getNullAdjustments';
import { checkAdjustments } from '../checkFunctions/checkAdjustments';
import { findLastHistoryStep } from './findLastHistoryStep';
import { EnumTabs } from '../types/enumerations';

export const applySelectedHistoryStep = (
  historyIndex: number,
  tab: EnumTabs,
  history: IHistoryJSON[],
  historyIndexesState: React.MutableRefObject<IHistoryIndexState>,
  cvsCtxOriginal: CanvasRenderingContext2D,
  adjusmentsImageData: React.MutableRefObject<ImageData | undefined>,
  filterImageData: React.MutableRefObject<ImageData | undefined>,
  wasAdjusted: React.MutableRefObject<boolean>,
  wasFiltered: React.MutableRefObject<boolean>,
  applyAdjustmentsWithFilterOnImageData: (adjustments: IAdjustments, filter?: IFilterHistory) => void,
  applyFilterOnImageData: (filter: IFilterHistory) => void,
  applyMarkupOnCanvas: (cropStep: ICropHistory, lines: IMarkupLine[]) => void,
  setSelectedHistoryCropStep: (value: React.SetStateAction<ICropHistory | undefined>) => void,
  setSelectedHistoryMarkupStep: (value: React.SetStateAction<IMarkupLine[] | undefined>) => void,
  setSelectedHistoryAdjStep: (value: React.SetStateAction<IAdjustments | undefined>) => void,
  setSelectedHistoryFilterStep: (value: React.SetStateAction<IFilterHistory | undefined>) => void
) => {
  const historyCrop = findLastHistoryStep(historyIndex, 0, history) || {
    value: history[0].value,
    index: 0,
  };
  const historyAdjustments = findLastHistoryStep(historyIndex, 1, history) || undefined;
  const historyMarkup = findLastHistoryStep(historyIndex, 2, history) || undefined;
  const historyFilter = findLastHistoryStep(historyIndex, 3, history) || undefined;

  let filter: IFilterHistory | undefined = undefined;
  let adjustments: IAdjustments | undefined = undefined;
  if (historyFilter) filter = JSON.parse(historyFilter.value) as IFilterHistory;
  if (historyAdjustments) adjustments = JSON.parse(historyAdjustments.value) as IAdjustments;
  const existsAdjustments = adjustments ? checkAdjustments(adjustments) : false;
  const existsFilter = filter ? !!filter.filterId : false;

  let updateAdjustmentsState = false;
  let updateFilterState = false;
  let updateCropState = false;
  let updateMarkupState = false;

  let filterValueToUpdate;
  let adjustmentsValueToUpdate;
  let cropValueToUpdate;
  let markupValueToUpdate;

  const cropValue = JSON.parse(historyCrop.value) as ICropHistory;
  if (historyIndexesState.current.crop !== historyCrop.index) {
    updateCropState = true;
    cropValueToUpdate = cropValue;
    historyIndexesState.current.crop = historyCrop.index;
  }

  switch (tab) {
    case EnumTabs.filter:
    case EnumTabs.adjustment: {
      if (historyAdjustments && existsAdjustments) {
        if (historyAdjustments.index !== historyIndexesState.current.adjustment) {
          adjustmentsValueToUpdate = adjustments;
          updateAdjustmentsState = true;
          historyIndexesState.current.adjustment = historyAdjustments.index;
        }
      } else {
        adjustmentsValueToUpdate = getNullAdjustments();
        updateAdjustmentsState = true;
        historyIndexesState.current.adjustment = 0;
      }

      if (historyFilter && existsFilter) {
        if (historyFilter.index !== historyIndexesState.current.filter) {
          filterValueToUpdate = filter;
          updateFilterState = true;
          historyIndexesState.current.filter = historyFilter.index;
        }
      } else {
        filterValueToUpdate = { filterId: filtersList[0].id, intensity: 100 };
        updateFilterState = true;
        historyIndexesState.current.filter = 0;
      }

      break;
    }
    default: {
      let f = true;
      let recalculateFilter = false;
      if (historyAdjustments && existsAdjustments && adjustments) {
        if (historyAdjustments.index !== historyIndexesState.current.adjustment) {
          applyAdjustmentsWithFilterOnImageData(adjustments, filter);
          adjustmentsValueToUpdate = adjustments;
          updateAdjustmentsState = true;
          historyIndexesState.current.adjustment = historyAdjustments.index;
          if (historyFilter && existsFilter && filter?.filterId) {
            wasFiltered.current = true;
            if (filterImageData.current) cvsCtxOriginal.putImageData(filterImageData.current, 0, 0);
            filterValueToUpdate = filter;
            updateFilterState = true;
            historyIndexesState.current.filter = historyFilter.index;
          } else {
            if (adjusmentsImageData.current) cvsCtxOriginal.putImageData(adjusmentsImageData.current, 0, 0);
            if (wasFiltered.current) {
              wasFiltered.current = false;
              if (historyIndexesState.current.filter) {
                filterValueToUpdate = { filterId: filtersList[0].id, intensity: 100 };
                updateFilterState = true;
              }
              historyIndexesState.current.filter = 0;
            }
          }
          f = false;
        }
      } else {
        if (wasAdjusted.current) recalculateFilter = true;
        wasAdjusted.current = false;
        if (historyIndexesState.current.adjustment) {
          adjustmentsValueToUpdate = getNullAdjustments();
          updateAdjustmentsState = true;
        }
        historyIndexesState.current.adjustment = 0;
      }

      if (f) {
        if (historyFilter && filter && existsFilter) {
          if (historyFilter.index !== historyIndexesState.current.filter) {
            filterValueToUpdate = filter;
            updateFilterState = true;
            historyIndexesState.current.filter = historyFilter.index;
            applyFilterOnImageData(filter);
            if (filterImageData.current) cvsCtxOriginal.putImageData(filterImageData.current, 0, 0);
          } else {
            if (recalculateFilter) {
              applyFilterOnImageData(filter);
              if (filterImageData.current) cvsCtxOriginal.putImageData(filterImageData.current, 0, 0);
            }
          }
        } else {
          if (wasFiltered.current) {
            if (wasAdjusted.current && adjusmentsImageData.current) cvsCtxOriginal.putImageData(adjusmentsImageData.current, 0, 0);
            wasFiltered.current = false;
            if (historyIndexesState.current.filter) {
              filterValueToUpdate = { filterId: filtersList[0].id, intensity: 100 };
              updateFilterState = true;
            }
            historyIndexesState.current.filter = 0;
          }
        }
      }
      break;
    }
  }

  if (historyMarkup) {
    if (historyMarkup.index !== historyIndexesState.current.markup) {
      const markup = JSON.parse(historyMarkup.value) as IMarkupLine[];
      if (tab !== EnumTabs.markup) applyMarkupOnCanvas(cropValue, markup);
      markupValueToUpdate = markup;
      updateMarkupState = true;
      historyIndexesState.current.markup = historyMarkup.index;
    }
  } else {
    updateMarkupState = true;
    markupValueToUpdate = [];
    historyIndexesState.current.markup = 0;
  }

  if (updateCropState) setSelectedHistoryCropStep(cropValueToUpdate);
  if (updateMarkupState) setSelectedHistoryMarkupStep(markupValueToUpdate);
  if (updateAdjustmentsState) setSelectedHistoryAdjStep(adjustmentsValueToUpdate);
  if (updateFilterState) setSelectedHistoryFilterStep(filterValueToUpdate);
};
