import { IImage } from '../../models/IImage';
import { ImageEditOperationsEnum } from '../../models/ImageEditOperationsEnum';

export interface IImagesState {
  images: IImage[];
  activeImage?: IImage;
  operation: ImageEditOperationsEnum;
  activeIndex: number;
}
