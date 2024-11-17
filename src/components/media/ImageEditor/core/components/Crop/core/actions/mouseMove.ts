import { getInscriptedImage } from '../calculations/position/getInscriptedImage';
import { resizeCropFreeAR } from '../calculations/resizeCrop/resizeCropFreeAR';
import { IEditorStep, IPosition, IShape } from '../../../../../types/interfaces';
import { resizeImage } from '../calculations/resizeImage/resizeImage';
import { resizeCrop } from '../calculations/resizeCrop/resizeCrop';
import { EMoveTypes } from '../../../../../types/enums';
import { changeAngle } from './changeAngle';
import { dpr } from '../../../../config';

export const mouseMoove = (
  cursor: IPosition,
  cursorDistance: IPosition,
  cropStep: IEditorStep,
  drawDegrees: () => void,
  drawImage: (opacity: number) => void
) => {
  const Origin = cropStep.Origin;
  const activeActions = cropStep.activeActions;
  const crop = cropStep.crop;
  const image = cropStep.image;
  const angle = cropStep.angle;
  const maxDistance = cropStep.maxDistance;

  switch (activeActions.moveType) {
    case EMoveTypes.range: {
      const x = angle.startAngle + (angle.startCursor - cursor.x) / (10 * dpr);
      const string = x + '';
      let endIndex = string.indexOf('.');
      if (endIndex < 0) endIndex = string.length - 1;
      const newString = string.slice(0, endIndex + 2);
      let value = parseFloat(newString) || 0;
      if (value > 45) value = 45;
      if (value < -45) value = -45;
      if (angle.angle !== value) angle.angle = value;
      image.angle = angle.angle;
      drawDegrees();
      changeAngle(Origin, crop, image, angle, drawImage);
      break;
    }
    case EMoveTypes.image: {
      resizeImage(image, cursorDistance, maxDistance.image);
      drawImage(0.3);
      break;
    }
    default: {
      const imageRectangle = image.angle ? { ...image.outerImage, angle: image.angle } : image;
      let resizedCrop = {} as {
        isImageChanged: boolean;
        newImage: IShape;
        newCrop: IShape;
      };

      if (crop.aspectRatio) {
        const imageBorders = image.angle ? maxDistance.outerImage : maxDistance.image;
        resizedCrop = resizeCrop(
          crop,
          imageRectangle,
          cursorDistance,
          activeActions.moveType,
          imageBorders,
          maxDistance.image,
          maxDistance.view,
          maxDistance.maxOverBorderRatio
        );
      } else {
        resizedCrop = resizeCropFreeAR(
          crop,
          imageRectangle,
          cursorDistance,
          activeActions.moveType,
          maxDistance.image,
          maxDistance.view,
          maxDistance.maxOverBorderRatio
        );
      }

      const newCrop = resizedCrop.newCrop;
      crop.x = newCrop.x;
      crop.y = newCrop.y;
      crop.width = newCrop.width;
      crop.height = newCrop.height;

      if (resizedCrop.isImageChanged) {
        const newImage = resizedCrop.newImage;
        if (image.angle) {
          const inscriptedImage = getInscriptedImage(
            newImage,
            image.angle,
            image.aspectRatio,
            image.outerImage.ratio,
            Origin
          );

          image.x = inscriptedImage.x;
          image.y = inscriptedImage.y;
          image.width = inscriptedImage.width;
          image.height = inscriptedImage.height;

          image.outerImage.x = newImage.x;
          image.outerImage.y = newImage.y;
          image.outerImage.width = newImage.width;
          image.outerImage.height = newImage.height;
        } else {
          image.x = newImage.x;
          image.y = newImage.y;
          image.width = newImage.width;
          image.height = newImage.height;
        }
      }
      drawImage(0.3);
    }
  }
};
