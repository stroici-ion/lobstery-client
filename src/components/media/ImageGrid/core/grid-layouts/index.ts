import { TLayout } from '../../../../../models/media-tools/images-auto-order';
import { squareLayouts } from './square';
import { thinLayouts } from './thin';
import { thinUltraLayouts } from './thinUltra';
import { wideLayouts } from './wide';
import { wideUltra } from './wideUltra';

const layouts: TLayout[] = [...thinUltraLayouts, ...thinLayouts, ...squareLayouts, ...wideLayouts, ...wideUltra];

export default layouts;
