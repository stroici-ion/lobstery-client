export const initialPreviewFilterPositionLoad = (
  canvas: HTMLCanvasElement,
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>
) => {
  ctx.current = canvas.getContext('2d');
};
