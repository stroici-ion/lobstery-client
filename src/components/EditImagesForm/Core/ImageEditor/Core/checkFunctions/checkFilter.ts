import { IFilterHistory } from '../Types/Interfaces';

export const checkFilter = (a: IFilterHistory) => {
  return !!a.filterId && !!a.intensity;
};
