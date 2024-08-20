import { radians_to_degrees } from '../../../../../calculationFunctions/converters';
import { IBorders, IDimension } from '../../../../../types/interfaces';

export const getCropRotatedDistToImage = (cropRotated: IDimension, imageDC: IBorders) => {
  //Image distances from each side to rotatin center
  const halfWidth = cropRotated.width / 2;
  const halfHeight = cropRotated.height / 2;
  return {
    left: Math.floor(imageDC.left - halfWidth),
    top: Math.floor(imageDC.top - halfHeight),
    right: Math.floor(imageDC.right - halfWidth),
    bottom: Math.floor(imageDC.bottom - halfHeight),
  };
};

export const inscribedRectangleSides = (shape: IDimension, angle: number) => {
  // Convert angle to radians
  var angleRadians = angle * (Math.PI / 180);

  // Calculate half-diagonals of the outer rectangle
  var halfDiagonalX = shape.width / 2;
  var halfDiagonalY = shape.height / 2;

  // Calculate the angle of the outer rectangle's diagonal
  var diagonalAngle = Math.atan2(halfDiagonalY, halfDiagonalX);

  // Calculate the angle between the outer rectangle's diagonal and the inscribed rectangle's sides
  var angleBetweenDiagonals = diagonalAngle - angleRadians;

  // Calculate the length of the half-diagonal of the inscribed rectangle
  var inscribedDiagonal = Math.sqrt(halfDiagonalX ** 2 + halfDiagonalY ** 2);

  // Calculate the sides of the inscribed rectangle
  var inscribedWidth = 2 * inscribedDiagonal * Math.cos(angleBetweenDiagonals);
  var inscribedHeight = 2 * inscribedDiagonal * Math.sin(angleBetweenDiagonals);

  return { width: inscribedWidth, height: inscribedHeight };
};

export const calculateDiagonalLength = (a: number, b: number) => {
  return Math.sqrt(a * a + b * b);
};

export const calculateHelperAngle = (otherSide: number, ip: number) => {
  return radians_to_degrees(Math.acos(otherSide / ip));
};
