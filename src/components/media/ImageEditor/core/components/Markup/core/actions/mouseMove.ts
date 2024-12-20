import { IMarkupBrush, IPosition } from '../../../../../types/interfaces';
import { EMarkupBrushTypes } from '../../../../../types/enums';
import { iEML } from '../../../../config';

export const mouseMove = (
  ctx: CanvasRenderingContext2D,
  cursor: IPosition,
  prevPoint: IPosition,
  previewLine: IPosition[],
  brush: IMarkupBrush
) => {
  if (!ctx) return;
  switch (brush.type) {
    case EMarkupBrushTypes.freeHand:
    case EMarkupBrushTypes.freeHandArrow:
    case EMarkupBrushTypes.freeHandDoubleArrow:
      drawFreeHandLine(ctx, cursor, prevPoint, previewLine);
      break;
    case EMarkupBrushTypes.straight:
    case EMarkupBrushTypes.straightArrow:
    case EMarkupBrushTypes.straightDoubleArrow:
      drawStraightLine(ctx, cursor, previewLine);
      break;
  }
};

const drawFreeHandLine = (
  ctx: CanvasRenderingContext2D,
  cursor: IPosition,
  prevPoint: IPosition,
  previewLine: IPosition[]
) => {
  const distanceX = cursor.x - prevPoint.x;
  const distanceY = cursor.y - prevPoint.y;

  // If the distance is greater than laziness factor, interpolate points
  if (Math.abs(distanceX) > iEML || Math.abs(distanceY) > iEML) {
    // Interpolate points between previous and current coordinates
    const steps = Math.max(Math.abs(distanceX), Math.abs(distanceY));
    const stepX = distanceX / steps;
    const stepY = distanceY / steps;

    // Draw interpolated points
    for (let i = 0; i < steps; i++) {
      const x = prevPoint.x + stepX * i;
      const y = prevPoint.y + stepY * i;
      // Call your drawing function here using x, y
      // You may need to adjust the drawing function to create softer lines
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(x, y);

      previewLine.push({ x, y });
    }

    // Update previous coordinates
    prevPoint.x = cursor.x;
    prevPoint.y = cursor.y;
  }
};

const drawStraightLine = (ctx: CanvasRenderingContext2D, cursor: IPosition, previewLine: IPosition[]) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const firstPoint = previewLine[0];

  ctx.beginPath();
  ctx.moveTo(firstPoint.x, firstPoint.y);
  ctx.lineTo(cursor.x, cursor.y);
  ctx.stroke();
  ctx.closePath();
};
