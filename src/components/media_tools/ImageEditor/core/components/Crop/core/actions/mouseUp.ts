import { darkenImageAnimation } from '../animations/darkenImageAnimation';
import { resetActions } from '../resetFunctions/resetActions';
import { IEditorStep } from '../../../../types/interfaces';
import { fillParent } from './fillParent';

export const mouseUp = (cropStep: IEditorStep, drawImage: (opacity?: number) => void, addToHistory: () => void) => {
  const activeActions = cropStep.activeActions;

  if (!activeActions.isChangingAspectRatio) {
    if (activeActions.isChangingAngle) {
      const drawAnimationStep = (progress: number) => {
        if (progress === 1) {
          addToHistory();
        }
        drawImage(0.3 + progress * 0.5);
      };

      darkenImageAnimation(drawAnimationStep);
      activeActions.isCroping = false;
      return;
    }

    if (activeActions.isCroping) {
      activeActions.isCroping = false;
      resetActions(cropStep);
      fillParent(cropStep, drawImage, addToHistory);
    }
  }
};
