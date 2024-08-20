import { calculateDiagonalLength, calculateHelperAngle } from '../calculations/maxDistance/cropRotatedDistToImage';
import { getRotatedImageLimits } from '../calculations/maxDistance/cropMoveMaxDist';
import { degrees_to_radians } from '../../../../calculationFunctions/converters';
import { getDistanceToCenter } from '../calculations/maxDistance/distToCenter';
import { IBorders, IEditorStep, IShape } from '../../../../types/interfaces';
import { getRotatedShape } from '../calculations/position/getRotatedShape';
import { resetShape } from '../calculations/resizeCrop/resizeCrop';
import { zoomImage } from '../calculations/resizeImage/zoomImage';
import { EnumMoveTypes } from '../../../../types/enumerations';
import { TZoomProperties } from '../../../../types/types';

export const imageZoom = (isZoomIn: boolean, cropStep: IEditorStep, drawImage: (opacity: number) => void) => {
  const Origin = cropStep.Origin;
  const crop = cropStep.crop;
  const image = cropStep.image;
  const zoom = cropStep.zoom;

  const imageDC = getDistanceToCenter(image.startPosition, Origin);
  const prevStep = zoom.step;

  zoom.step += isZoomIn ? 1 : -1;

  switch (zoom.step) {
    case 0:
      resetShape(image);
      break;
    case -1:
      //If before we detected that no zoom out available then break
      if (zoom.outSteps[0].stop) break;

      //If first zoom out step was calculated before
      if (zoom.outSteps.length > 1) {
        image.x = zoom.outSteps[1].x;
        image.y = zoom.outSteps[1].y;
        image.width = zoom.outSteps[1].width;
        image.height = zoom.outSteps[1].height;
        break;
      }

      //If null step is not calculated
      const nullStepProperties: TZoomProperties = {
        stop: false,
        direction: EnumMoveTypes.default,
        isStartPosition: false,
        maxOverBorderRatio: {
          top: 100,
          right: 100,
          bottom: 100,
          left: 100,
        },
        outer: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          ratio: 0,
        },
      };
      zoomImage(0, isZoomIn, crop, image, Origin, imageDC, nullStepProperties);

      const checkChanges = () => {
        return (
          image.x === image.startPosition.x &&
          image.y === image.startPosition.y &&
          image.width === image.startPosition.width &&
          image.height === image.startPosition.height
        );
      };

      //Size remained the same as before
      if (checkChanges()) {
        //Recalculating with certain direction
        zoom.outSteps[0].isStartPosition = nullStepProperties.isStartPosition;
        zoom.outSteps[0].direction = nullStepProperties.direction;
        zoom.outSteps[0].stop = false;

        if (image.angle) {
          const outerImageDimensions = getRotatedShape(image, image.angle);
          const imageDists = getDistanceToCenter(image, Origin);
          let distLeft = 0;
          let distTop = 0;
          if (image.angle > 0) {
            const ipY = calculateDiagonalLength(imageDists.left, imageDists.top);
            const helperAngleY = calculateHelperAngle(imageDists.top, ipY) - image.angle;

            const ipX = calculateDiagonalLength(imageDists.left, imageDists.bottom);
            const helperAngleX = calculateHelperAngle(imageDists.left, ipX) - image.angle;

            distTop = ipY * Math.cos(degrees_to_radians(helperAngleY));
            distLeft = ipX * Math.cos(degrees_to_radians(helperAngleX));
          } else {
            const ipX = calculateDiagonalLength(imageDists.left, imageDists.top);
            const helperAngleX = calculateHelperAngle(imageDists.left, ipX) + image.angle;

            const ipY = calculateDiagonalLength(imageDists.top, imageDists.right);
            const helperAngleY = calculateHelperAngle(imageDists.top, ipY) + image.angle;

            distTop = ipY * Math.cos(degrees_to_radians(helperAngleY));
            distLeft = ipX * Math.cos(degrees_to_radians(helperAngleX));
          }

          zoom.outSteps[0].outer = {
            ratio: (Math.cos(degrees_to_radians(90 - image.angle)) * image.height) / outerImageDimensions.width,
            x: Origin.x - distLeft,
            y: Origin.y - distTop,
            width: outerImageDimensions.width,
            height: outerImageDimensions.height,
          };

          image.outerImage = {
            startPosition: {
              x: Origin.x - distLeft,
              y: Origin.y - distTop,
              width: outerImageDimensions.width,
              height: outerImageDimensions.height,
            },
            ratio: (Math.cos(degrees_to_radians(90 - image.angle)) * image.height) / outerImageDimensions.width,
            x: Origin.x - distLeft,
            y: Origin.y - distTop,
            width: outerImageDimensions.width,
            height: outerImageDimensions.height,
          };

          const result = getRotatedImageLimits(crop, image, Origin, nullStepProperties.direction, {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          });

          zoom.outSteps[0].maxOverBorderRatio = result.overBorderRatio;
        }

        const stepProperties1 = {
          stop: false,
          direction: nullStepProperties.direction,
          isStartPosition: false,
          maxOverBorderRatio: {
            top: 100,
            right: 100,
            bottom: 100,
            left: 100,
          },
          outer: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            ratio: 0,
          },
        };

        const chengeDirectionPosition: IShape & { ratio?: number } & {
          maxOverBorderRatio: IBorders;
        } = image.angle
          ? {
              ...zoom.outSteps[0].outer,
              maxOverBorderRatio: zoom.outSteps[0].maxOverBorderRatio,
            }
          : zoom.outSteps[0];

        zoomImage(
          1,
          isZoomIn,
          crop,
          image,
          Origin,
          imageDC,
          stepProperties1,
          chengeDirectionPosition //Previous start Position
        );

        //Size remained the same as before
        if (checkChanges()) {
          //Stop zooming
          zoom.outSteps[0].stop = true;
          zoom.step = prevStep;
        }
        //Size changed
        else {
          zoom.outSteps[0].direction = stepProperties1.direction;
          zoom.outSteps.push({
            ...stepProperties1,
            x: image.x,
            y: image.y,
            width: image.width,
            height: image.height,
          });
        }
      }
      //Size changed
      else {
        zoom.outSteps.push({
          ...nullStepProperties,
          x: image.x,
          y: image.y,
          width: image.width,
          height: image.height,
        });
      }
      break;
    default:
      if (zoom.step > 0) {
        if (zoom.inSteps.length >= zoom.step) {
          image.x = zoom.inSteps[zoom.step - 1].x;
          image.y = zoom.inSteps[zoom.step - 1].y;
          image.width = zoom.inSteps[zoom.step - 1].width;
          image.height = zoom.inSteps[zoom.step - 1].height;
        } else {
          const stepProperties: TZoomProperties = {
            stop: false,
            direction: EnumMoveTypes.default,
            isStartPosition: false,
            maxOverBorderRatio: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
            outer: {
              x: 0,
              y: 0,
              width: 0,
              height: 0,
              ratio: 0,
            },
          };

          zoomImage(0, isZoomIn, crop, image, Origin, imageDC, stepProperties);

          zoom.inSteps.push({
            ...stepProperties,
            x: image.x,
            y: image.y,
            width: image.width,
            height: image.height,
            outer: {
              x: 0,
              y: 0,
              width: 0,
              height: 0,
              ratio: 0,
            },
          });
        }
      } else {
        const step = Math.abs(zoom.step);
        if (zoom.outSteps.length >= step + 1) {
          image.x = zoom.outSteps[step].x;
          image.y = zoom.outSteps[step].y;
          image.width = zoom.outSteps[step].width;
          image.height = zoom.outSteps[step].height;
        } else {
          const lastStep = zoom.outSteps[step - 1];
          let posCandidate = zoom.outSteps.find((item, index) => index >= zoom.outSteps.length - 10 && item.isStartPosition) || zoom.outSteps[0];
          let posCandidateIndex = zoom.outSteps.indexOf(posCandidate) || 0;

          if (lastStep?.stop) {
            zoom.step = prevStep;
            break;
          }

          const chengeDirectionPosition: IShape & { ratio?: number } & {
            maxOverBorderRatio: IBorders;
          } = image.angle ? { ...posCandidate.outer, maxOverBorderRatio: posCandidate.maxOverBorderRatio } : posCandidate;

          const stepProperties: TZoomProperties = {
            stop: false,
            direction: lastStep.direction,
            isStartPosition: false,
            maxOverBorderRatio: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
            outer: {
              x: 0,
              y: 0,
              width: 0,
              height: 0,
              ratio: 0,
            },
          };

          zoomImage(step - posCandidateIndex, isZoomIn, crop, image, Origin, imageDC, stepProperties, chengeDirectionPosition);

          zoom.outSteps.push({
            ...stepProperties,
            x: image.x,
            y: image.y,
            width: image.width,
            height: image.height,
          });
        }
      }
  }

  drawImage(0.3);
};
