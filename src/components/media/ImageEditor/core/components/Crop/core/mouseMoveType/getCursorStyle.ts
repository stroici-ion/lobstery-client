import { EMoveTypes } from '../../../../../types/enums';

export const getCursorStyle = (moveType: EMoveTypes) => {
  switch (moveType) {
    case EMoveTypes.image:
      return 'grab';
    case EMoveTypes.range:
    case EMoveTypes.left:
      return 'w-resize';
    case EMoveTypes.right:
      return 'e-resize';
    case EMoveTypes.top:
      return 'n-resize';
    case EMoveTypes.bottom:
      return 's-resize';
    case EMoveTypes.leftTop:
      return 'nw-resize';
    case EMoveTypes.leftBottom:
      return 'sw-resize';
    case EMoveTypes.rightTop:
      return 'ne-resize';
    case EMoveTypes.rightBottom:
      return 'se-resize';
    case EMoveTypes.default:
      return 'default';
  }
};
