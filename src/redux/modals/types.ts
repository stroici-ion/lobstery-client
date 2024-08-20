import { DialogModalEnum } from '../../models/DialogModalEnum';

export interface IModalsState {
  imagesModalStatus: boolean;
  postCreateModalStatus: boolean;
  dialogModalStatus: boolean;
  dialogText: string;
  dialodTitle: string;
  dialogType: DialogModalEnum;
  dialogResponse: boolean;
}
