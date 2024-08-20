import { IPosition } from '../Types/Interfaces';
import { degrees_to_radians, radians_to_degrees } from './converters';

export const getDistanceToRotatedAxis = (distance: IPosition, angle: number) => {
  let quadrant = 1;
  if (distance.x > 0) {
    if (distance.y > 0) {
      quadrant = 4;
    } else {
      quadrant = 1;
    }
  } else {
    if (distance.y > 0) {
      quadrant = 3;
    } else {
      quadrant = 2;
    }
  }

  const a = Math.abs(distance.x);
  const b = Math.abs(distance.y);
  const c = Math.sqrt(a * a + b * b);
  const cosAngle = c ? b / c : 0;

  const helperAngleDegrees = radians_to_degrees(Math.acos(cosAngle));

  let rDistanceX = 0; //Distance to rotated axis X
  let rDistanceY = 0; //Distance to rotated axis Y

  if (quadrant === 4 || quadrant === 2) {
    if (angle < 90 - helperAngleDegrees) {
      const newAngleX = helperAngleDegrees + angle;
      const newAngleY = 90 - newAngleX;

      rDistanceX = Math.cos(degrees_to_radians(newAngleX)) * c;
      rDistanceY = Math.cos(degrees_to_radians(newAngleY)) * c;

      if (quadrant === 2) {
        rDistanceX *= -1;
        rDistanceY *= -1;
      }
    } else {
      const newAngleX = helperAngleDegrees + angle;
      const newAngleY = 90 - newAngleX;

      rDistanceX = Math.cos(degrees_to_radians(newAngleX)) * c;
      rDistanceY = Math.cos(degrees_to_radians(newAngleY)) * c;

      if (quadrant === 2) {
        rDistanceX *= -1;
        rDistanceY *= -1;
      }
    }
  } else {
    if (angle < helperAngleDegrees) {
      const newAngleX = helperAngleDegrees - angle;
      const newAngleY = 90 - newAngleX;

      rDistanceX = Math.cos(degrees_to_radians(newAngleX)) * c;
      rDistanceY = Math.cos(degrees_to_radians(newAngleY)) * c;

      if (quadrant === 1) rDistanceX *= -1;
      if (quadrant === 3) rDistanceY *= -1;
    } else {
      const newAngleX = angle - helperAngleDegrees;
      const newAngleY = 90 - newAngleX;

      rDistanceX = Math.cos(degrees_to_radians(newAngleX)) * c;
      rDistanceY = Math.cos(degrees_to_radians(newAngleY)) * c;

      if (quadrant === 1) rDistanceX *= -1;
      if (quadrant === 1) rDistanceY *= -1;
    }
  }

  return {
    x: rDistanceY,
    y: rDistanceX,
  };
};
