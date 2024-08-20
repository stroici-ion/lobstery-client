import { IEditorStep, IPosition } from '../../../../types/interfaces';
import { iEBSB, iEBSLR, iEBST, iESBS } from '../../../../consts';
import { EnumMoveTypes } from '../../../../types/enumerations';

export const getMoveType = (c: IPosition, cropStep: IEditorStep) => {
  const dpr = window.devicePixelRatio;
  const crop = cropStep.crop;
  const image = cropStep.image;
  const parentSize = cropStep.parentSize;

  const cursor = {
    x: c.x * dpr,
    y: c.y * dpr,
  };

  const size = iESBS;
  const overcrop =
    cursor.x >= crop.x - size && cursor.y >= crop.y - size && cursor.x <= crop.x + crop.width + size && cursor.y <= crop.y + crop.height + size;

  if (overcrop) {
    const left = cursor.x >= crop.x - size && cursor.x <= crop.x + size;
    const top = cursor.y >= crop.y - size && cursor.y <= crop.y + size;
    const right = cursor.x >= crop.x + crop.width - size && cursor.x <= crop.x + crop.width + size;
    const bottom = cursor.y >= crop.y + crop.height - size && cursor.y <= crop.y + crop.height + size;
    const image =
      cursor.x > crop.x + size && cursor.x < crop.x + crop.width - size && cursor.y > crop.y + size && cursor.y < crop.y + crop.height - size;

    if (left && top) return EnumMoveTypes.leftTop;
    if (left && bottom) return EnumMoveTypes.leftBottom;
    if (right && top) return EnumMoveTypes.rightTop;
    if (right && bottom) return EnumMoveTypes.rightBottom;
    if (left) return EnumMoveTypes.left;
    if (right) return EnumMoveTypes.right;
    if (top) return EnumMoveTypes.top;
    if (bottom) return EnumMoveTypes.bottom;

    if (image) return EnumMoveTypes.image;

    return EnumMoveTypes.default;
  } else {
    const imageRight = image.x + image.width;
    const imageBottom = image.y + image.height;

    const maxRight = parentSize.width - iEBSLR;
    const maxBottom = parentSize.height - iEBSB;

    const borders = {
      left: image.x > iEBSLR ? image.x : iEBSLR,
      top: image.y > iEBST ? image.y : iEBST,
      right: imageRight < maxRight ? imageRight : maxRight,
      bottom: imageBottom < maxBottom ? imageBottom : maxBottom,
    };

    if (cursor.x >= borders.left && cursor.y >= borders.top && cursor.x <= borders.right && cursor.y <= borders.bottom) return EnumMoveTypes.image;

    const rangeBorders = {
      left: parentSize.width / 2 - 450 * dpr,
      top: parentSize.height - iEBSB + 40 * dpr,
      right: parentSize.width / 2 + 450 * dpr,
      bottom: parentSize.height - iEBSB + 80 * dpr,
    };

    if (cursor.x >= rangeBorders.left && cursor.y >= rangeBorders.top && cursor.x <= rangeBorders.right && cursor.y <= rangeBorders.bottom)
      return EnumMoveTypes.range;

    return EnumMoveTypes.default;
  }
};
