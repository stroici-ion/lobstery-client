import { EnumAspectRatios } from '../../../../../Types/Enumerations';
import {
  CropAspectRatio12Svg,
  CropAspectRatio169Svg,
  CropAspectRatio21Svg,
  CropAspectRatio23Svg,
  CropAspectRatio32Svg,
  CropAspectRatio34Svg,
  CropAspectRatio43Svg,
  CropAspectRatio45Svg,
  CropAspectRatio54Svg,
  CropAspectRatio916Svg,
  CropAspectRatioFreeSvg,
  CropAspectRatioOriginalSvg,
  CropAspectRatioSquareSvg,
} from '../../../../../../../../../../icons/imageEditor';

export const aspectRatioList = [
  {
    id: EnumAspectRatios.free,
    title: 'Free',
    icon: <CropAspectRatioFreeSvg />,
    value: 0,
  },
  {
    id: EnumAspectRatios.original,
    title: 'Original',
    icon: <CropAspectRatioOriginalSvg />,
    value: -1,
  },
  {
    id: EnumAspectRatios.square,
    title: 'Square',
    icon: <CropAspectRatioSquareSvg />,
    value: 1,
  },
  {
    id: EnumAspectRatios.ratio_9_16,
    title: '9:16',
    icon: <CropAspectRatio916Svg />,
    value: 0.5625,
  },
  {
    id: EnumAspectRatios.ratio_16_9,
    title: '16:9',
    icon: <CropAspectRatio169Svg />,
    value: 1.77777,
  },
  {
    id: EnumAspectRatios.ratio_4_5,
    title: '4:5',
    icon: <CropAspectRatio45Svg />,
    value: 0.8,
  },
  {
    id: EnumAspectRatios.ratio_5_4,
    title: '5:4',
    icon: <CropAspectRatio54Svg />,
    value: 1.25,
  },
  {
    id: EnumAspectRatios.ratio_3_4,
    title: '3:4',
    icon: <CropAspectRatio34Svg />,
    value: 0.75,
  },
  {
    id: EnumAspectRatios.ratio_4_3,
    title: '4:3',
    icon: <CropAspectRatio43Svg />,
    value: 1.33333,
  },
  {
    id: EnumAspectRatios.ratio_2_3,
    title: '2:3',
    icon: <CropAspectRatio23Svg />,
    value: 0.66666,
  },
  {
    id: EnumAspectRatios.ratio_3_2,
    title: '3:2',
    icon: <CropAspectRatio32Svg />,
    value: 1.5,
  },
  {
    id: EnumAspectRatios.ratio_1_2,
    title: '1:2',
    icon: <CropAspectRatio12Svg />,
    value: 0.5,
  },
  {
    id: EnumAspectRatios.ratio_2_1,
    title: '2:1',
    icon: <CropAspectRatio21Svg />,
    value: 2,
  },
];
