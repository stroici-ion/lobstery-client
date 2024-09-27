export const initialCanvasContextLoad = (
  canvasCtx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  markupCanvasCtx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  canvas: HTMLCanvasElement,
  markupCanvas: HTMLCanvasElement
) => {
  canvasCtx.current = canvas.getContext('2d', { willReadFrequently: true });
  markupCanvasCtx.current = markupCanvas.getContext('2d');
  if (markupCanvasCtx.current) {
    markupCanvasCtx.current.lineCap = markupCanvasCtx.current.lineJoin = 'round';
    markupCanvasCtx.current.imageSmoothingEnabled = true;
    markupCanvasCtx.current.imageSmoothingQuality = 'high';
  }
};
