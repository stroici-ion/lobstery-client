import { getDistanceToCenter } from '../calculations/maxDistance/distToCenter';
import { degrees_to_radians } from '../../../../calculationFunctions/converters';
import { IEditorStep, IShape } from '../../../../types/interfaces';
import { dpr, iECBS, iECCS } from '../../../../consts';

export const canvasDrawCrop = (
  cropStep: IEditorStep,
  opacity: number,
  animationAngle: number,
  ctx: CanvasRenderingContext2D
) => {
  const crop = cropStep.crop;
  const image = cropStep.image;
  const imageOriginalSize = cropStep.imageOriginalSize;
  const parentSize = cropStep.parentSize;
  const Origin = cropStep.Origin;
  const activeActions = cropStep.activeActions;

  let sizeRartioWidth = crop.width / image.width;
  let sizeRartioHeight = crop.height / image.height;

  const imageSize = {
    width: Math.floor(imageOriginalSize.width * sizeRartioWidth),
    height: Math.floor(imageOriginalSize.height * sizeRartioHeight),
  };

  const centerX = Origin.x;
  const centerY = Origin.y;

  const editedShape = {
    x: image.x - 1,
    y: image.y - 1,
    width: image.width + 2,
    height: image.height + 2,
  };

  ctx.clearRect(0, 0, parentSize.width, parentSize.height);
  ctx.fillStyle = `rgba(200,200,200,${opacity})`;

  let editedAngle = image.angle + animationAngle;
  let rotateX = 0;
  let rotateY = 0;
  if (editedAngle) {
    if (image.rotated === 3) {
      editedAngle -= 90;
      let aux = editedShape.width;
      editedShape.width = editedShape.height;
      editedShape.height = aux;
      const imageDC = getDistanceToCenter(image, Origin);
      editedShape.x = Origin.x - imageDC.bottom;
      editedShape.y = Origin.y - imageDC.left;
    }
    if (editedAngle) {
      rotateX = centerX;
      rotateY = centerY;
    }
  }

  if (editedAngle) {
    const angleInRadians = degrees_to_radians(editedAngle);
    ctx.translate(centerX, centerY); // Translate to the center of the selection
    ctx.rotate(angleInRadians); // Apply rotation
    ctx.save();
    ctx.fillRect(editedShape.x - rotateX, editedShape.y - rotateY, editedShape.width, editedShape.height);

    ctx.restore();
    ctx.rotate(-angleInRadians); // Undo rotation
    ctx.translate(-centerX, -centerY); // Undo translation
  } else {
    ctx.fillRect(editedShape.x, editedShape.y, editedShape.width, editedShape.height);
  }

  const drawCrop = (crop: IShape) => {
    ctx.clearRect(crop.x, crop.y, crop.width, crop.height);

    const drawGrid = (isManyLines: boolean = false) => {
      if (isManyLines) {
        let gapWidth = crop.width / 9;

        let max = crop.width / gapWidth;
        for (let i = 1; i < max; i++) {
          const x = crop.x + Math.floor(i * gapWidth);
          ctx.moveTo(x, crop.y);
          ctx.lineTo(x, crop.y + crop.height);
        }

        gapWidth = crop.height / 9;
        max = crop.height / gapWidth;
        for (let i = 1; i < max; i++) {
          const y = crop.y + Math.floor(i * gapWidth);
          ctx.moveTo(crop.x, y);
          ctx.lineTo(crop.x + crop.width, y);
        }
        ctx.stroke();
      } else {
        const width_1_3 = Math.floor(crop.width / 3);
        const height_1_3 = Math.floor(crop.height / 3);

        ctx.moveTo(crop.x + width_1_3 + 0.5, crop.y);
        ctx.lineTo(crop.x + width_1_3 + 0.5, crop.y + crop.height);

        ctx.moveTo(crop.x + width_1_3 * 2 + 0.5, crop.y);
        ctx.lineTo(crop.x + width_1_3 * 2 + 0.5, crop.y + crop.height);

        ctx.moveTo(crop.x, crop.y + height_1_3 + 0.5);
        ctx.lineTo(crop.x + crop.width, crop.y + height_1_3 + 0.5);

        ctx.moveTo(crop.x, crop.y + height_1_3 * 2 + 0.5);
        ctx.lineTo(crop.x + crop.width, crop.y + height_1_3 * 2 + 0.5);
        ctx.stroke();
      }
    };

    if (activeActions.isCroping) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      if (activeActions.isChangingAngle) ctx.setLineDash([10, 5]);
      ctx.strokeStyle = '#ffffff55';
      drawGrid(activeActions.isChangingAngle);
      ctx.stroke();
      ctx.closePath();

      if (!activeActions.isChangingAngle) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#fff';
        ctx.setLineDash([10, 5]);
        drawGrid(activeActions.isChangingAngle);
        ctx.stroke();
      }

      ctx.setLineDash([]);
      ctx.closePath();

      //Draw Resolution
      const textCenter = { x: crop.x + crop.width / 2, y: crop.y + crop.height - 17 * dpr };
      ctx.fillStyle = `rgba(0,0,0,${1 - opacity})`;
      ctx.fillRect(crop.x + crop.width / 2 - 40 * dpr, crop.y + crop.height - 30 * dpr, 80 * dpr, 20 * dpr);
      ctx.fillStyle = '#fff';
      ctx.font = '18px Monospace';

      if (imageSize.width > 999) textCenter.x -= 28 * dpr;
      else if (imageSize.width > 99) textCenter.x -= 22 * dpr;

      ctx.fillText(`${imageSize.width}:${imageSize.height}`, textCenter.x, textCenter.y);
    }

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';

    ctx.moveTo(crop.x - 0.5, crop.y - 0.5);
    ctx.lineTo(crop.x + crop.width + 0.5, crop.y - 0.5);
    ctx.lineTo(crop.x + crop.width + 0.5, crop.y + crop.height + 0.5);
    ctx.lineTo(crop.x - 0.5, crop.y + crop.height + 0.5);
    ctx.lineTo(crop.x - 0.5, crop.y - 0.5);
    ctx.stroke();
    ctx.closePath();

    // Decoration
    // Left top
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000';

    // Left top
    ctx.moveTo(crop.x - 3, crop.y + iECCS);
    ctx.lineTo(crop.x - 3, crop.y - 3);
    ctx.lineTo(crop.x + iECCS, crop.y - 3);

    //Right top
    ctx.moveTo(crop.x + crop.width - iECCS, crop.y - 3);
    ctx.lineTo(crop.x + crop.width + 3, crop.y - 3);
    ctx.lineTo(crop.x + crop.width + 3, crop.y + iECCS);

    // //Left bottom
    ctx.moveTo(crop.x + crop.width + 3, crop.y + crop.height - iECCS);
    ctx.lineTo(crop.x + crop.width + 3, crop.y + crop.height + 3);
    ctx.lineTo(crop.x + crop.width - iECCS, crop.y + crop.height + 3);
    // //Left bottom

    ctx.moveTo(crop.x + iECCS, crop.y + crop.height + 3);
    ctx.lineTo(crop.x - 3, crop.y + crop.height + 3);
    ctx.lineTo(crop.x - 3, crop.y + crop.height - iECCS);

    //Top
    ctx.moveTo(crop.x + ~~(crop.width / 2) - iECBS, crop.y - 3);
    ctx.lineTo(crop.x + ~~(crop.width / 2) + iECBS, crop.y - 3);

    // //Right
    ctx.moveTo(crop.x + crop.width + 3, crop.y + ~~(crop.height / 2) - iECBS);
    ctx.lineTo(crop.x + crop.width + 3, crop.y + ~~(crop.height / 2) + iECBS);

    // //Bottom
    ctx.moveTo(crop.x + ~~(crop.width / 2) - iECBS, crop.y + crop.height + 3);
    ctx.lineTo(crop.x + ~~(crop.width / 2) + iECBS, crop.y + crop.height + 3);

    // //Left
    ctx.moveTo(crop.x - 3, crop.y + ~~(crop.height / 2) - iECBS);
    ctx.lineTo(crop.x - 3, crop.y + ~~(crop.height / 2) + iECBS);

    ctx.stroke();
    ctx.closePath();
  };

  if (animationAngle) {
    const angleInRadians = degrees_to_radians(animationAngle);
    ctx.translate(centerX, centerY); // Translate to the center of the selection
    ctx.rotate(angleInRadians); // Apply rotation
    ctx.save();
    drawCrop({ ...crop, x: crop.x - centerX, y: crop.y - centerY });
    ctx.restore();
    ctx.rotate(-angleInRadians); // Undo rotation
    ctx.translate(-centerX, -centerY);
  } else {
    drawCrop(crop);
  }
};
