import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './styles.module.scss';
import { IAdjustments, ICropHistory, IEditorStep, IFilterHistory, IMarkupLine, ISlider } from '../../Types/Interfaces';
import { getNullObject } from '../../initialStateFunctions/getNullObject';
import { loadHistoryStepPosition } from '../../historyFunctions/loadHistoryStepPosition';
import Aside from '../AdjustmentsAside';
import { initailPostitionLoad } from './core/actions/initailPostitionLoad';
import { initialCanvasContextLoad } from './core/actions/initialCanvasContextLoad';
import { canvasDrawImage } from '../Crop/core/draw/drawImage';
import { drawMarkupLines } from '../../drawFunctions/drawMarkupLines';
import { getNullAdjustments } from '../../initialStateFunctions/getNullAdjustments';
import {
  BrightnessSvg,
  ContrastSvg,
  ExposureSvg,
  HighlightsSvg,
  SaturationSvg,
  ShadowsSvg,
  SharpenessSvg,
  TintSvg,
  WarmthSvg,
} from '../../../../../../../icons/imageEditor';
import { IFilterListItem } from '../Filter';
import { getAdjustedImageData } from '../../imageDataFunctions/getAdjustedImageData';
import { checkAdjustments } from '../../checkFunctions/checkAdjustments';
import { checkFilter } from '../../checkFunctions/checkFilter';
import { filtersList } from '../../Controls/filtersList';
import { compareAdjustments } from '../../checkFunctions/compareAdjustments';

interface IAdjustment {
  optimizedImageData: ImageData;
  markupCanvas?: HTMLCanvasElement;
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
  historyCropState: ICropHistory;
  historyAdjustmentState?: IAdjustments;
  historyMarkupState?: IMarkupLine[];
  historyFilterState?: IFilterHistory;
  addToHistory: (historyStep: IAdjustments, type: number) => void;
}

export interface IControl {
  categoryName: string;
  sliders: ISlider[];
}

