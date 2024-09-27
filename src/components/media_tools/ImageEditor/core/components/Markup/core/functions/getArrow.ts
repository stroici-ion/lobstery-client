import { degrees_to_radians } from '../../../../calculationFunctions/converters';
import { IPosition } from '../../../../types/interfaces';

export const findArrowheadPoints = (points: IPosition[], isHeadArrow = true) => {
  let startPoint = { x: 0, y: 0 };
  let lastPoint = { x: 0, y: 0 };
  if (!isHeadArrow) {
    if (points.length > 3) {
      startPoint = points[3];
      lastPoint = points[0];
    } else {
      startPoint = points[1];
      lastPoint = points[0];
    }
  } else {
    if (points.length > 3) {
      startPoint = points[points.length - 4];
      lastPoint = points[points.length - 1];
    } else {
      startPoint = points[0];
      lastPoint = points[1];
    }
  }

  const arrowSize = -30;

  const startPointArrow = getPointOnLineAtDistance(startPoint, lastPoint, arrowSize);
  const leftPoint = rotatePoint(startPointArrow, lastPoint, degrees_to_radians(30));
  const rightPoint = rotatePoint(startPointArrow, lastPoint, degrees_to_radians(-30));

  return {
    leftPoint,
    rightPoint,
  };
};

function rotatePoint(point: IPosition, center: IPosition, angle: number) {
  // Translate the point so that the center becomes the origin
  const translatedX = point.x - center.x;
  const translatedY = point.y - center.y;

  // Perform the rotation
  const rotatedX = translatedX * Math.cos(angle) - translatedY * Math.sin(angle);
  const rotatedY = translatedX * Math.sin(angle) + translatedY * Math.cos(angle);

  // Translate the point back
  const x = rotatedX + center.x;
  const y = rotatedY + center.y;

  return { x, y };
}

function getPointOnLineAtDistance(startPoint: IPosition, lastPoint: IPosition, distance: number) {
  // Calculate the difference between lastPoint and startPoint
  const deltaX = lastPoint.x - startPoint.x;
  const deltaY = lastPoint.y - startPoint.y;

  // Calculate the length of the line segment between startPoint and lastPoint
  const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Calculate the unit vector (direction) from startPoint to lastPoint
  const unitVectorX = deltaX / lineLength;
  const unitVectorY = deltaY / lineLength;

  // Calculate the coordinates of the new point
  const newX = lastPoint.x + unitVectorX * distance;
  const newY = lastPoint.y + unitVectorY * distance;

  return { x: newX, y: newY };
}
