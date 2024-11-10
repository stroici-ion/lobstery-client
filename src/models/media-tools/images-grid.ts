export type TGridCell = {
  imageId: number;
  orderId: number;
  key: string;
  imageSrc: string;
  x: number;
  y: number;
  width: number;
  height: number;
  styles: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
  ar: number;
  direction: boolean;
  cells: TGridCell[];
};
