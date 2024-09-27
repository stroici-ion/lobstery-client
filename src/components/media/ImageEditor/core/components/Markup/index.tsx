import { useCallback, useEffect, useRef, useState } from 'react';

import {
  IAdjustments,
  ICropHistory,
  IEditorStep,
  IFilterHistory,
  IMarkupBrush,
  IMarkupLine,
  IMarkupTool,
  IPosition,
} from '../../types/interfaces';
import { loadHistoryStepPosition } from '../../historyFunctions/loadHistoryStepPosition';
import { initialCanvasContextLoad } from './core/actions/initialCanvasContextLoad';
import { initailPostitionLoad } from './core/actions/initailPostitionLoad';
import { getNullObject } from '../../initialStateFunctions/getNullObject';
import { drawMarkupLines } from '../../drawFunctions/drawMarkupLines';
import { getRelativePoint } from './core/functions/getRelativePoint';
import { canvasDrawImage } from '../Crop/core/draw/drawImage';
import { EnumMarkupToolType } from '../../types/enumerations';
import { eraseByPoint } from './core/actions/eraseByPoint';
import MarkupTools from './core/components/MarkupTools';
import { endDrawing } from './core/actions/endDrawing';
import { mouseMove } from './core/actions/mouseMove';
import { mouseDown } from './core/actions/mouseDown';
import { eraseAll } from './core/actions/eraseAll';
import styles from './styles.module.scss';
import { dpr } from '../../config';

interface IMarkup {
  canvasAsImage?: HTMLCanvasElement;
  imageRef: React.MutableRefObject<HTMLImageElement | null>;
  historyCropState: ICropHistory;
  historyAdjustmentState?: IAdjustments;
  historyFilterState?: IFilterHistory;
  historyMarkupState?: IMarkupLine[];
  addToHistory: (stepString: IMarkupLine[], type: number) => void;
}

