export interface IModalsState {
  imagesModalStatus: boolean;
  postCreateModalStatus: boolean;
  dialogModalStatus: boolean;
  dialogText: string;
  dialodTitle: string;
  dialogType: DialogModalEnum;
  dialogResponse: boolean;
}

export enum DialogModalEnum {
  OK = 0,
  YES_NO = 1,
}
