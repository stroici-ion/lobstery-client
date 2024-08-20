import { getCropMaxDistanceToBorders, getImageLimits, getRotatedImageLimits } from '../calculations/maxDistance/cropMoveMaxDist';
import { getImageOuterPosition } from '../calculations/position/getImageOuterPosition';
import { EnumAspectRatios, EnumMoveTypes } from '../../../../Types/Enumerations';
import { getDistanceToCenter } from '../calculations/maxDistance/distToCenter';
import { getIsCornerDirection } from '../mouseMoveType/getIsCornerDirection';
import { darkenImageAnimation } from '../animations/darkenImageAnimation';
import { IEditorStep, IPosition } from '../../../../Types/Interfaces';
import { resetActions } from '../resetFunctions/resetActions';
import { getMoveType } from '../mouseMoveType/getMoveType';

export const mouseDown = (cursor: IPosition, startCursor: IPosition, cropStep: IEditorStep, drawImage: (opacity: number) => void) => {
  const Origin = cropStep.Origin;
  const activeActions = cropStep.activeActions;
  const crop = cropStep.crop;
  const image = cropStep.image;
  const parentSize = cropStep.parentSize;
  const angle = cropStep.angle;
  const maxDistance = cropStep.maxDistance;

  activeActions.isZooming = false;
  activeActions.isChangingAspectRatio = false;

  activeActions.moveType = getMoveType(cursor, cropStep);
  switch (activeActions.moveType) {
    case EnumMoveTypes.default:
      return;
    case EnumMoveTypes.range: {
      if (!activeActions.isChangingAngle) {
        resetActions(cropStep);
      }
      activeActions.isCroping = true;
      activeActions.isChangingAngle = true;

      let imageDC = getDistanceToCenter(image, Origin);
      angle.ratio = {
        x: imageDC.left / image.width,
        y: imageDC.top / image.height,
        width: imageDC.left / imageDC.right,
        height: imageDC.top / imageDC.bottom,
      };

      angle.startCursor = cursor.x;
      angle.startAngle = angle.angle;
      break;
    }
    default: {
      activeActions.isCroping = true;
      activeActions.isChangingAngle = false;
      resetActions(cropStep);

      startCursor.x = cursor.x;
      startCursor.y = cursor.y;

      //Set Crop Aspect Ratio
      const isCorner = getIsCornerDirection(activeActions.moveType);
      if (crop.aspectRatioId === EnumAspectRatios.free) {
        if (isCorner) crop.aspectRatio = crop.width / crop.height;
        else crop.aspectRatio = 0;
      }

      //Getting Image Outer
      if (image.angle) {
        image.outerImage = getImageOuterPosition(Origin, image);
      }

      //Getting View Max Distances
      maxDistance.view = getCropMaxDistanceToBorders(crop, parentSize);

      //Getting Outer Max Distances
      if (image.aspectRatio && image.angle) {
        maxDistance.outerImage = getImageLimits(crop, image.outerImage);
      }

      //Getting Image Limits
      if (image.angle) {
        const result = getRotatedImageLimits(crop, image, Origin, activeActions.moveType, maxDistance.view);

        maxDistance.image = result.image;
        maxDistance.maxOverBorderRatio = result.overBorderRatio;
      } else {
        maxDistance.image = getImageLimits(crop, image);
        maxDistance.maxOverBorderRatio = {
          left: 100,
          right: 100,
          top: 100,
          bottom: 100,
        };
      }
      break;
    }
  }

  //Getting Opacity Animation
  const drawAnimationStep = (progress: number) => {
    drawImage(0.8 - progress * 0.5);
  };

  darkenImageAnimation(drawAnimationStep);
};
