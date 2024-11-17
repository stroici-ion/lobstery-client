import { EMarkupBrushTypes } from '../../../../../types/enums';
import { IEditorStep, IMarkupBrush, IMarkupLine, IPosition } from '../../../../../types/interfaces';
import { findArrowheadPoints } from '../functions/getArrow';
import { getRelativeLine } from '../functions/getRelativeLine';
import { simplify } from '../functions/smothLine';

export const endDrawing = (
  previewCtx: CanvasRenderingContext2D,
  ctx: CanvasRenderingContext2D,
  cursor: IPosition,
  previewLine: React.MutableRefObject<IPosition[]>,
  lines: IMarkupLine[],
  brush: IMarkupBrush,
  cropStep: IEditorStep
) => {
  previewCtx.clearRect(0, 0, previewCtx.canvas.width, previewCtx.canvas.height);

  let finalLine: IPosition[] = [];

  switch (brush.type) {
    case EMarkupBrushTypes.freeHand:
    case EMarkupBrushTypes.freeHandArrow:
    case EMarkupBrushTypes.freeHandDoubleArrow:
      finalLine = simplify(previewLine.current, 1, true);
      break;
    case EMarkupBrushTypes.straight:
    case EMarkupBrushTypes.straightArrow:
    case EMarkupBrushTypes.straightDoubleArrow:
      finalLine = [previewLine.current[0], cursor];
      break;
  }
  const newLine: IMarkupLine = {
    arrowsLines: { end: [], start: [] },
    relativeArrowsLines: { end: [], start: [] },
    relativeLine: [],
    relativeSize: brush.size / (cropStep.image.rotated % 2 === 0 ? cropStep.image.width : cropStep.image.height),
    line: [...finalLine],
    brush: { size: brush.size, color: brush.color, type: brush.type },
  };

  switch (brush.type) {
    case EMarkupBrushTypes.freeHandDoubleArrow:
    case EMarkupBrushTypes.straightDoubleArrow:
      {
        //Start Arrow
        const arrowStartPoints = findArrowheadPoints(newLine.line, false);
        const arrowEndPoints = findArrowheadPoints(newLine.line);
        newLine.arrowsLines = {
          end: [arrowEndPoints.leftPoint, arrowEndPoints.rightPoint],
          start: [arrowStartPoints.leftPoint, arrowStartPoints.rightPoint],
        };
      }
      break;
    case EMarkupBrushTypes.freeHandArrow:
    case EMarkupBrushTypes.straightArrow:
      {
        //End Arrow
        const arrowEndPoints = findArrowheadPoints(newLine.line);
        newLine.arrowsLines = {
          end: [arrowEndPoints.leftPoint, arrowEndPoints.rightPoint],
          start: [],
        };
      }
      break;
  }

  getRelativeLine(newLine, cropStep);

  lines.push(newLine);

  ctx.lineWidth = newLine.brush.size;
  ctx.strokeStyle = newLine.brush.color;
  ctx.beginPath();
  const line = newLine.line;
  const fisrtPoint = line[0];
  ctx.moveTo(fisrtPoint.x, fisrtPoint.y);
  for (let i = 0; i < line.length; i++) {
    const point = line[i];
    ctx.lineTo(point.x, point.y);
  }

  if (newLine.arrowsLines) {
    if (newLine.arrowsLines.end.length) {
      const lastPoint = newLine.line[newLine.line.length - 1];
      ctx.moveTo(newLine.arrowsLines.end[0].x, newLine.arrowsLines.end[0].y);
      ctx.lineTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(newLine.arrowsLines.end[1].x, newLine.arrowsLines.end[1].y);
    }
    if (newLine.arrowsLines.start.length) {
      ctx.moveTo(newLine.arrowsLines.start[0].x, newLine.arrowsLines.start[0].y);
      ctx.lineTo(newLine.line[0].x, newLine.line[0].y);
      ctx.lineTo(newLine.arrowsLines.start[1].x, newLine.arrowsLines.start[1].y);
    }
  }

  ctx.stroke();
  ctx.closePath();

  previewLine.current = [];
};
