import { IAngle, ICropShape, IImageShape, IPosition, IShape } from '../../../../types/interfaces';
import { getCropRotatedDistToImage } from '../calculations/maxDistance/cropRotatedDistToImage';
import { getDistanceToCenter } from '../calculations/maxDistance/distToCenter';
import { getRotatedShape } from '../calculations/position/getRotatedShape';

export const changeAngle = (O: IPosition, crop: ICropShape, image: IImageShape, angle: IAngle, drawImage: (opacity: number) => void) => {
  const cropRoteted = getRotatedShape(crop.startPosition, angle.angle);

  //Min distance from crop center to image top/right/bottom/left
  const minDistance = {
    x: cropRoteted.width / 2,
    y: cropRoteted.height / 2,
  };

  let imageDC = { top: 0, left: 0, right: 0, bottom: 0 };
  let remainingDistances = { top: 0, left: 0, right: 0, bottom: 0 };
  const newImage: IShape = {
    x: image.startPosition.x,
    y: image.startPosition.y,
    width: image.startPosition.width,
    height: image.startPosition.height,
  };

  const calculate = () => {
    imageDC = getDistanceToCenter(newImage, O);
    remainingDistances = getCropRotatedDistToImage(cropRoteted, imageDC);
  };

  calculate();

  if (remainingDistances.top < 0) {
    newImage.y = O.y - minDistance.y;
    newImage.height = minDistance.y + minDistance.y / angle.ratio.height;
    newImage.width = newImage.height * image.aspectRatio;
    newImage.x = O.x - newImage.width * angle.ratio.x;
    calculate();
  }

  if (remainingDistances.left < 0) {
    newImage.x = O.x - minDistance.x;
    newImage.width = minDistance.x + minDistance.x / angle.ratio.width;
    newImage.height = newImage.width / image.aspectRatio;
    newImage.y = O.y - newImage.height * angle.ratio.y;
    calculate();
  }

  if (remainingDistances.right < 0) {
    newImage.width = minDistance.x + minDistance.x * angle.ratio.width;
    newImage.height = newImage.width / image.aspectRatio;
    newImage.x = O.x - newImage.width + minDistance.x;
    newImage.y = O.y - newImage.height * angle.ratio.y;
    calculate();
  }

  if (remainingDistances.bottom < 0) {
    newImage.height = minDistance.y + minDistance.y * angle.ratio.height;
    newImage.width = newImage.height * image.aspectRatio;
    newImage.y = O.y - newImage.height + minDistance.y;
    newImage.x = O.x - newImage.width * angle.ratio.x;
    calculate();
  }

  image.x = newImage.x;
  image.y = newImage.y;
  image.width = newImage.width;
  image.height = newImage.height;

  drawImage(0.3);
};
