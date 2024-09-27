import { applyImageDataAdjustments } from './applyImageDataAdjustments';
import { applyImageDataSharpness } from './applyImageDataSharpness';
import { IAdjustments, IFilterHistory } from '../types/interfaces';
import { filtersList } from '../components/FiltersList/filtersList';

export const getAdjustedImageData = (
  data: ImageData,
  result: ImageData,
  adjustments: IAdjustments,
  oldSharpnessValue: React.MutableRefObject<number>,
  sharpnessImageData: React.MutableRefObject<ImageData | undefined>,
  filter?: IFilterHistory,
  filterImageData?: ImageData
) => {
  if (oldSharpnessValue.current !== adjustments.sharpness) {
    if (adjustments.sharpness) {
      sharpnessImageData.current = applyImageDataSharpness(adjustments.sharpness, data);
    } else {
      sharpnessImageData.current = undefined;
    }
    oldSharpnessValue.current = adjustments.sharpness;
  }

  let imageData = data;

  if (sharpnessImageData.current) {
    imageData = sharpnessImageData.current;
  }

  let colorModifierCallback: ((r: number, g: number, b: number) => number[]) | undefined = undefined;

  if (filter) {
    const filtElement = filtersList.find((f) => f.id === filter.filterId);
    if (filtElement && filtElement.filter) {
      colorModifierCallback = filtElement.filter(filter.intensity);
    }
  }

  applyImageDataAdjustments(imageData, result, adjustments, colorModifierCallback, filterImageData);
};
