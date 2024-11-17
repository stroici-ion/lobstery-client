import { IFilterHistory } from '../../types/interfaces';

export const checkFilter = (a: IFilterHistory) => {
  return !!a.filterId && !!a.intensity;
};
