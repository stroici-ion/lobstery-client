import { degrees_to_radians } from "../../../../../calculationFunctions/converters";
import { IBorders, IImageShape, IPosition } from "../../../../../types/interfaces";
import { adjustShapePostion } from "../../../../../utils/calc";
import { iESBAD } from "../../../../../consts";

export const resizeImage = (image: IImageShape, cursorDistance: IPosition, imageBorders: IBorders) => {
  if (image.angle) {
    const cos = Math.cos(degrees_to_radians(image.angle));
    const sin = Math.sin(degrees_to_radians(image.angle));
    const newDistance = {
      x: cursorDistance.x * cos + cursorDistance.y * sin,
      y: cursorDistance.y * cos - cursorDistance.x * sin,
    };
    cursorDistance.x = newDistance.x;
    cursorDistance.y = newDistance.y;
  }

  if (cursorDistance.x <= imageBorders.left && cursorDistance.x * -1 <= imageBorders.right) {
    if (imageBorders.left - cursorDistance.x <= iESBAD) cursorDistance.x = imageBorders.left;
    if (imageBorders.right + cursorDistance.x <= iESBAD) cursorDistance.x = imageBorders.right * -1;
    image.x = image.startPosition.x + cursorDistance.x;
  } else {
    if (cursorDistance.x > imageBorders.left) cursorDistance.x = imageBorders.left;
    if (cursorDistance.x * -1 > imageBorders.right) cursorDistance.x = imageBorders.right * -1;
    image.x = image.startPosition.x + cursorDistance.x;
  }

  if (cursorDistance.y <= imageBorders.top && cursorDistance.y * -1 <= imageBorders.bottom) {
    if (imageBorders.top - cursorDistance.y <= iESBAD) cursorDistance.y = imageBorders.top;
    if (imageBorders.bottom + cursorDistance.y <= iESBAD) cursorDistance.y = imageBorders.bottom * -1;
    image.y = image.startPosition.y + cursorDistance.y;
  } else {
    if (cursorDistance.y > imageBorders.top) cursorDistance.y = imageBorders.top;
    if (cursorDistance.y * -1 > imageBorders.bottom) cursorDistance.y = imageBorders.bottom * -1;
    image.y = image.startPosition.y + cursorDistance.y;
  }
  adjustShapePostion(image);
};
