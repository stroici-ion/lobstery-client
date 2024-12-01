import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { applySelectedHistoryStep } from './core/historyFunctions/applySelectedHistoryStep';
import { drawMarkupRelativeToImage } from './core/drawFunctions/drawMarkupRelativeToImage';
import { loadHistoryStepPosition } from './core/historyFunctions/loadHistoryStepPosition';
import btnStyles from '../../../styles/components/buttons/solidLightButtons.module.scss';
import { getAdjustedImageData } from './core/imageDataFunctions/getAdjustedImageData';
import { findLastHistoryStep } from './core/historyFunctions/findLastHistoryStep';
import { getFirtsHistoryStep } from './core/historyFunctions/getFirtsHistoryStep';
import { canvasDrawImage } from './core/components/Crop/core/draw/drawImage';
import { getNullObject } from './core/initialStateFunctions/getNullObject';
import { filtersList } from './core/components/FiltersList/filtersList';
import { RevertSvg, ZoomInSvg, ZoomOutSvg } from './core/icons';
import { IImage } from '../../../redux/images/types';
import TabItems from './core/components/TabItems';
import Tabs from './core/components/Tabs';
import styles from './styles.module.scss';
import { ETabs } from './types/enums';
import Loader from '../../Loader';
import {
  IAdjustments,
  ICropHistory,
  IFilterHistory,
  IHistoryIndexState,
  IHistoryJSON,
  IMarkupLine,
} from './types/interfaces';

interface IImageEditor2 {
  image: IImage;
  onSave: (newImage: IImage) => void;
  setIsModified?: (isModified: boolean) => void;
  originalAspectRatio?: number;
}

