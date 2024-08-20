export const initialPreviewFilterPositionLoad = (
  canvas: HTMLCanvasElement,
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>
) => {
  canvas.width = 100;
  canvas.height = 100;
  ctx.current = canvas.getContext('2d');
  if (ctx.current) {
    ctx.current.imageSmoothingEnabled = false;
  }
};
