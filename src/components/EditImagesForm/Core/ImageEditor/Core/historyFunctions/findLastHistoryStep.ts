import { IHistoryJSON } from '../Types/Interfaces';

export const findLastHistoryStep = (index: number, type: number, history: IHistoryJSON[]) => {
  for (let i = index; i >= 0; i--) {
    const historyStep = history[i];
    if (historyStep.type === type) return { value: historyStep.value, index: i };
  }
};