const ImageEditor2: React.FC<IImageEditor2> = ({ originalAspectRatio, image, onSave, setIsModified }) => {
  const [tab, setTab] = useState(ETabs.crop);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [isUndoAvailable, setIsUndoAvailable] = useState<boolean>(false);
  const [isRedoAvailable, setIsRedoAvailable] = useState<boolean>(false);

  const [selectedHistoryCropStep, setSelectedHistoryCropStep] = useState<ICropHistory>();
  const [selectedHistoryAdjStep, setSelectedHistoryAdjStep] = useState<IAdjustments>();
  const [selectedHistoryMarkupStep, setSelectedHistoryMarkupStep] = useState<IMarkupLine[]>();
  const [selectedHistoryFilterStep, setSelectedHistoryFilterStep] = useState<IFilterHistory>();

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasMarkupRef = useRef<HTMLCanvasElement>(null);
  const optimizedImageCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageCanvasRef = useRef<HTMLCanvasElement>(null);

  const historyRef = useRef<IHistoryJSON[]>([]);
  const historyIndex = useRef<number>(0);

  const isFirstPositionInitialized = useRef<boolean>(false);

  let cvsCtxMkup = useRef<CanvasRenderingContext2D | null>(null);
  let cvsCtxOriginal = useRef<CanvasRenderingContext2D | null>(null);
  let cvsCtxOptimzed = useRef<CanvasRenderingContext2D | null>(null);

  const originalImageData = useRef<ImageData>();
  const optimizedImageData = useRef<ImageData>();
  const adjusmentsSharpnessImageData = useRef<ImageData>();
  const adjusmentsImageData = useRef<ImageData>();
  const filterImageData = useRef<ImageData>();

  const historyIndexesState = useRef<IHistoryIndexState>({
    crop: -1,
    adjustment: 0,
    markup: 0,
    filter: 0,
  });

  const wasAdjusted = useRef(false);
  const wasFiltered = useRef(false);

  const useImgeAsCanvasType = useRef<number>(0);
  const oldSharpnessValue = useRef<number>(0);

  const resetAdjustementsValues = () => {
    oldSharpnessValue.current = 0;
    adjusmentsSharpnessImageData.current = undefined;
  };

  const updateHistoryStep = (historyIndex: number, tab: ETabs) => {
    if (!cvsCtxOriginal.current) return;
    applySelectedHistoryStep(
      historyIndex,
      tab,
      historyRef.current,
      historyIndexesState,
      cvsCtxOriginal.current,
      adjusmentsImageData,
      filterImageData,
      wasAdjusted,
      wasFiltered,
      applyAdjustmentsWithFilterOnImageData,
      applyFilterOnImageData,
      applyMarkupOnCanvas,
      setSelectedHistoryCropStep,
      setSelectedHistoryMarkupStep,
      setSelectedHistoryAdjStep,
      setSelectedHistoryFilterStep
    );
  };

  const imageOnLoad = () => {
    setIsImageLoaded(true);
  };

  useEffect(() => {
    if (!isImageLoaded) return;

    if (
      !imageRef.current ||
      !canvasMarkupRef.current ||
      !originalImageCanvasRef.current ||
      !optimizedImageCanvasRef.current
    )
      return;

    originalImageCanvasRef.current.width = canvasMarkupRef.current.width = imageRef.current.width;
    originalImageCanvasRef.current.height = canvasMarkupRef.current.height = imageRef.current.height;

    let w = imageRef.current.width;
    let h = imageRef.current.height;

    if (w > h) {
      if (w > 2000) {
        w = 2000;
        h = h * (w / imageRef.current.width);
      }
    } else {
      if (h > 2000) {
        h = 2000;
        w = w * (h / imageRef.current.height);
      }
    }

    optimizedImageCanvasRef.current.width = w;
    optimizedImageCanvasRef.current.height = h;

    cvsCtxMkup.current = canvasMarkupRef.current.getContext('2d');
    cvsCtxOriginal.current = originalImageCanvasRef.current.getContext('2d', { willReadFrequently: true });
    cvsCtxOptimzed.current = optimizedImageCanvasRef.current.getContext('2d', { willReadFrequently: true });

    if (cvsCtxOptimzed.current) {
      cvsCtxOptimzed.current.drawImage(
        imageRef.current,
        0,
        0,
        optimizedImageCanvasRef.current.width,
        optimizedImageCanvasRef.current.height
      );
      optimizedImageData.current = cvsCtxOptimzed.current.getImageData(
        0,
        0,
        optimizedImageCanvasRef.current.width,
        optimizedImageCanvasRef.current.height
      );
    }

    if (cvsCtxOriginal.current) {
      cvsCtxOriginal.current.drawImage(
        imageRef.current,
        0,
        0,
        originalImageCanvasRef.current.width,
        originalImageCanvasRef.current.height
      );
      originalImageData.current = cvsCtxOriginal.current.getImageData(
        0,
        0,
        originalImageCanvasRef.current.width,
        originalImageCanvasRef.current.height
      );

      filterImageData.current = new ImageData(
        new Uint8ClampedArray(originalImageData.current.data, originalImageData.current.data.length),
        originalImageCanvasRef.current.width,
        originalImageData.current.height
      );

      adjusmentsImageData.current = new ImageData(
        new Uint8ClampedArray(originalImageData.current.data, originalImageData.current.data.length),
        originalImageCanvasRef.current.width,
        originalImageData.current.height
      );
    }

    if (cvsCtxMkup.current) cvsCtxMkup.current.lineCap = cvsCtxMkup.current.lineJoin = 'round';

    const firstHistoryStep = getFirtsHistoryStep(imageRef.current.width, imageRef.current.height, originalAspectRatio);

    const firstJSONHistoryStep = {
      value: JSON.stringify(firstHistoryStep),
      type: 0,
    };

    historyRef.current.push(firstJSONHistoryStep);

    setSelectedHistoryCropStep(firstHistoryStep);
  }, [
    isImageLoaded,
    imageRef.current,
    canvasMarkupRef.current,
    optimizedImageCanvasRef.current,
    originalImageCanvasRef.current,
  ]);

  const addToHistory = (historyStep: ICropHistory | IAdjustments | IMarkupLine[] | IFilterHistory, type: number) => {
    // If current index is not latest - rewrite history from current index

    let isRewritingHistory = false;
    if (historyIndex.current < historyRef.current.length - 1) {
      historyRef.current.splice(historyIndex.current + 1, historyRef.current.length - 1);
      isRewritingHistory = true;
    }
    const historyLength = historyRef.current.length;

    //Add value to array
    historyRef.current.push({ value: JSON.stringify(historyStep), type });

    historyIndex.current = historyLength;

    switch (type) {
      case 1:
        historyIndexesState.current.adjustment = historyIndex.current;
        break;
      case 2:
        historyIndexesState.current.markup = historyIndex.current;
        break;
      case 3:
        historyIndexesState.current.filter = historyIndex.current;
        break;
    }

    //Enable Undo Button
    setIsUndoAvailable(historyRef.current.length - 1 > 0);

    //Disable Redo if history is rewrited
    setIsRedoAvailable(false);
    if (!isFirstPositionInitialized.current) isFirstPositionInitialized.current = true;
    if (isRewritingHistory) {
    }
  };

  const applyFilterOnImageData = (filter: IFilterHistory) => {
    const filterCandidate = filtersList.find((f) => f.id === filter.filterId) || filtersList[0];

    if (filterCandidate && filterCandidate.filter && filterImageData.current) {
      const sourceImageData = wasAdjusted.current ? adjusmentsImageData.current : originalImageData.current;
      if (sourceImageData) {
        filterCandidate.filter(filter.intensity, sourceImageData.data, filterImageData.current.data);
        wasFiltered.current = true;
      }
    }
  };

  const applyAdjustmentsWithFilterOnImageData = (adjustments: IAdjustments, filter?: IFilterHistory) => {
    if (!adjusmentsImageData.current || !originalImageData.current) return;
    getAdjustedImageData(
      originalImageData.current,
      adjusmentsImageData.current,
      adjustments,
      oldSharpnessValue,
      adjusmentsSharpnessImageData,
      filter,
      filterImageData.current
    );
    wasAdjusted.current = true;
  };

  const applyMarkupOnCanvas = (cropStep: ICropHistory, lines: IMarkupLine[]) => {
    if (!cvsCtxMkup.current || !lines || !cropStep) return;
    drawMarkupRelativeToImage(cvsCtxMkup.current, lines, cropStep.rotated);
  };

  const moveInHistory = (isBack: boolean) => {
    let stepIndex = historyIndex.current;
    let updateHistory = false;
    if (isBack) {
      if (historyIndex.current > 0) {
        historyIndex.current--;
        stepIndex--;
        updateHistory = true;
      }
    } else {
      if (historyIndex.current < historyRef.current.length - 1) {
        historyIndex.current++;
        stepIndex++;
        updateHistory = true;
      }
    }
    if (updateHistory) {
      updateHistoryStep(stepIndex, tab);
      setIsUndoAvailable(historyIndex.current > 0);
      setIsRedoAvailable(historyIndex.current < historyRef.current.length - 1);
    }
  };

  const handleResetToFirstStep = () => {
    let stepIndex = 0;
    let updateHistory = false;
    if (historyIndex.current) {
      updateHistory = true;
      historyIndex.current = 0;
    }

    if (updateHistory) {
      updateHistoryStep(stepIndex, tab);
      setIsUndoAvailable(historyIndex.current > 0);
      setIsRedoAvailable(historyIndex.current < historyRef.current.length - 1);
    }
  };

  const handleSetTab = (t: ETabs) => {
    historyIndexesState.current.adjustment = 0;
    historyIndexesState.current.markup = 0;
    historyIndexesState.current.filter = 0;
    historyIndexesState.current.crop = -1;
    useImgeAsCanvasType.current = 0;
    resetAdjustementsValues();

    setTab(t);
    updateHistoryStep(historyIndex.current, t);
  };

  const handleUndo = () => {
    moveInHistory(true);
  };

  const handleRedo = () => {
    moveInHistory(false);
  };

  const [zoomTrigger, setZoomTrigger] = useState(0);

  const handleClickZoomIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    setZoomTrigger(zoomTrigger + 1);
    e.stopPropagation();
  };

  const handleClickZoomOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    setZoomTrigger(zoomTrigger - 1);
    e.stopPropagation();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.code === 'KeyZ') moveInHistory(!event.shiftKey);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [tab]);

  const getImageToRender = () => {
    if (originalImageCanvasRef.current)
      if (wasAdjusted.current || wasFiltered.current) return originalImageCanvasRef.current;
    return;
  };

  const canvasAsImage = getImageToRender();

  useEffect(() => {
    setIsModified?.(isUndoAvailable);
  }, [isUndoAvailable]);

  const saveImage = () => {
    if (!historyIndex.current || !imageRef.current) return;
    historyIndexesState.current.adjustment = 0;
    historyIndexesState.current.markup = 0;
    historyIndexesState.current.filter = 0;
    historyIndexesState.current.crop = -1;
    useImgeAsCanvasType.current = 0;
    resetAdjustementsValues();

    const historyCrop = findLastHistoryStep(historyIndex.current, 0, historyRef.current) || {
      value: historyRef.current[0].value,
      index: 0,
    };
    const historyCropValue = JSON.parse(historyCrop.value) as ICropHistory;

    const cropStep = getNullObject();
    cropStep.crop.width = Math.floor(imageRef.current.width * historyCropValue.cropWidth);
    cropStep.crop.height = cropStep.crop.width / historyCropValue.cropAR;
    cropStep.parentSize.width = cropStep.crop.width;
    cropStep.parentSize.height = cropStep.crop.height;
    cropStep.Origin.x = cropStep.crop.width / 2;
    cropStep.Origin.y = cropStep.crop.height / 2;

    loadHistoryStepPosition(cropStep, historyCropValue, 2, true);
    const canvas = document.createElement('canvas');
    canvas.width = cropStep.crop.width;
    canvas.height = cropStep.crop.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;

      updateHistoryStep(historyIndex.current, 0);
      const markupCanvas = selectedHistoryMarkupStep && canvasMarkupRef.current ? canvasMarkupRef.current : undefined;
      canvasDrawImage(getImageToRender(), markupCanvas, imageRef.current, cropStep, 0, ctx, true);

      const dataUrl = canvas.toDataURL('image/webp', 1.0);

      // Convert Base64 data URL to a Blob
      const dataURLToBlob = (dataUrl: string) => {
        const byteString = atob(dataUrl.split(',')[1]); // Decode Base64
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]; // Extract MIME type

        const buffer = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          buffer[i] = byteString.charCodeAt(i);
        }

        return new Blob([buffer], { type: mimeString });
      };

      const blob = dataURLToBlob(dataUrl);

      // Create an object URL
      const objectURL = URL.createObjectURL(blob);

      const newImage = {
        ...image,
        image: objectURL,
        imageThumbnail: objectURL,
        thumbnailWidth: canvas.width,
        thumbnailHeight: canvas.height,
        aspectRatio: historyCropValue.cropAR,
      };
      return newImage;
    }
  };

  const handlImageSave = () => {
    if (isUndoAvailable) {
      try {
        const newImage = saveImage();
        if (newImage) onSave(newImage);
      } catch (e) {
        window.alert('Something went wrong :(');
      }
    }
  };

  return (
    <>
      <div className={styles.root}>
        <canvas ref={originalImageCanvasRef} hidden />
        <canvas ref={optimizedImageCanvasRef} hidden />
        <canvas ref={canvasMarkupRef} hidden />
        <img hidden crossOrigin="anonymous" src={image.image} ref={imageRef} onLoad={imageOnLoad} />
        <div className={styles.header}>
          <div className={styles.header__body}>
            <div className={styles.zoomTools}>
              {tab === ETabs.crop && (
                <>
                  <button className={styles.zoomTools__in} onClick={handleClickZoomIn}>
                    <ZoomInSvg />
                  </button>
                  <button className={styles.zoomTools__out} onClick={handleClickZoomOut}>
                    <ZoomOutSvg />
                  </button>
                </>
              )}
              <button
                className={classNames(styles.zoomTools__reset, isUndoAvailable && styles.active)}
                onClick={handleResetToFirstStep}
              >
                Reset
              </button>
              <button
                className={classNames(styles.zoomTools__undo, isUndoAvailable && styles.active)}
                onClick={handleUndo}
              >
                <RevertSvg />
              </button>
              <button
                className={classNames(styles.zoomTools__redo, isRedoAvailable && styles.active)}
                onClick={handleRedo}
              >
                <RevertSvg />
              </button>
            </div>
            <div className={styles.saveTools}>
              <button
                className={classNames(
                  styles.saveTools__save,
                  btnStyles.greenSolid,
                  !isUndoAvailable && styles.disabled
                )}
                onClick={handlImageSave}
              >
                Save
              </button>
            </div>
          </div>
          <Tabs tab={tab} setTab={handleSetTab} />
        </div>
        {!selectedHistoryCropStep ? (
          <Loader height={200} size={200} />
        ) : (
          <div className={styles.tabContent}>
            <TabItems
              originalAspectRatio={originalAspectRatio}
              tab={tab}
              zoomTrigger={zoomTrigger}
              canvasAsImage={canvasAsImage}
              optimizedImageData={optimizedImageData.current}
              selectedHistoryCropStep={selectedHistoryCropStep}
              selectedHistoryAdjStep={selectedHistoryAdjStep}
              selectedHistoryMarkupStep={selectedHistoryMarkupStep}
              selectedHistoryFilterStep={selectedHistoryFilterStep}
              imageRef={imageRef}
              canvasMarkup={canvasMarkupRef.current || undefined}
              addToHistory={addToHistory}
            />
          </div>
        )}
        <div className={styles.bottom}>
          <div className={styles.zoomTools}>
            {tab === ETabs.crop && (
              <>
                <button className={styles.zoomTools__in} onClick={handleClickZoomIn}>
                  <ZoomInSvg />
                </button>
                <button className={styles.zoomTools__out} onClick={handleClickZoomOut}>
                  <ZoomOutSvg />
                </button>
              </>
            )}
            <button
              className={classNames(styles.zoomTools__reset, isUndoAvailable && styles.active)}
              onClick={handleResetToFirstStep}
            >
              Reset
            </button>
            <button
              className={classNames(styles.zoomTools__undo, isUndoAvailable && styles.active)}
              onClick={handleUndo}
            >
              <RevertSvg />
            </button>
            <button
              className={classNames(styles.zoomTools__redo, isRedoAvailable && styles.active)}
              onClick={handleRedo}
            >
              <RevertSvg />
            </button>
          </div>
          <div className={styles.saveTools}>
            <button
              className={classNames(styles.saveTools__save, isUndoAvailable && styles.active)}
              onClick={handlImageSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageEditor2;
