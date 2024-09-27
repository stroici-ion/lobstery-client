import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import {
  IAdjustments,
  IAspectRatio,
  ICropHistory,
  IEditorStep,
  IFilterHistory,
  IMarkupLine,
  IPosition,
} from '../../types/interfaces';
import { loadHistoryStepPosition } from '../../historyFunctions/loadHistoryStepPosition';
import { initialCanvasContextLoad } from './core/actions/initialCanvasContextLoad';
import { getCurentHistoryStep } from './core/actions/addCropStateToHistory';
import { initailPostitionLoad } from './core/actions/initailPostitionLoad';
import { getNullObject } from '../../initialStateFunctions/getNullObject';
import { setCropAspectRatio } from './core/actions/setCropAspectRatio';
import { getCursorStyle } from './core/mouseMoveType/getCursorStyle';
import { resetActions } from './core/resetFunctions/resetActions';
import { getMoveType } from './core/mouseMoveType/getMoveType';
import { EnumAspectRatios } from '../../types/enumerations';
import { canvasDrawDegrees } from './core/draw/drawDegrees';
import { FlipVerticalSvg, RotateSvg } from '../../icons';
import { canvasDrawImage } from './core/draw/drawImage';
import { fillParent } from './core/actions/fillParent';
import { canvasDrawCrop } from './core/draw/drawCrop';
import { mouseMoove } from './core/actions/mouseMove';
import { aspectRatioList } from '../AspectRatiosList';
import { imageFlip } from './core/actions/imageFlip';
import { mouseDown } from './core/actions/mouseDown';
import { imageZoom } from './core/actions/imageZoom';
import AspectRatiosPanel from '../AspectRatiosPanel';
import { mouseUp } from './core/actions/mouseUp';
import { rotate } from './core/actions/rotate';
import styles from './styles.module.scss';
import { dpr } from '../../consts';

interface ICrop {
  zoomTrigger: number;
  canvasAsImage?: HTMLCanvasElement;
  markupCanvas?: HTMLCanvasElement;
  historyCropState: ICropHistory;
  historyMarkupState?: IMarkupLine[];
  historyFilterState?: IFilterHistory;
  historyAdjustmentState?: IAdjustments;
  imageRef: React.RefObject<HTMLImageElement>;
  addToHistory: (historyStep: ICropHistory, type: number) => void;
}

