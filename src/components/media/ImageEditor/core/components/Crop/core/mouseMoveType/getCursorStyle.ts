import { EnumMoveTypes } from '../../../../types/enumerations';

export const getCursorStyle = (moveType: EnumMoveTypes) => {
  switch (moveType) {
    case EnumMoveTypes.image:
      return 'grab';
    case EnumMoveTypes.range:
    case EnumMoveTypes.left:
      return 'w-resize';
    case EnumMoveTypes.right:
      return 'e-resize';
    case EnumMoveTypes.top:
      return 'n-resize';
    case EnumMoveTypes.bottom:
      return 's-resize';
    case EnumMoveTypes.leftTop:
      return 'nw-resize';
    case EnumMoveTypes.leftBottom:
      return 'sw-resize';
    case EnumMoveTypes.rightTop:
      return 'ne-resize';
    case EnumMoveTypes.rightBottom:
      return 'se-resize';
    case EnumMoveTypes.default:
      return 'default';
  }
};
