import { EnumMoveTypes } from '../../../../types/enumerations';
import { IBorders } from '../../../../types/interfaces';

export const getAvailableResizeDirection = (angle: number, borders: IBorders) => {
  const x = {
    top: borders.top > 0,
    right: borders.right > 0,
    bottom: borders.bottom > 0,
    left: borders.left > 0,
  };
  if (x.top && x.right && x.bottom && x.left) return EnumMoveTypes.default;
  if (angle > 0) {
    if (!x.top && x.right && x.bottom && x.left) return EnumMoveTypes.leftBottom;
    if (x.top && !x.right && x.bottom && x.left) return EnumMoveTypes.leftTop;
    if (x.top && x.right && !x.bottom && x.left) return EnumMoveTypes.rightTop;
    if (x.top && x.right && x.bottom && !x.left) return EnumMoveTypes.rightBottom;
  } else {
    if (!x.top && x.right && x.bottom && x.left) return EnumMoveTypes.rightBottom;
    if (x.top && !x.right && x.bottom && x.left) return EnumMoveTypes.leftBottom;
    if (x.top && x.right && !x.bottom && x.left) return EnumMoveTypes.leftTop;
    if (x.top && x.right && x.bottom && !x.left) return EnumMoveTypes.rightTop;
  }
  return undefined;
};
