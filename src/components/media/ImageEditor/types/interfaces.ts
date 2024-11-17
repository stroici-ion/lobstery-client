import { EAspectRatios, EMarkupBrushTypes, EMarkupToolTypes, EMoveTypes } from './enums';

export interface IBorders {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface IMaxDistance {
  view: IBorders;
  image: IBorders;
  outerImage: IBorders;
  maxOverBorderRatio: IBorders;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IDimension {
  width: number;
  height: number;
}

export interface IShape extends IPosition, IDimension {}

export interface IDynamicShape extends IShape {
  startPosition: IShape;
}

export interface ICropShape extends IDynamicShape {
  aspectRatio: number;
  aspectRatioId: EAspectRatios;
}

export interface IImageShape extends IDynamicShape {
  aspectRatio: number;
  angle: number;
  cropCenter: IPosition;
  flipped: IFlipProperties;
  rotated: number;
  outerImage: {
    startPosition: IShape;
    ratio: number;
  } & IShape;
}

export interface IAspectRatio {
  id: EAspectRatios;
  value?: number;
  title: string;
  icon: JSX.Element;
}

export interface IAngle {
  angle: number;
  startAngle: number;
  startCursor: number;
  ratio: IShape;
}

export interface IZoom {
  step: number;
  inSteps: IZoomStep[];
  outSteps: IZoomStep[];
}

export interface IActiveActions {
  moveType: EMoveTypes;
  isChangingAngle: boolean;
  isCroping: boolean;
  isZooming: boolean;
  isChangingAspectRatio: boolean;
  isAnimation: boolean;
}

export interface IAspectRatioStartPosition {
  image: IShape;
  crop: IShape;
}

export interface IEditorStep {
  imageOriginalSize: IDimension;
  activeActions: IActiveActions;
  Origin: IPosition;
  crop: ICropShape;
  image: IImageShape;
  maxDistance: IMaxDistance;
  angle: IAngle;
  zoom: IZoom;
  aspectRatioStartPosition: IAspectRatioStartPosition;
  parentSize: IDimension;
}

export interface IMarkupTool {
  id: number;
  type: EMarkupToolTypes;
  icon: JSX.Element;
  notActivable?: boolean;
}

export interface IMarkupBrush extends Omit<IMarkupTool, 'type'> {
  color: string;
  size: number;
  type: EMarkupBrushTypes;
}

export interface IMarkupLine {
  line: IPosition[];
  relativeLine: IPosition[];
  relativeSize: number;
  arrowsLines: { end: IPosition[]; start: IPosition[] };
  relativeArrowsLines: { end: IPosition[]; start: IPosition[] };
  brush: Omit<IMarkupBrush, 'id' | 'icon'>;
}

export interface IAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  tint: number;
  sharpness: number;
  exposure: number;
  highlights: number;
  shadows: number;
}

export interface ICropHistory {
  flipped: IFlipProperties;
  rotated: number;
  angle: number;
  cropARId: EAspectRatios;
  cropAR: number;
  imageAR: number;
  cropLeft: number;
  cropTop: number;
  cropWidth: number;
  cropHeight: number;
}

export interface IFilterHistory {
  filterId: number;
  intensity: number;
}

export interface ISlider {
  id: number;
  value: number;
  initialValue: number;
  onChange: (id: number, value: number) => void;
  onMouseUp?: () => void;
  title?: string;
  icon?: JSX.Element;
  startValue?: number;
  maxValue?: number;
  minValue?: number;
  multiplicator?: number;
  step?: number;
}

export interface IHistoryJSON {
  value: string;
  type: number;
}

export interface IHistoryIndexState {
  crop: number;
  adjustment: number;
  markup: number;
  filter: number;
}

export interface IFilterListItem {
  id: number;
  title: string;
  filter?: (
    intensityFactor: number,
    d?: Uint8ClampedArray,
    r?: Uint8ClampedArray
  ) => (r: number, g: number, b: number) => number[];
}

export interface IFlipProperties {
  vertical: boolean;
  horizontal: boolean;
}

export interface IZoomProperties {
  maxOverBorderRatio: IBorders;
  stop: boolean;
  direction: EMoveTypes;
  isStartPosition: boolean;
  outer: IShape & { ratio: number };
}

export interface IZoomStep extends IShape, IZoomProperties {}
