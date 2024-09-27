export const initialCanvasContextLoad = (
  ictx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  mctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  pctx: React.MutableRefObject<CanvasRenderingContext2D | null>,
  ic: HTMLCanvasElement,
  mc: HTMLCanvasElement,
  pc: HTMLCanvasElement
) => {
  ictx.current = ic.getContext('2d');
  mctx.current = mc.getContext('2d');
  pctx.current = pc.getContext('2d');

  if (ictx.current && mctx.current && pctx.current) {
    ictx.current.imageSmoothingQuality = 'high';
    mctx.current.lineJoin = pctx.current.lineJoin = mctx.current.lineCap = pctx.current.lineCap = 'round';
    mctx.current.fillStyle = pctx.current.fillStyle = '#000';
    mctx.current.lineWidth = pctx.current.lineWidth = 5;
  }
};
