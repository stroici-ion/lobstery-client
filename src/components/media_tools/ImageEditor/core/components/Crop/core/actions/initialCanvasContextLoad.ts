export const initialCanvasContextLoad = (
  imageCtxRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  cropCtxRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  imageCanvas: HTMLCanvasElement,
  cropCanvas: HTMLCanvasElement
) => {
  imageCtxRef.current = imageCanvas.getContext('2d');
  cropCtxRef.current = cropCanvas.getContext('2d');

  if (imageCtxRef.current && cropCtxRef.current) {
    cropCtxRef.current.imageSmoothingEnabled = false;
    imageCtxRef.current.lineJoin = imageCtxRef.current.lineCap = 'round';
    imageCtxRef.current.imageSmoothingQuality = 'high';
  }
};
