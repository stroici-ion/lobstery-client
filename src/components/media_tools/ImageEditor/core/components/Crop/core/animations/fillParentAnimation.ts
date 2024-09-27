import { easeInOut } from '../../../../animationFunctions/easeInOut';

export const fillParentAnimation = (draw: (progress: number) => void) => {
  const duration = 150;
  let startAnimation: number | null = null;

  requestAnimationFrame(function measure(time) {
    if (!startAnimation) {
      startAnimation = time;
    }

    const progress = (time - startAnimation) / duration;
    const animationProgress = easeInOut(progress);

    if (progress < 1) {
      draw(animationProgress);
      requestAnimationFrame(measure);
    } else {
      draw(1);
    }
  });
};
