import React from 'react';

import { IImage } from '../../models/images/IImage';
import ImagesGrid from './core/ImagesGrid';

interface IImages {
  images: IImage[];
  onSelect?: (image: IImage, ref?: HTMLElement) => void;
  onRemove?: (image: IImage) => void;
}

const ImagesPreview: React.FC<IImages> = ({ images, onSelect, onRemove }) => {
  // const isVideo = Boolean(images.find((image) => image.isVideoFile));
  return <ImagesGrid images={images} onSelect={onSelect} onRemove={onRemove} />;
};

export default ImagesPreview;
