import { getFillParentPosition } from '../calculations/position/getFillParentPosition';
import { fillParentAnimation } from '../animations/fillParentAnimation';
import { IEditorStep, IShape } from '../../../../../types/interfaces';
import { adjustShapePostion } from '../../../../utils/calc';
import { adjustCropPosition } from '../calculations/position/adjustCropPosition';

export const fillParent = (cropStep: IEditorStep, drawImage: (opacity: number) => void, addToHistory?: () => void) => {
  const Origin = cropStep.Origin;
  const crop = cropStep.crop;
  const image = cropStep.image;
  const parentSize = cropStep.parentSize;
  cropStep.activeActions.isAnimation = true;

  const cropStart: IShape = {
    ...crop.startPosition,
  };

  const imageStart: IShape = {
    ...image.startPosition,
  };

  const newPosition = getFillParentPosition(Origin, crop, image, parentSize);

  adjustCropPosition(newPosition.crop, newPosition.image, image.angle, Origin);

  //Calculating increment for animation - selection
  const cropIncremented = {
    x: cropStart.x - newPosition.crop.x,
    y: cropStart.y - newPosition.crop.y,
    width: cropStart.width - newPosition.crop.width,
    height: cropStart.height - newPosition.crop.height,
  };

  //Calculating increment for animation - image
  const imageIncremented = {
    x: imageStart.x - newPosition.image.x,
    y: imageStart.y - newPosition.image.y,
    width: imageStart.width - newPosition.image.width,
    height: imageStart.height - newPosition.image.height,
  };

  const drawAnimationStep = (progress: number) => {
    crop.x = cropStart.x - cropIncremented.x * progress;
    crop.y = cropStart.y - cropIncremented.y * progress;
    crop.width = cropStart.width - cropIncremented.width * progress;
    crop.height = cropStart.height - cropIncremented.height * progress;

    image.x = imageStart.x - imageIncremented.x * progress;
    image.y = imageStart.y - imageIncremented.y * progress;
    image.width = imageStart.width - imageIncremented.width * progress;
    image.height = imageStart.height - imageIncremented.height * progress;
    drawImage(progress * 0.5 + 0.3);
    if (progress === 1 && addToHistory) {
      addToHistory();
      cropStep.activeActions.isAnimation = false;
    }
  };

  fillParentAnimation(drawAnimationStep);
};
