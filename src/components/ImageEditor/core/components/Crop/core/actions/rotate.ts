import { getFillParentPosition } from '../calculations/position/getFillParentPosition';
import { getDistanceToCenter } from '../calculations/maxDistance/distToCenter';
import { updateStartPosition } from '../resetFunctions/updateStartPosition';
import { IAspectRatio, IEditorStep } from '../../../../types/interfaces';
import { getOppositeAspectRatio } from '../../../AspectRatiosPanel';
import { EnumAspectRatios } from '../../../../types/enumerations';
import { rotateAnimation } from '../animations/rotateAnimation';
import { aspectRatioList } from '../../../AspectRatiosList';

export const rotate = (
  isRotateLeft: boolean = false,
  cropStep: IEditorStep,
  setSelectedAspectRatio: (candidate: IAspectRatio) => void,
  canvasDraw: (opacity: number, animationAngle: number) => void,
  addToHistory?: () => void
) => {
  const Origin = cropStep.Origin;
  const crop = cropStep.crop;
  const image = cropStep.image;
  const parentSize = cropStep.parentSize;
  cropStep.activeActions.isAnimation = true;

  if (image.flipped.horizontal && !image.flipped.vertical) {
    image.flipped.horizontal = false;
    image.flipped.vertical = true;
  } else if (!image.flipped.horizontal && image.flipped.vertical) {
    image.flipped.horizontal = true;
    image.flipped.vertical = false;
  }

  if (isRotateLeft) {
    if (!image.rotated) image.rotated = 3;
    else image.rotated--;

    const y = crop.y - image.y;
    const x1 = image.width - (crop.x - image.x + crop.width);
    const cropDC = getDistanceToCenter(crop, Origin);
    crop.x = Origin.x - cropDC.top;
    crop.y = Origin.y - cropDC.right;

    let aux = crop.width;
    crop.width = crop.height;
    crop.height = aux;

    aux = image.width;
    image.width = image.height;
    image.height = aux;

    image.aspectRatio = image.width / image.height;

    image.x = crop.x - y;
    image.y = crop.y - x1;
  } else {
    if (image.rotated === 3) image.rotated = 0;
    else image.rotated++;

    const x = crop.x - image.x;
    const y1 = image.height - (crop.y - image.y + crop.height);

    const cropDC = getDistanceToCenter(crop, Origin);
    crop.x = Origin.x - cropDC.bottom;
    crop.y = Origin.y - cropDC.left;

    let aux = crop.width;
    crop.width = crop.height;
    crop.height = aux;

    aux = image.width;
    image.width = image.height;
    image.height = aux;

    image.aspectRatio = image.width / image.height;

    image.x = crop.x - y1;
    image.y = crop.y - x;
  }

  if (crop.aspectRatioId !== EnumAspectRatios.free)
    if (crop.aspectRatioId === EnumAspectRatios.original) {
      crop.aspectRatio = image.width / image.height;
    } else {
      const newARId = getOppositeAspectRatio(crop.aspectRatioId);
      const candidate = aspectRatioList.find((ar) => ar.id === newARId);
      if (candidate?.value) {
        crop.aspectRatio = candidate.value;
        setSelectedAspectRatio(candidate);
      }
    }

  updateStartPosition([crop, image]);

  const newPosition = getFillParentPosition(Origin, crop, image, parentSize);

  // Calculating increment for animation - selection
  const cropIncremented = {
    x: crop.x - newPosition.crop.x,
    y: crop.y - newPosition.crop.y,
    width: crop.width - newPosition.crop.width,
    height: crop.height - newPosition.crop.height,
  };

  //Calculating increment for animation - image
  const imageIncremented = {
    x: image.x - newPosition.image.x,
    y: image.y - newPosition.image.y,
    width: image.width - newPosition.image.width,
    height: image.height - newPosition.image.height,
  };

  const drawAnimationStep = (progress: number) => {
    crop.x = crop.startPosition.x - cropIncremented.x * progress;
    crop.y = crop.startPosition.y - cropIncremented.y * progress;
    crop.width = crop.startPosition.width - cropIncremented.width * progress;
    crop.height = crop.startPosition.height - cropIncremented.height * progress;

    image.x = image.startPosition.x - imageIncremented.x * progress;
    image.y = image.startPosition.y - imageIncremented.y * progress;
    image.width = image.startPosition.width - imageIncremented.width * progress;
    image.height = image.startPosition.height - imageIncremented.height * progress;
    const angle = isRotateLeft ? -90 : 90;
    canvasDraw(0.7, (progress - 1) * angle);
    if (progress === 1) {
      updateStartPosition([crop, image]);
      addToHistory?.();
      cropStep.activeActions.isAnimation = false;
    }
  };

  rotateAnimation(drawAnimationStep);
};
