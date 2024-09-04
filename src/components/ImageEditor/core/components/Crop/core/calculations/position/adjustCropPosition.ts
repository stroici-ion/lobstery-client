import { IPosition, IShape } from '../../../../../types/interfaces';
import { adjustShapePostion } from '../../../../../utils/calc';
import { getRotatedShape } from './getRotatedShape';

export const adjustCropPosition = (crop: IShape, image: IShape, angle: number, Origin: IPosition) => {
  adjustShapePostion(crop);
  adjustShapePostion(image);
  if (!angle) {
    if (image.width <= crop.width + 1) {
      image.width = crop.width;
      image.x = crop.x;
    } else if (crop.x < image.x) {
      image.x = crop.x;
    } else if (image.x + image.width <= crop.x + crop.width) {
      image.x = crop.x + crop.width - image.width;
    }

    if (image.height <= crop.height + 1) {
      image.height = crop.height;
      image.y = crop.y;
    } else if (crop.y < image.y) {
      image.y = crop.y;
    } else if (image.y + image.height <= crop.y + crop.height) {
      image.y = crop.y + crop.height - image.height;
    }
  }
};
