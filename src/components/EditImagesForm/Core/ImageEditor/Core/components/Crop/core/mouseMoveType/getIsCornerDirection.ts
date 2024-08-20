import { EnumMoveTypes } from '../../../../Types/Enumerations';

export const getIsCornerDirection = (moveType: EnumMoveTypes) => {
  return (
    moveType === EnumMoveTypes.leftTop ||
    moveType === EnumMoveTypes.leftBottom ||
    moveType === EnumMoveTypes.rightTop ||
    moveType === EnumMoveTypes.rightBottom
  );
};
