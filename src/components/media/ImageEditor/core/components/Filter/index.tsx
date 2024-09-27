import React, { useEffect, useRef, useState } from 'react';

import { IAdjustments, ICropHistory, IEditorStep, IFilterHistory, IMarkupLine } from '../../types/interfaces';
import { initialPreviewFilterPositionLoad } from './core/actions/initialPreviewFilterPositionLoad';
import { loadHistoryStepPosition } from '../../historyFunctions/loadHistoryStepPosition';
import { getAdjustedImageData } from '../../imageDataFunctions/getAdjustedImageData';
import { initialCanvasContextLoad } from './core/actions/initialCanvasContextLoad';
import { initailPostitionLoad } from './core/actions/initailPostitionLoad';
import { getNullObject } from '../../initialStateFunctions/getNullObject';
import { checkAdjustments } from '../../checkFunctions/checkAdjustments';
import { drawMarkupLines } from '../../drawFunctions/drawMarkupLines';
import { checkFilter } from '../../checkFunctions/checkFilter';
import { canvasDrawImage } from '../Crop/core/draw/drawImage';
import { filtersList } from '../FiltersList/filtersList';
import FiltersAside from '../FiltersAside';
import styles from './styles.module.scss';
import { dpr } from '../../config';

interface IFilter {
  optimizedImageData: ImageData;
  canvasAsImage?: HTMLCanvasElement;
  markupCanvas?: HTMLCanvasElement;
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
  historyCropState: ICropHistory;
  historyAdjustmentState?: IAdjustments;
  historyMarkupState?: IMarkupLine[];
  historyFilterState?: IFilterHistory;
  addToHistory: (historyStep: IFilterHistory, type: number) => void;
}

