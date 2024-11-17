import { EMoveTypes } from '../../../../../types/enums';

export const getIsCornerDirection = (moveType: EMoveTypes) => {
  return (
    moveType === EMoveTypes.leftTop ||
    moveType === EMoveTypes.leftBottom ||
    moveType === EMoveTypes.rightTop ||
    moveType === EMoveTypes.rightBottom
  );
};
