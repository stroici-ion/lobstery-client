import { convertToRadians } from '../calculationFunctions/converters';
import { IEditorStep, IMarkupLine } from '../../types/interfaces';
import { drawMarkupRelativeToCanvas } from './drawMarkupRelativeToCanvas';
import { getEditedImageMarkup } from './getEditedImageMarkup';
import { getEditedImageShape } from './getEditedImageShape';

export const drawMarkupLines = (
  cropStep: IEditorStep,
  ctx: CanvasRenderingContext2D,
  lines: IMarkupLine[],
  clear = false
) => {
  const crop = cropStep.crop;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const eImg = getEditedImageShape(cropStep);
  const editedMarkupShape = getEditedImageMarkup(cropStep);

  const centerX = cropStep.Origin.x;
  const centerY = cropStep.Origin.y;

  const angleInRadians = convertToRadians(eImg.angle);
  ctx.translate(centerX, centerY); // Translate to the center of the selection
  ctx.rotate(angleInRadians); // Apply rotation
  ctx.save();
  ctx.scale(eImg.scaleH, eImg.scaleV);

  drawMarkupRelativeToCanvas(ctx, lines, editedMarkupShape, cropStep);

  ctx.restore();
  ctx.rotate(-angleInRadians);
  ctx.translate(-centerX, -centerY);

  if (clear) {
    ctx.clearRect(0, 0, ctx.canvas.width, crop.y);
    ctx.clearRect(0, crop.y + crop.height, ctx.canvas.width, ctx.canvas.height - (crop.y + crop.height));
    ctx.clearRect(0, 0, crop.x, ctx.canvas.height);
    ctx.clearRect(crop.x + crop.width, 0, ctx.canvas.width - (crop.x + crop.width), ctx.canvas.height);
  }
};
