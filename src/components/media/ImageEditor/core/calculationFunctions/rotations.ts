import { convertToRadians } from './converters';

export const getRotateDifferenceByDistanceToLeftTop = (x: number, y: number, angle: number) => {
  const cos = Math.cos(convertToRadians(angle));
  const sin = Math.sin(convertToRadians(angle));

  //Calculating for SECOND quadrant
  x *= -1;
  angle *= -1;

  const newX = x * cos - y * sin;
  const newY = x * sin + y * cos;

  const diffX = newX - x;
  const diffY = newY - y;

  return {
    x: x + diffX,
    y: y + diffY,
  };
};

export const getRotatedPosition = (x: number, y: number, width: number, height: number, angle: number) => {
  const cos = Math.cos(convertToRadians(angle));
  const sin = Math.sin(convertToRadians(angle));

  const referencePosition = {
    x: width / -2,
    y: height / -2,
  };

  const referencePositionRotated = {
    x: referencePosition.x * cos - referencePosition.y * sin,
    y: referencePosition.x * sin + referencePosition.y * cos,
  };

  const diferenceAxis = {
    x: referencePositionRotated.x - referencePosition.x,
    y: referencePositionRotated.y - referencePosition.y,
  };

  return {
    x: x + diferenceAxis.x,
    y: y + diferenceAxis.y,
  };
};

export const getDistanceRotatedImageAxis = (distance: { x: number; y: number }, angle: number) => {
  const cos = Math.cos(convertToRadians(angle));
  const sin = Math.sin(convertToRadians(angle));

  return {
    x: distance.x * cos + distance.y * sin,
    y: distance.y * cos - distance.x * sin,
  };
};
