import { Layout } from '../autoOrderImages';
import { squareLayouts } from './square';
import { thinLayouts } from './thin';
import { wideLayouts } from './wide';

const layouts: Layout[] = [...thinLayouts, ...wideLayouts, ...squareLayouts];

export default layouts;