const Adjustment: React.FC<IAdjustment> = ({
  optimizedImageData,
  imageRef,
  historyCropState,
  historyMarkupState,
  historyFilterState,
  addToHistory,
  historyAdjustmentState,
}) => {
  const [adjustments, setAdjustmnets] = useState<IAdjustments>(getNullAdjustments());

  const adjustmentsRef = useRef<IAdjustments>(getNullAdjustments());
  const cropStepRef = useRef<IEditorStep>(getNullObject());
  const parentDivRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markupCanvasRef = useRef<HTMLCanvasElement>(null);
  const adjustedImageCanvasRef = useRef<HTMLCanvasElement>(null);
  let canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  let markupCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  let adjustedImageCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isInitialized = useRef(false);
  const wasAdjusted = useRef(false);
  const wasFiltered = useRef(false);
  const adjustmentsImageData = useRef<ImageData>();
  const filterImageData = useRef<ImageData>();
  const activeFilter = useRef<IFilterListItem>();
  const oldSharpnessValue = useRef<number>(0);
  const sharpnessImageData = useRef<ImageData>();
  const cropStep = cropStepRef.current;

  const drawImage = () => {
    if (!canvasCtxRef.current || !imageRef.current || !adjustedImageCanvasRef.current) return;

    let img = wasAdjusted.current || wasFiltered.current ? adjustedImageCanvasRef.current : undefined;

    canvasDrawImage(img, undefined, imageRef.current, cropStep, 0, canvasCtxRef.current, true);
  };

  const drawMarkup = () => {
    if (!markupCanvasCtxRef.current) return;
    drawMarkupLines(cropStep, markupCanvasCtxRef.current, historyMarkupState || [], true);
  };

  const applyAdjustmentsWithFilterOnImageData = () => {
    if (!adjustmentsImageData.current) return;
    getAdjustedImageData(
      optimizedImageData,
      adjustmentsImageData.current,
      adjustmentsRef.current,
      oldSharpnessValue,
      sharpnessImageData,
      historyFilterState,
      filterImageData.current
    );
    wasAdjusted.current = true;
  };

  const applyFilterOnImageData = () => {
    if (activeFilter.current && activeFilter.current.filter && historyFilterState && filterImageData.current) {
      const sourceImageData = wasAdjusted.current ? adjustmentsImageData.current : optimizedImageData;
      if (sourceImageData) {
        activeFilter.current.filter(historyFilterState.intensity, sourceImageData.data, filterImageData.current.data);
        wasFiltered.current = true;
      }
    }
  };

  const updateActiveFilter = () => {
    if (historyFilterState) activeFilter.current = filtersList.find((f) => f.id === historyFilterState.filterId) || filtersList[0];
  };

  const updateAdjustemntsWithFilter = () => {
    if (!adjustedImageCtxRef.current) return;
    const isAdjusted = checkAdjustments(adjustmentsRef.current);
    const isFilterd = historyFilterState ? checkFilter(historyFilterState) : false;

    if (isAdjusted && isFilterd) {
      applyAdjustmentsWithFilterOnImageData();
      if (filterImageData.current) adjustedImageCtxRef.current.putImageData(filterImageData.current, 0, 0);
    } else if (!isAdjusted && isFilterd) {
      wasAdjusted.current = false;
      updateActiveFilter();
      applyFilterOnImageData();
      if (filterImageData.current) adjustedImageCtxRef.current.putImageData(filterImageData.current, 0, 0);
    } else if (isAdjusted && !isFilterd) {
      wasFiltered.current = false;
      activeFilter.current = undefined;
      applyAdjustmentsWithFilterOnImageData();
      if (adjustmentsImageData.current) adjustedImageCtxRef.current.putImageData(adjustmentsImageData.current, 0, 0);
    } else {
      wasAdjusted.current = false;
      wasFiltered.current = false;
      activeFilter.current = undefined;
    }

    drawImage();
  };

  const updateOnlyFilterByHistory = () => {
    if (!adjustedImageCtxRef.current) return;
    const isFilterd = historyFilterState ? checkFilter(historyFilterState) : false;

    if (isFilterd) {
      updateActiveFilter();
      applyFilterOnImageData();
      if (filterImageData.current) adjustedImageCtxRef.current.putImageData(filterImageData.current, 0, 0);
    } else {
      wasFiltered.current = false;
      activeFilter.current = undefined;
      if (wasAdjusted.current && adjustmentsImageData.current) adjustedImageCtxRef.current.putImageData(adjustmentsImageData.current, 0, 0);
    }
    drawImage();
  };

  const updateLocalAdjustemntsByHistory = () => {
    if (historyAdjustmentState && checkAdjustments(historyAdjustmentState)) {
      adjustmentsRef.current = {
        ...historyAdjustmentState,
      };

      setAdjustmnets(historyAdjustmentState);
    } else {
      if (isInitialized.current) {
        adjustmentsRef.current = getNullAdjustments();
        setAdjustmnets(getNullAdjustments());
      }
    }
  };

  const updateCropPositionByHistory = () => {
    loadHistoryStepPosition(cropStep, historyCropState, true);
    drawMarkup();
    if (isInitialized.current) drawImage();
  };

  const addAdjustmentStateToHistory = () => {
    addToHistory(adjustmentsRef.current, 1);
  };

  const setCropInitialPosition = (isResizing = false) => {
    if (!canvasRef.current || !imageRef.current || !parentDivRef.current || !markupCanvasRef.current || !adjustedImageCanvasRef.current) return;

    initailPostitionLoad(cropStep, imageRef.current, canvasRef.current, markupCanvasRef.current, parentDivRef.current);

    initialCanvasContextLoad(canvasCtxRef, markupCanvasCtxRef, canvasRef.current, markupCanvasRef.current);

    adjustedImageCanvasRef.current.width = optimizedImageData.width;
    adjustedImageCanvasRef.current.height = optimizedImageData.height;
    adjustedImageCtxRef.current = adjustedImageCanvasRef.current.getContext('2d');

    adjustmentsImageData.current = new ImageData(
      new Uint8ClampedArray(optimizedImageData.data, optimizedImageData.data.length),
      optimizedImageData.width,
      optimizedImageData.height
    );

    filterImageData.current = new ImageData(
      new Uint8ClampedArray(optimizedImageData.data, optimizedImageData.data.length),
      optimizedImageData.width,
      optimizedImageData.height
    );

    updateCropPositionByHistory();
    if (!isResizing) updateLocalAdjustemntsByHistory();
    updateAdjustemntsWithFilter();

    isInitialized.current = true;
  };

  const onWindowResize = () => {
    if (!isInitialized.current) return;
    setCropInitialPosition(true);
  };

  useEffect(() => {
    if (!isInitialized.current) return;
    updateOnlyFilterByHistory();
  }, [historyFilterState]);

  useEffect(() => {
    if (!isInitialized.current || !historyMarkupState) return;
    drawMarkup();
  }, [historyMarkupState]);

  useEffect(() => {
    if (!isInitialized.current) return;
    updateLocalAdjustemntsByHistory();
    updateAdjustemntsWithFilter();
  }, [historyAdjustmentState]);

  useEffect(() => {
    if (!isInitialized.current || !historyCropState) return;
    updateCropPositionByHistory();
  }, [historyCropState]);

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;
    if (historyAdjustmentState) {
      if (!compareAdjustments(adjustments, historyAdjustmentState)) updateAdjustemntsWithFilter();
    } else updateAdjustemntsWithFilter();
  }, [adjustments]);

  useEffect(() => {
    if (!parentDivRef.current || !canvasRef.current || !adjustedImageCanvasRef.current) return;
    if (isInitialized.current) return;
    setCropInitialPosition();
  }, [parentDivRef.current, canvasRef.current, adjustedImageCanvasRef.current]);

  const onChangeAdjustment = useCallback((id: number, value: number) => {
    switch (id) {
      case 0:
        adjustmentsRef.current.brightness = value;
        break;
      case 1:
        adjustmentsRef.current.contrast = value;
        break;
      case 2:
        adjustmentsRef.current.exposure = value;
        break;
      case 3:
        adjustmentsRef.current.highlights = value;
        break;
      case 4:
        adjustmentsRef.current.shadows = value;
        break;
      case 5:
        adjustmentsRef.current.saturation = value;
        break;
      case 6:
        adjustmentsRef.current.warmth = value;
        break;
      case 7:
        adjustmentsRef.current.tint = value;
        break;
      case 8:
        adjustmentsRef.current.sharpness = value;
        break;
    }
    setAdjustmnets({ ...adjustmentsRef.current });
  }, []);

  const controlsList = [
    {
      categoryName: 'Light',
      sliders: [
        {
          id: 0,
          title: 'Brightness',
          value: adjustments.brightness,
          initialValue: 0,
          onChange: onChangeAdjustment,
          onMouseUp: addAdjustmentStateToHistory,
          icon: <BrightnessSvg />,
          maxValue: 100,
          minValue: -100,
        },
        {
          id: 1,
          title: 'Contrast',
          value: adjustments.contrast,
          initialValue: 0,
          onChange: onChangeAdjustment,
          onMouseUp: addAdjustmentStateToHistory,
          icon: <ContrastSvg />,
          maxValue: 100,
          minValue: -100,
        },
        {
          id: 2,
          title: 'Exposure',
          value: adjustments.exposure,
          initialValue: 0,
          onChange: onChangeAdjustment,
          onMouseUp: addAdjustmentStateToHistory,
          icon: <ExposureSvg />,
          maxValue: 100,
          minValue: -100,
        },
        {
          id: 3,
          title: 'Highlights',
          value: adjustments.highlights,
          initialValue: 0,
          onChange: onChangeAdjustment,
          onMouseUp: addAdjustmentStateToHistory,
          icon: <HighlightsSvg />,
          maxValue: 100,
          minValue: -100,
        },
        {
          id: 4,
          title: 'Shadows',
          value: adjustments.shadows,
          initialValue: 0,
          onChange: onChangeAdjustment,
          onMouseUp: addAdjustmentStateToHistory,
          icon: <ShadowsSvg />,
          maxValue: 100,
          minValue: -100,
        },
      ],
    },
    {
      categoryName: 'Color',
      sliders: [
        {
          id: 5,
          title: 'Saturation',
          value: adjustments.saturation,
          initialValue: 0,
          onChange: onChangeAdjustment,
          onMouseUp: addAdjustmentStateToHistory,
          icon: <SaturationSvg />,
          maxValue: 100,
          minValue: -100,
        },
        {
          id: 6,
          title: 'Warmth',
          value: adjustments.warmth,
          initialValue: 0,
          onChange: onChangeAdjustment,
          onMouseUp: addAdjustmentStateToHistory,
          icon: <WarmthSvg />,
          maxValue: 100,
          minValue: -100,
        },
        {
          id: 7,
          title: 'Tint',
          value: adjustments.tint,
          initialValue: 0,
          onChange: onChangeAdjustment,
          onMouseUp: addAdjustmentStateToHistory,
          icon: <TintSvg />,
          maxValue: 100,
          minValue: -100,
        },
        {
          id: 8,
          title: 'Sharpness',
          value: adjustments.sharpness,
          initialValue: 0,
          onChange: onChangeAdjustment,
          onMouseUp: addAdjustmentStateToHistory,
          icon: <SharpenessSvg />,
          maxValue: 10,
          minValue: 0,
        },
      ],
    },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.root__body} ref={parentDivRef}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <canvas ref={markupCanvasRef} className={styles.canvas} />
        <canvas ref={adjustedImageCanvasRef} style={{ visibility: 'hidden' }} className={styles.canvas} />
      </div>
      <div className={styles.root__aside}>
        <Aside controlList={controlsList} />
      </div>
    </div>
  );
};
export default Adjustment;