const Markup: React.FC<IMarkup> = ({
  canvasAsImage,
  imageRef,
  historyCropState,
  historyAdjustmentState,
  historyMarkupState,
  historyFilterState,
  addToHistory,
}) => {
  const cropStepRef = useRef<IEditorStep>(getNullObject());
  const cropStep = cropStepRef.current;

  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [activeBrush, setActiveBrush] = useState<IMarkupBrush>();
  const [activeTool, setActiveTool] = useState<IMarkupTool>();

  const parentDivRef = useRef<HTMLDivElement>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentPosition = useRef<IPosition>({ x: 0, y: 0 });
  const isDrawing = useRef<boolean>(false);
  const lines = useRef<IMarkupLine[]>([]);
  const previewLine = useRef<IPosition[]>([]);

  let imageCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  let canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  let previewCanvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const drawImage = () => {
    if (!imageCanvasCtxRef.current || !imageRef.current) return;
    canvasDrawImage(canvasAsImage, undefined, imageRef.current, cropStep, 0, imageCanvasCtxRef.current, true);
  };

  const drawMarkup = () => {
    if (!canvasCtxRef.current) return;
    drawMarkupLines(cropStep, canvasCtxRef.current, lines.current);
  };

  const addMarkupStateToHistory = () => {
    addToHistory(lines.current, 2);
  };

  const setCropInitialPosition = () => {
    if (
      !imageRef.current ||
      !imageCanvasRef.current ||
      !canvasRef.current ||
      !previewCanvasRef.current ||
      !parentDivRef.current
    )
      return;

    //Get initail position determinated by div parent (Origin, width, height) that is changed when window is resized
    initailPostitionLoad(
      cropStep,
      imageRef.current,
      imageCanvasRef.current,
      canvasRef.current,
      previewCanvasRef.current,
      parentDivRef.current
    );

    //Get initail styles and context of canvas
    initialCanvasContextLoad(
      imageCanvasCtxRef,
      canvasCtxRef,
      previewCanvasCtxRef,
      imageCanvasRef.current,
      canvasRef.current,
      previewCanvasRef.current
    );
    setIsInitialized(true);
    //Load position based on history step (If is flipped, rotated, and ...)
    historyCropStepLoad();
  };

  const historyCropStepLoad = () => {
    if (!imageRef.current) return;

    loadHistoryStepPosition(cropStep, historyCropState, 1, true);
    drawImage();
    drawMarkup();
  };

  const reininitializePosition = useRef(true);
  useEffect(() => {
    if (historyCropState && !reininitializePosition.current) {
      historyCropStepLoad();
      drawImage();
    }
  }, [historyCropState, historyAdjustmentState, historyFilterState]);

  useEffect(() => {
    if (historyMarkupState) {
      lines.current = historyMarkupState;
      drawMarkup();
    } else {
      if (!reininitializePosition.current) {
        lines.current = [];
        drawMarkup();
      }
    }
  }, [historyMarkupState]);

  useEffect(() => {
    if (parentDivRef.current) {
      const parentElement = parentDivRef.current.getBoundingClientRect();
      if (parentElement) {
        parentPosition.current.x = Math.floor(parentElement.left);
        parentPosition.current.y = Math.floor(parentElement.top);
      }

      if (reininitializePosition.current) {
        setCropInitialPosition();
        if (historyMarkupState) {
          lines.current = historyMarkupState;
          drawMarkup();
        }
        reininitializePosition.current = false;
      }
    }
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeBrush) return;
    if (!previewCanvasCtxRef.current) return;

    const cursor: IPosition = {
      x: (e.clientX - parentPosition.current.x) * dpr,
      y: (e.clientY - parentPosition.current.y) * dpr,
    };

    isDrawing.current = true;

    mouseDown(previewCanvasCtxRef.current, cursor, prevPoint.current, previewLine);
  };

  const prevPoint = useRef<IPosition>({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing.current || !activeBrush) return;

    if (!previewCanvasCtxRef.current) return;

    const cursor: IPosition = {
      x: (e.clientX - parentPosition.current.x) * dpr,
      y: (e.clientY - parentPosition.current.y) * dpr,
    };

    mouseMove(previewCanvasCtxRef.current, cursor, prevPoint.current, previewLine.current, activeBrush);
  };

  const handleEndDrawing = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (!previewCanvasCtxRef.current || !canvasCtxRef.current || !activeBrush) return;

    const cursor: IPosition = {
      x: (e.clientX - parentPosition.current.x) * dpr,
      y: (e.clientY - parentPosition.current.y) * dpr,
    };

    endDrawing(
      previewCanvasCtxRef.current,
      canvasCtxRef.current,
      cursor,
      previewLine,
      lines.current,
      activeBrush,
      cropStep
    );
    addMarkupStateToHistory();
  };

  const setActiveBrushCallback = useCallback((brush: IMarkupBrush) => {
    setActiveTool(undefined);
    setActiveBrush(brush);
    const previewCtx = previewCanvasCtxRef.current;
    const ctx = canvasCtxRef.current;

    if (!previewCtx || !ctx) return;

    previewCtx.strokeStyle = ctx.strokeStyle = brush.color;
    previewCtx.lineWidth = brush.size;
  }, []);

  const setActiveToolCallback = (tool: IMarkupTool) => {
    setActiveTool(tool);
    setActiveBrush(undefined);
  };

  const handleMouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeTool) return;
    const previewCtx = previewCanvasCtxRef.current;
    const ctx = canvasCtxRef.current;
    if (!previewCtx || !ctx) return;

    const cursor: IPosition = {
      x: (e.clientX - parentPosition.current.x) * dpr,
      y: (e.clientY - parentPosition.current.y) * dpr,
    };

    switch (activeTool.type) {
      case EnumMarkupToolType.erase: {
        const image_O = {
          x: cropStep.Origin.x - cropStep.image.x,
          y: cropStep.Origin.y - cropStep.image.y,
        };

        const point = getRelativePoint(cursor, cropStep.Origin, cropStep.image, image_O);

        eraseByPoint(ctx, lines, point);
        addMarkupStateToHistory();
        drawImage();
        drawMarkup();
        break;
      }
    }
  };

  const handleToolClick = (tool: IMarkupTool) => {
    const ctx = canvasCtxRef.current;
    if (tool.type === EnumMarkupToolType.eraseAll && ctx) eraseAll(ctx, lines);
    addMarkupStateToHistory();
    drawImage();
    drawMarkup();
  };

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  const onWindowResize = () => {
    reininitializePosition.current = true;
    setCropInitialPosition();
    reininitializePosition.current = false;
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.root__body}
        ref={parentDivRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={handleEndDrawing}
        onMouseUp={handleEndDrawing}
        onClick={handleMouseClick}
      >
        <canvas className={styles.imageCanvas} ref={imageCanvasRef} />
        <canvas className={styles.canvas} ref={canvasRef} />
        <canvas className={styles.previewCanvas} ref={previewCanvasRef} />
      </div>
      <div className={styles.markupTools}>
        {isInitialized && (
          <div className={styles.markupTools__body}>
            <MarkupTools
              activeBrush={activeBrush}
              setActiveBrush={setActiveBrushCallback}
              activeTool={activeTool}
              setActiveTool={setActiveToolCallback}
              toolClick={handleToolClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default Markup;
