import { ICropHistory } from '../types/interfaces';

export const getStartHistoryStep = () => {
  return {
    cropAR: 1,
    imageAR: 1,
    flipped: { horizontal: false, vertical: false },
  } as ICropHistory;
};