const Filter: React.FC<IFilter> = ({
  optimizedImageData,
  imageRef,
  canvasAsImage,
  historyCropState,
  historyMarkupState,
  addToHistory,
  historyAdjustmentState,
  historyFilterState,
}) => {
  const cropStepRef = useRef<IEditorStep>(getNullObject());
  const cropStep = cropStepRef.current;

  const parentDivRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markupCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasPrevieFilterRef = useRef<HTMLCanvasElement>(null);
  const adjustedImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const adjustedImageData = useRef<ImageData>();

  const [previewFilterData, setPreviewFilterData] = useState<ImageData>();

  const imageData = useRef<ImageData>();

  let canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  let markupCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  let canvasCtxPrevieFilterRef = useRef<CanvasRenderingContext2D | null>(null);
  let adjustedImageCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [filterId, setFilterId] = useState(historyFilterState?.filterId || filtersList[0].id);
  const [filterValue, setFilterValue] = useState(historyFilterState?.intensity || 100);
  const currentFilter = useRef<IFilterHistory>({
    filterId: filtersList[0].id,
    intensity: 100,
  });

  const isInitialized = useRef(false);

  const oldSharpnessValue = useRef<number>(0);
  const sharpnessImageData = useRef<ImageData>();

  const drawImage = (useCanvasAsImage: boolean = false) => {
    if (!canvasCtxRef.current || !imageRef.current || !adjustedImageCanvasRef.current) return;

    let canvasImg = undefined;
    if (useCanvasAsImage) canvasImg = adjustedImageCanvasRef.current;

    canvasDrawImage(canvasImg, undefined, imageRef.current, cropStep, 0, canvasCtxRef.current, true);
  };

  const drawMarkup = () => {
    if (!markupCanvasCtxRef.current) return;
    drawMarkupLines(cropStep, markupCanvasCtxRef.current, historyMarkupState || [], true);
  };

  const setCropInitialPosition = () => {
    if (
      !canvasRef.current ||
      !imageRef.current ||
      !parentDivRef.current ||
      !markupCanvasRef.current ||
      !canvasPrevieFilterRef.current ||
      !adjustedImageCanvasRef.current
    )
      return;

    initialPreviewFilterPositionLoad(canvasPrevieFilterRef.current, canvasCtxPrevieFilterRef);

    //Get initail position determinated by div parent (Origin, width, height) that is changed when window is resized
    initailPostitionLoad(cropStep, imageRef.current, canvasRef.current, markupCanvasRef.current, parentDivRef.current);

    adjustedImageCanvasRef.current.width = optimizedImageData.width;
    adjustedImageCanvasRef.current.height = optimizedImageData.height;
    adjustedImageCtxRef.current = adjustedImageCanvasRef.current.getContext('2d');

    //Get initail styles and context of canvas
    initialCanvasContextLoad(canvasCtxRef, markupCanvasCtxRef, canvasRef.current, markupCanvasRef.current);

    if (historyFilterState) {
      setFilterId(historyFilterState.filterId);
      setFilterValue(historyFilterState.intensity);
      currentFilter.current.filterId = historyFilterState.filterId;
      currentFilter.current.intensity = historyFilterState.intensity;
    } else {
      setFilterId(filtersList[0].id);
      setFilterValue(100);
      currentFilter.current.filterId = filtersList[0].id;
      currentFilter.current.intensity = 100;
    }

    //Load position based on history step (If is flipped, rotated, and ...)
    historyCropStepLoad();
  };

  const historyCropStepLoad = () => {
    loadHistoryStepPosition(cropStep, historyCropState, 1);
    drawMarkup();
    updateAdjustmentsAndFilter();
  };

  const updateAdjustmentsAndFilter = () => {
    const isAdjusted = historyAdjustmentState && checkAdjustments(historyAdjustmentState);
    const isFilterd = currentFilter.current && checkFilter(currentFilter.current);

    if (isAdjusted) {
      applyAdjustments();
    } else adjustedImageData.current = undefined;

    getPreviewImageData();

    if (isFilterd) applyFilter();
    else imageData.current = undefined;

    updateImage(isAdjusted, isFilterd);
  };

  const updateFilter = () => {
    const isAdjusted = historyAdjustmentState && checkAdjustments(historyAdjustmentState);
    const isFilterd = currentFilter.current && checkFilter(currentFilter.current);
    if (isFilterd) applyFilter();
    else {
      imageData.current = undefined;
      if (isAdjusted && adjustedImageData.current && adjustedImageCtxRef.current) {
        adjustedImageCtxRef.current.putImageData(adjustedImageData.current, 0, 0);
      }
    }
    updateImage(isAdjusted, isFilterd);
  };

  const updateImage = (isAdjusted: boolean = false, isFilterd: boolean = false) => {
    if (!adjustedImageCtxRef.current) return;

    if (isFilterd && imageData.current) {
      adjustedImageCtxRef.current.putImageData(imageData.current, 0, 0);
      drawImage(true);
      return;
    }

    if (isAdjusted && adjustedImageData.current) {
      drawImage(true);
      return;
    }

    drawImage();
  };

  // Change Image Function

  const applyAdjustments = () => {
    if (!adjustedImageCtxRef.current || !imageRef.current || !historyAdjustmentState) return;

    adjustedImageData.current = new ImageData(
      new Uint8ClampedArray(optimizedImageData.data, optimizedImageData.data.length),
      optimizedImageData.width,
      optimizedImageData.height
    );

    getAdjustedImageData(
      optimizedImageData,
      adjustedImageData.current,
      historyAdjustmentState,
      oldSharpnessValue,
      sharpnessImageData
    );

    adjustedImageCtxRef.current.putImageData(adjustedImageData.current, 0, 0);
  };

  const applyFilter = () => {
    if (!adjustedImageCtxRef.current) return;
    const filterCandidate = filtersList.find((f) => f.id === currentFilter.current.filterId) || filtersList[0];

    if (filterCandidate.filter) {
      imageData.current = adjustedImageData.current
        ? new ImageData(
            new Uint8ClampedArray(adjustedImageData.current.data, adjustedImageData.current.data.length),
            adjustedImageData.current.width,
            adjustedImageData.current.height
          )
        : new ImageData(
            new Uint8ClampedArray(optimizedImageData.data, optimizedImageData.data.length),
            optimizedImageData.width,
            optimizedImageData.height
          );

      if (imageData) filterCandidate.filter(currentFilter.current.intensity, imageData.current.data);
    }
  };

  const getPreviewImageData = () => {
    if (!imageRef.current) return;
    const c1 = document.createElement('canvas');
    const c2 = document.createElement('canvas');
    const c3 = document.createElement('canvas'); // Intermediate canvas
    const ctx1 = c1.getContext('2d');
    const ctx2 = c2.getContext('2d');
    const ctx3 = c3.getContext('2d'); // Intermediate context
    if (!ctx1 || !ctx2 || !ctx3) return;

    ctx1.imageSmoothingEnabled = true;
    ctx2.imageSmoothingEnabled = true;
    ctx3.imageSmoothingEnabled = true;

    ctx1.imageSmoothingQuality = 'high';
    ctx2.imageSmoothingQuality = 'high';
    ctx3.imageSmoothingQuality = 'high';

    const p = getNullObject();
    p.parentSize = {
      width: 600 * dpr,
      height: 600 * dpr,
    };

    c1.width = p.parentSize.width;
    c1.height = p.parentSize.height;

    p.Origin = {
      x: p.parentSize.width / 2,
      y: p.parentSize.height / 2,
    };

    if (historyCropState.cropAR > 1) {
      p.crop.height = p.parentSize.height;
      p.crop.y = 0;
      p.crop.width = p.parentSize.width * historyCropState.cropAR;
      p.crop.x = p.Origin.x - p.crop.width;
    } else {
      p.crop.width = p.parentSize.width;
      p.crop.x = 0;
      p.crop.height = p.parentSize.height / historyCropState.cropAR;
      p.crop.y = p.Origin.y - p.crop.height;
    }

    loadHistoryStepPosition(p, historyCropState, 2, false);

    const img =
      historyAdjustmentState && adjustedImageCanvasRef.current && checkAdjustments(historyAdjustmentState)
        ? adjustedImageCanvasRef.current
        : undefined;

    canvasDrawImage(img, undefined, imageRef.current, p, 0, ctx1, true);

    // Intermediate resizing step
    c2.width = 300;
    c2.height = 300;
    ctx2.drawImage(c1, 0, 0, 300, 300);

    // Final resizing step
    c3.width = 150;
    c3.height = 150;
    ctx3.drawImage(c2, 0, 0, 150, 150);

    setPreviewFilterData(ctx3.getImageData(0, 0, 150, 150));
  };

  useEffect(() => {
    if (!isInitialized.current) return;
    if (historyCropState) {
      historyCropStepLoad();
    }
  }, [historyCropState]);

  useEffect(() => {
    if (!isInitialized.current) return;
    if (historyMarkupState) {
      drawMarkup();
    }
  }, [historyMarkupState]);

  useEffect(() => {
    if (!isInitialized.current) return;
    updateAdjustmentsAndFilter();
  }, [historyAdjustmentState]);

  useEffect(() => {
    if (!isInitialized.current) return;
    updateFilter();
  }, [filterValue, filterId]);

  useEffect(() => {
    if (!isInitialized.current) return;
    if (historyFilterState) {
      setFilterId(historyFilterState.filterId);
      setFilterValue(historyFilterState.intensity);
      currentFilter.current.filterId = historyFilterState.filterId;
      currentFilter.current.intensity = historyFilterState.intensity;
    } else {
      setFilterId(filtersList[0].id);
      setFilterValue(100);
      currentFilter.current.filterId = filtersList[0].id;
      currentFilter.current.intensity = 100;
    }
  }, [historyFilterState]);

  useEffect(() => {
    if (!parentDivRef.current || !canvasRef.current || !canvasPrevieFilterRef.current) return;
    if (!isInitialized.current) {
      setCropInitialPosition();
      isInitialized.current = true;
    }
  }, [parentDivRef.current, canvasRef.current, canvasPrevieFilterRef.current]);

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  const onWindowResize = () => {
    if (!isInitialized.current) return;
    setCropInitialPosition();
  };

  const setFilterValueCallback = (value: number) => {
    currentFilter.current.intensity = value;
    setFilterValue(value);
  };

  const setFilterIdCallback = (id: number) => {
    currentFilter.current.filterId = id;
    setFilterId(id);
    addFilterStateToHistoryCallback();
  };

  const addFilterStateToHistoryCallback = () => {
    const data: IFilterHistory = {
      filterId: currentFilter.current.filterId,
      intensity: currentFilter.current.intensity,
    };
    addToHistory(data, 3);
  };

  return (
    <div className={styles.root}>
      <div className={styles.root__body} ref={parentDivRef}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <canvas ref={markupCanvasRef} className={styles.canvas} />
        <canvas ref={canvasPrevieFilterRef} className={styles.canvas} hidden />
        <canvas ref={adjustedImageCanvasRef} style={{ visibility: 'hidden' }} className={styles.canvas} />
      </div>
      <div className={styles.root__aside}>
        {previewFilterData && (
          <FiltersAside
            imageData={previewFilterData}
            filtersList={filtersList}
            initialValue={0}
            value={filterValue}
            setValue={setFilterValueCallback}
            filterId={filterId}
            setFilterId={setFilterIdCallback}
            addToHisotry={addFilterStateToHistoryCallback}
          />
        )}
      </div>
    </div>
  );
};
export default Filter;