const Crop: React.FC<ICrop> = ({
  zoomTrigger,
  canvasAsImage,
  markupCanvas,
  historyCropState,
  historyMarkupState,
  historyFilterState,
  historyAdjustmentState,
  addToHistory,
  imageRef,
}) => {
  const [isPanelVisible, setIsPanelVisible] = useState<Boolean>(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<IAspectRatio>(aspectRatioList[0]);

  const bottomRef = useRef<HTMLDivElement>(null);

  const iamgeCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const adjustedImageRef = useRef<HTMLImageElement>(null);

  const degreesCanvasRef = useRef<HTMLCanvasElement>(null);
  const parentDivRef = useRef<HTMLDivElement>(null);

  let imageCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  let cropCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  let degreesCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const degressColor = useRef('rgba(0,0,0,1)');

  const cropStepRef = useRef<IEditorStep>(getNullObject());
  const cropStep = cropStepRef.current;
  const isMouseDown = useRef<boolean>(false);
  const activeActions = cropStepRef.current.activeActions;

  const startCursor = useRef<IPosition>({ x: 0, y: 0 });
  const scrollDeltaYSum = useRef<number>(0);
  const parentPositiom = useRef<IPosition>({ x: 0, y: 0 });
  const reininitializePosition = useRef(true);

  useEffect(() => {
    if (historyCropState && !reininitializePosition.current) {
      historyStepLoad();
      drawImage();
      drawDegrees();
    }
  }, [historyCropState, historyAdjustmentState, historyMarkupState, historyFilterState]);

  const setCropInitialPosition = () => {
    if (!iamgeCanvasRef.current || !cropCanvasRef.current || !imageRef.current || !parentDivRef.current) return;

    //Get initail position determinated by div parent (Origin, width, height) that is changed when window is resized
    initailPostitionLoad(
      cropStep,
      imageRef.current,
      iamgeCanvasRef.current,
      cropCanvasRef.current,
      parentDivRef.current
    );

    //Get initail styles and context of canvas
    initialCanvasContextLoad(imageCtxRef, cropCtxRef, iamgeCanvasRef.current, cropCanvasRef.current);

    //Load position based on history step (If is flipped, rotated, and ...)
    historyStepLoad();
  };

  const historyStepLoad = () => {
    if (!imageRef.current) return;
    loadHistoryStepPosition(cropStep, historyCropState);
    const candidateAR = aspectRatioList.find((ar) => ar.id === historyCropState.cropARId);
    if (candidateAR) setSelectedAspectRatio(candidateAR);
    drawImage();
  };

  useEffect(() => {
    window.addEventListener('mouseup', canvasOnMouseUp);
    window.addEventListener('mousemove', canvasOnMouseMove);
    window.addEventListener('mousedown', canvasOnMouseDown);

    window.addEventListener('touchstart', canvasOnTouchDown);
    window.addEventListener('touchmove', canvasOnTouchMoove, { passive: false });
    window.addEventListener('touchend', canvasOnMouseUp);

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('wheel', canvasWheel, { passive: false });
    return () => {
      window.removeEventListener('mouseup', canvasOnMouseUp);
      window.removeEventListener('mousemove', canvasOnMouseMove);
      window.removeEventListener('mousedown', canvasOnMouseDown);

      window.removeEventListener('touchstart', canvasOnTouchDown);
      window.removeEventListener('touchmove', canvasOnTouchMoove);
      window.removeEventListener('touchend', canvasOnMouseUp);

      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('wheel', canvasWheel);
    };
  }, []);

  const onWindowResize = () => {
    if (window.innerWidth < 800) reininitializePosition.current = true;
    setCropInitialPosition();
    reininitializePosition.current = false;
  };

  useEffect(() => {
    if (!parentDivRef.current || !iamgeCanvasRef.current) return;

    const parentElement = parentDivRef.current.getBoundingClientRect();
    if (parentElement) {
      parentPositiom.current.x = Math.floor(parentElement.left);
      parentPositiom.current.y = Math.floor(parentElement.top);
    }
    if (reininitializePosition.current) {
      setCropInitialPosition();
      reininitializePosition.current = false;
    }
  }, [parentDivRef.current, iamgeCanvasRef.current]);

  useEffect(() => {
    if (degreesCanvasRef.current) {
      degreesCtxRef.current = degreesCanvasRef.current.getContext('2d');
      degreesCanvasRef.current.width = 800 * dpr;
      degreesCanvasRef.current.height = 60 * dpr;
      degreesCanvasRef.current.style.width = '800px';
      degreesCanvasRef.current.style.height = '60px';
      degressColor.current = window.getComputedStyle(degreesCanvasRef.current).getPropertyValue('color');

      drawDegrees();
    }
  }, [degreesCanvasRef.current]);

  const drawImage = (opacity: number = 0.8, animationAngle: number = 0) => {
    if (!cropCtxRef.current || !imageCtxRef.current || !imageRef.current) return;
    const useCanvasAsImage =
      !!canvasAsImage && (historyFilterState || historyAdjustmentState) ? canvasAsImage : undefined;
    const useMarkup = historyMarkupState?.length ? markupCanvas : undefined;

    canvasDrawCrop(cropStep, opacity, animationAngle, cropCtxRef.current);
    canvasDrawImage(useCanvasAsImage, useMarkup, imageRef.current, cropStep, animationAngle, imageCtxRef.current);
  };

  const drawDegrees = () => {
    if (degreesCtxRef.current && degreesCanvasRef.current) {
      canvasDrawDegrees(degreesCtxRef.current, cropStep.angle.angle, degressColor.current);
    }
  };

  const addCropStateToHistory = () => {
    //Get
    const historyStep = getCurentHistoryStep(cropStep);
    addToHistory(historyStep, 0);
  };

  const canvasOnMouseDown = (event: MouseEvent) => {
    if (activeActions.isAnimation) return;
    if (event.target !== cropCanvasRef.current && event.target !== degreesCanvasRef.current) return;

    isMouseDown.current = true;
    const cursor: IPosition = {
      x: event.clientX - parentPositiom.current.x,
      y: event.clientY - parentPositiom.current.y,
    };
    mouseDown(cursor, startCursor.current, cropStep, drawImage);
  };

  const canvasOnTouchDown = (event: TouchEvent) => {
    if (activeActions.isAnimation) return;
    if (event.target !== cropCanvasRef.current && event.target !== degreesCanvasRef.current) return;

    isMouseDown.current = true;
    const cursor: IPosition = {
      x: event.touches[0].clientX - parentPositiom.current.x,
      y: event.touches[0].clientY - parentPositiom.current.y,
    };

    mouseDown(cursor, startCursor.current, cropStep, drawImage);
  };

  const canvasOnMouseMove = (event: MouseEvent) => {
    if (activeActions.isAnimation) return;

    const cursor: IPosition = {
      x: event.clientX - parentPositiom.current.x,
      y: event.clientY - parentPositiom.current.y,
    };
    if (cropStep.activeActions.isCroping) {
      const cursorDistance = {
        x: (cursor.x - startCursor.current.x) * dpr,
        y: (cursor.y - startCursor.current.y) * dpr,
      };
      mouseMoove(cursor, cursorDistance, cropStep, drawDegrees, drawImage);
      return;
    }
    document.body.style.cursor = getCursorStyle(getMoveType(cursor, cropStep));
  };

  const canvasOnTouchMoove = (event: TouchEvent) => {
    if (bottomRef.current && !bottomRef.current.contains(event.targetTouches[0].target as Node)) {
      event.preventDefault();
    }

    if (activeActions.isAnimation) return;

    const cursor: IPosition = {
      x: event.touches[0].clientX - parentPositiom.current.x,
      y: event.touches[0].clientY - parentPositiom.current.y,
    };

    if (cropStep.activeActions.isCroping) {
      const cursorDistance = {
        x: (cursor.x - startCursor.current.x) * dpr,
        y: (cursor.y - startCursor.current.y) * dpr,
      };
      mouseMoove(cursor, cursorDistance, cropStep, drawDegrees, drawImage);
      return;
    }
  };

  const canvasOnMouseUp = () => {
    if (!isMouseDown.current) return;
    mouseUp(cropStep, drawImage, addCropStateToHistory);
    isMouseDown.current = false;
  };

  //Flip vertical
  const handleFlipHorizontal = (e: React.MouseEvent<HTMLButtonElement>) => handleFlipImage(true);

  //Flip vertical
  const handleFlipVertical = (e: React.MouseEvent<HTMLButtonElement>) => handleFlipImage(false);

  const handleFlipImage = (isHorizontal: boolean) => {
    activeActions.isChangingAspectRatio = false;
    activeActions.isChangingAngle = false;
    activeActions.isZooming = false;
    resetActions(cropStep);
    imageFlip(isHorizontal, cropStep, drawDegrees, drawImage);
    addCropStateToHistory();
  };

  //Rotate
  const handleRotateImage = (isRotateLeft: boolean) => {
    if (activeActions.isAnimation) return;

    activeActions.isChangingAspectRatio = false;
    activeActions.isChangingAngle = false;
    activeActions.isZooming = false;

    resetActions(cropStep);
    rotate(isRotateLeft, cropStep, setSelectedAspectRatio, drawImage, addCropStateToHistory);
    // addToHistory(cropStep);
  };

  const handleRotateLeft = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleRotateImage(true);
  };

  const handleRotateRight = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleRotateImage(false);
  };

  //Change Crop Aspect Ratio
  const handleSetCropAspectRatio = (aspectRatio: EnumAspectRatios) => {
    if (!activeActions.isChangingAspectRatio) {
      activeActions.isChangingAspectRatio = true;
      activeActions.isChangingAngle = false;
      activeActions.isZooming = false;
      resetActions(cropStep);
    }
    const setAspectRatioCallback = (aspectRatio: IAspectRatio) => {
      setSelectedAspectRatio(aspectRatio);
      fillParent(cropStep, () => drawImage(), addCropStateToHistory);
    };
    setCropAspectRatio(cropStep, aspectRatio, setAspectRatioCallback);
    // addToHistory(cropStep);
  };

  //Show/Hide Aspect Ratio Panel
  const toggleAspectRatioPanel = () => {
    if (isPanelVisible) {
      setIsPanelVisible(false);
    } else {
      setIsPanelVisible(true);
    }
  };

  const handleShowAspectRatioPanel = () => toggleAspectRatioPanel();

  const handleHideAspectRatioPanel = () => toggleAspectRatioPanel();

  //Zoom action
  const handleImageZoom = (isZoomIn: boolean) => {
    imageZoom(isZoomIn, cropStep, () => drawImage(0.8));
    addCropStateToHistory?.();
  };

  const oldZoomTriggerValue = useRef(0);
  useEffect(() => {
    if (zoomTrigger !== oldZoomTriggerValue.current) {
      handleClickZoom(zoomTrigger > oldZoomTriggerValue.current);
    }
    oldZoomTriggerValue.current = zoomTrigger;
  }, [zoomTrigger]);

  //Zoom Image Wheell
  const canvasWheel = (e: WheelEvent) => {
    const crop = cropStep.crop;
    if (!activeActions.isCroping) {
      if (!activeActions.isZooming) {
        activeActions.isZooming = true;
        activeActions.isChangingAspectRatio = false;
        activeActions.isChangingAngle = false;
        resetActions(cropStep);
        if (crop.aspectRatioId === EnumAspectRatios.free) {
          crop.aspectRatio = crop.width / crop.height;
        }
      }
      scrollDeltaYSum.current += e.deltaY;
      if (scrollDeltaYSum.current >= 10 || scrollDeltaYSum.current <= -10) {
        handleImageZoom(scrollDeltaYSum.current < 0);
        scrollDeltaYSum.current = 0;
      }
      e.preventDefault();
    }
  };

  //Zoom Image Buttons
  const handleClickZoom = (isZoomIn: boolean) => {
    const crop = cropStep.crop;
    if (!activeActions.isCroping) {
      if (!activeActions.isZooming) {
        activeActions.isZooming = true;
        activeActions.isChangingAspectRatio = false;
        activeActions.isChangingAngle = false;
        resetActions(cropStep);
        if (crop.aspectRatioId === EnumAspectRatios.free) {
          crop.aspectRatio = crop.width / crop.height;
        }
      }
      handleImageZoom(isZoomIn);
    }
  };

  return (
    <div className={styles.root}>
      <img ref={adjustedImageRef} hidden />
      <div className={styles.body}>
        <div className={styles.canvas} ref={parentDivRef}>
          <canvas ref={iamgeCanvasRef} className={styles.canvas__image} />
          <canvas ref={cropCanvasRef} className={styles.canvas__crop} />
        </div>
      </div>
      <div className={styles.bottom} ref={bottomRef}>
        {isPanelVisible && (
          <AspectRatiosPanel
            selected={selectedAspectRatio?.id}
            setAspectRatio={handleSetCropAspectRatio}
            hide={handleHideAspectRatioPanel}
          />
        )}
        <div className={classNames(styles.cropTools, isPanelVisible && styles.hidden)}>
          <div className={styles.degrees}>
            <canvas className={styles.degrees__canvas} ref={degreesCanvasRef} />
          </div>
          <div className={styles.cropTools__body}>
            <div className={classNames(styles.cropTools__rotate, styles.rotateTools)}>
              <button className={styles.rotateTools__left} onClick={handleRotateLeft}>
                <RotateSvg />
              </button>
              <button className={styles.rotateTools__right} onClick={handleRotateRight}>
                <RotateSvg />
              </button>
            </div>
            <button className={styles.cropTools__aspectRatio} onClick={handleShowAspectRatioPanel}>
              {selectedAspectRatio.icon}
              {selectedAspectRatio.title}
            </button>
            <div className={classNames(styles.tools__flip, styles.flipTools)}>
              <button className={styles.flipTools__horizontal} onClick={handleFlipHorizontal}>
                <FlipVerticalSvg />
              </button>
              <button className={styles.flipTools__vertical} onClick={handleFlipVertical}>
                <FlipVerticalSvg />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crop;
