import { IPosition } from '../../../../types/interfaces';

export const mouseDown = (
  ctx: CanvasRenderingContext2D,
  cursor: IPosition,
  prevPoint: IPosition,
  previewLine: React.MutableRefObject<IPosition[]>
) => {
  ctx.beginPath();
  ctx.moveTo(cursor.x, cursor.y);

  prevPoint.x = cursor.x;
  prevPoint.y = cursor.y;

  previewLine.current = [];
  previewLine.current.push({ ...cursor });
};
