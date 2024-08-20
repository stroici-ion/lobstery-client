import { degrees_to_radians } from '../../../../calculationFunctions/converters';
import { getDistanceToCenter } from '../calculations/maxDistance/distToCenter';
import { IEditorStep } from '../../../../Types/Interfaces';

/**
 * @param adjustedImageCanvas - Adjustments Canvas
 * @param markupCanvas - Markup Canvas
 * @param filterdImage - Filter Canvas
 * @param imageElement - Image to draw
 * @param cropStep - Crop and image positions
 * @param animationAngle - Angle for rotate animation
 * @param ctx - Image Context
 * @param showOnlyCrop - True - only selected image will drawed, False - entire image
 **/

export const canvasDrawImage = (
  adjustedImageCanvas: HTMLCanvasElement | undefined,
  markupCanvas: HTMLCanvasElement | undefined,
  imageElement: HTMLImageElement,
  cropStep: IEditorStep,
  animationAngle: number,
  ctx: CanvasRenderingContext2D,
  showOnlyCrop: boolean = false
) => {
  const Origin = cropStep.Origin;
  const image = cropStep.image;
  const parentSize = cropStep.parentSize;

  const centerX = Origin.x * 1;
  const centerY = Origin.y * 1;
  let rotateX = centerX * 1;
  let rotateY = centerY * 1;

  ctx.clearRect(0, 0, parentSize.width, parentSize.height);

  const eImg = {
    angle: image.angle + animationAngle,
    x: image.x,
    y: image.y,
    width: image.width,
    height: image.height,
    scaleH: 1,
    scaleV: 1,
  };

  if (image.rotated !== 0) {
    const imageDC = getDistanceToCenter(image, Origin);
    let aux = 0;
    switch (image.rotated) {
      case 1:
        aux = eImg.width;
        eImg.width = eImg.height;
        eImg.height = aux;
        eImg.x = Origin.x - imageDC.top;
        eImg.y = Origin.y - imageDC.right;
        eImg.angle += 90;
        break;
      case 2:
        eImg.x = Origin.x - imageDC.right;
        eImg.y = Origin.y - imageDC.bottom;
        eImg.angle += 180;
        break;
      case 3:
        aux = eImg.width;
        eImg.width = eImg.height;
        eImg.height = aux;
        eImg.x = Origin.x - imageDC.bottom;
        eImg.y = Origin.y - imageDC.left;
        eImg.angle += 270;
        break;
    }
  }

  if (image.rotated % 2 !== 0) {
    if (image.flipped.horizontal) {
      eImg.scaleV *= -1;
      eImg.y *= -1;
      eImg.height *= -1;
      rotateY *= -1;
    }

    if (image.flipped.vertical) {
      eImg.scaleH *= -1;
      eImg.x *= -1;
      eImg.width *= -1;
      rotateX *= -1;
    }
  } else {
    if (image.flipped.horizontal) {
      eImg.scaleH *= -1;
      eImg.x *= -1;
      eImg.width *= -1;
      rotateX *= -1;
    }

    if (image.flipped.vertical) {
      eImg.scaleV *= -1;
      eImg.y *= -1;
      eImg.height *= -1;
      rotateY *= -1;
    }
  }

  const angleInRadians = degrees_to_radians(eImg.angle);
  ctx.translate(centerX, centerY); // Translate to the center of the selection
  ctx.rotate(angleInRadians); // Apply rotation
  ctx.save();
  ctx.scale(eImg.scaleH, eImg.scaleV);

  const img = adjustedImageCanvas ? adjustedImageCanvas : imageElement;

  ctx.drawImage(img, eImg.x - rotateX, eImg.y - rotateY, eImg.width, eImg.height);

  if (markupCanvas) {
    ctx.drawImage(markupCanvas, eImg.x - rotateX, eImg.y - rotateY, eImg.width, eImg.height);
  }

  ctx.restore();

  ctx.rotate(-angleInRadians); // Undo rotation
  ctx.translate(-centerX, -centerY); // Undo translation

  if (showOnlyCrop) {
    const crop = cropStep.crop;
    ctx.clearRect(0, 0, parentSize.width, crop.y);
    ctx.clearRect(0, crop.y + crop.height, parentSize.width, parentSize.height - (crop.y + crop.height));
    ctx.clearRect(0, 0, crop.x, parentSize.height);
    ctx.clearRect(crop.x + crop.width, 0, parentSize.width - (crop.x + crop.width), parentSize.height);
  }
};
