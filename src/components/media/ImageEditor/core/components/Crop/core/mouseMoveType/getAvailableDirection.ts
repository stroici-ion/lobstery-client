import { EMoveTypes } from '../../../../../types/enums';
import { IBorders } from '../../../../../types/interfaces';

export const getAvailableResizeDirection = (angle: number, borders: IBorders) => {
  const x = {
    top: borders.top > 0,
    right: borders.right > 0,
    bottom: borders.bottom > 0,
    left: borders.left > 0,
  };
  if (x.top && x.right && x.bottom && x.left) return EMoveTypes.default;
  if (angle > 0) {
    if (!x.top && x.right && x.bottom && x.left) return EMoveTypes.leftBottom;
    if (x.top && !x.right && x.bottom && x.left) return EMoveTypes.leftTop;
    if (x.top && x.right && !x.bottom && x.left) return EMoveTypes.rightTop;
    if (x.top && x.right && x.bottom && !x.left) return EMoveTypes.rightBottom;
  } else {
    if (!x.top && x.right && x.bottom && x.left) return EMoveTypes.rightBottom;
    if (x.top && !x.right && x.bottom && x.left) return EMoveTypes.leftBottom;
    if (x.top && x.right && !x.bottom && x.left) return EMoveTypes.leftTop;
    if (x.top && x.right && x.bottom && !x.left) return EMoveTypes.rightTop;
  }
  return undefined;
};
