import React from 'react';

import { IImage } from '../../models/IImage';
import ImagesGrid from './core/ImagesGrid';
import VideoImagesGrid from './core/VideoImageGrid';

interface IImages {
  images: IImage[];
  onSelect?: (image: IImage, ref?: HTMLElement) => void;
  onRemove?: (image: IImage) => void;
}

const ImagesPreview: React.FC<IImages> = ({ images, onSelect, onRemove }) => {
  // const isVideo = Boolean(images.find((image) => image.is_video_file));
  return <ImagesGrid images={images} onSelect={onSelect} onRemove={onRemove} />;
};

export default ImagesPreview;
