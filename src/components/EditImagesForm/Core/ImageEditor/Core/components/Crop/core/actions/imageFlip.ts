import { updateStartPosition } from '../resetFunctions/updateStartPosition';
import { getDistanceToCenter } from '../calculations/maxDistance/distToCenter';
import { IEditorStep } from '../../../../Types/Interfaces';

export const imageFlip = (isHorizontal: boolean, cropStep: IEditorStep, drawDegrees: () => void, imageDraw: () => void) => {
  const Origin = cropStep.Origin;
  const imageAngle = cropStep.angle;
  const crop = cropStep.crop;
  const image = cropStep.image;

  const distances = getDistanceToCenter(image, Origin);
  if (isHorizontal) {
    image.flipped.horizontal = !image.flipped.horizontal;
    image.x = Origin.x - distances.right;
  } else {
    image.flipped.vertical = !image.flipped.vertical;
    image.y = Origin.y - distances.bottom;
  }
  if (image.angle) {
    imageAngle.angle = image.angle * -1;
    image.angle = imageAngle.angle;
    updateStartPosition([image, crop]);
    drawDegrees();
  }
  imageDraw();
};
