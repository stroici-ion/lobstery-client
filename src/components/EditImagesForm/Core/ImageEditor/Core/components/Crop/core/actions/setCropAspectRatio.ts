import { updateStartPosition } from '../resetFunctions/updateStartPosition';
import { IAspectRatio, IEditorStep } from '../../../../Types/Interfaces';
import { EnumAspectRatios } from '../../../../Types/Enumerations';
import { aspectRatioList } from '../components/AspectRatioIcon';

export const setCropAspectRatio = (cropStep: IEditorStep, aspectRatio: EnumAspectRatios, setAspectRatio: (aspectRatio: IAspectRatio) => void) => {
  const crop = cropStep.crop;
  const image = cropStep.image;
  const startPosition = cropStep.aspectRatioStartPosition;

  const candidate = aspectRatioList.find((i) => i.id === aspectRatio);
  if (candidate) {
    switch (candidate.id) {
      case EnumAspectRatios.original: {
        crop.aspectRatio = image.width / image.height;
        crop.aspectRatioId = EnumAspectRatios.original;
        break;
      }
      case EnumAspectRatios.free: {
        crop.aspectRatioId = candidate.id;
        crop.aspectRatio = 0;
        break;
      }
      default: {
        crop.aspectRatioId = candidate.id;
        crop.aspectRatio = candidate.value;
        break;
      }
    }

    const currentAR = startPosition.crop.width / startPosition.crop.height;

    if (!candidate.value) {
      updateStartPosition([crop, image]);
      crop.x = startPosition.crop.x;
      crop.y = startPosition.crop.y;
      crop.width = startPosition.crop.width;
      crop.height = startPosition.crop.height;

      image.x = startPosition.image.x;
      image.y = startPosition.image.y;
      image.width = startPosition.image.width;
      image.height = startPosition.image.height;
    } else {
      if (crop.aspectRatio) {
        updateStartPosition([crop]);
        if (currentAR > crop.aspectRatio) {
          const newWidth = startPosition.crop.height * crop.aspectRatio;
          const diff = (startPosition.crop.width - newWidth) / 2;
          crop.x = startPosition.crop.x + diff;
          crop.width = newWidth;

          crop.y = startPosition.crop.y;
          crop.height = startPosition.crop.height;
        } else {
          const newHeight = startPosition.crop.width / crop.aspectRatio;
          const diff = (startPosition.crop.height - newHeight) / 2;
          crop.y = startPosition.crop.y + diff;
          crop.height = newHeight;

          crop.x = startPosition.crop.x;
          crop.width = startPosition.crop.width;
        }
        updateStartPosition([image]);
        image.x = startPosition.image.x;
        image.y = startPosition.image.y;
        image.width = startPosition.image.width;
        image.height = startPosition.image.height;
      }
    }
    setAspectRatio(candidate);
  }
};
