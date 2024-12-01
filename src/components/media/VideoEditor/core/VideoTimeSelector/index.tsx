import React, { useEffect, useRef, useState } from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { TPosition, useCursorMouseMove } from '../../../../../hooks/useCursorMouseMove';
import { useOnResize } from '../../../../../hooks/useOnResize';
import { IThumbnail } from '../../../../../redux/images/types';

interface IVideoTimeSelector {
  thumbnails: IThumbnail[];
  aspectRatio: number;
  setSelectedThumbnails: React.Dispatch<React.SetStateAction<IThumbnail[]>>;
}

type TTimeStyles = {
  left: number;
  right: number;
};

type TTimePosition = {
  left: number;
  right: number;
  start: {
    left: number;
    right: number;
  };
};

const VideoTimeSelector: React.FC<IVideoTimeSelector> = ({ thumbnails, aspectRatio, setSelectedThumbnails }) => {
  const [displayedThumbnails, setDisplayedThumbnails] = useState<IThumbnail[]>([]);
  const [timeStyles, setTimeStyles] = useState<TTimeStyles>({ left: 0, right: 0 });
  const controlSelected = useRef('');
  const parrentWidth = useRef<number>(0);
  const position = useRef<TTimePosition>({ start: { left: 0, right: 0 }, left: 0, right: 0 });
  const selectionRel = useRef<{ width: number; left: number; right: number }>({ width: 0, left: 0, right: 0 });
  const parrentRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef<boolean>(false);

  function selectImagesWithGap(images: IThumbnail[], count: number): IThumbnail[] {
    if (count <= 0 || images.length === 0) {
      return [];
    }

    const totalImages = images.length;

    // Handle edge case: if count >= totalImages, return all images
    if (count >= totalImages) {
      return images.slice();
    }

    const result: IThumbnail[] = [];
    const usedIndices = new Set<number>();

    // Add the first image
    result.push(images[0]);
    usedIndices.add(0);

    // Calculate the gap dynamically
    const gap = (totalImages - 1) / (count - 1);

    // Add intermediate images, ensuring no duplicates
    for (let i = 1; i < count - 1; i++) {
      const index = Math.min(Math.round(i * gap), totalImages - 1);

      // Avoid duplicates by skipping already used indices
      if (!usedIndices.has(index)) {
        result.push(images[index]);
        usedIndices.add(index);
      }
    }

    // Add the last image
    if (!usedIndices.has(totalImages - 1)) {
      result.push(images[totalImages - 1]);
    }

    return result;
  }

  function sliceImagesByRatio(images: IThumbnail[], startRatio: number, widthRatio: number) {
    if (startRatio < 0 || startRatio > 1 || widthRatio < 0 || widthRatio > 1) {
      throw new Error('startRatio a nd widthRatio must be between 0 and 1');
    }

    const totalImages = images.length;

    const startIndex = Math.floor(startRatio * totalImages);

    const widthCount = Math.floor(widthRatio * totalImages);
    const endIndex = Math.min(startIndex + widthCount, totalImages);

    return images.slice(startIndex, endIndex);
  }

  const getSelectedThumbnails = () => {
    const slice = sliceImagesByRatio(thumbnails, selectionRel.current.left, selectionRel.current.width);
    setSelectedThumbnails(getDisplayedThumbnails(slice, 150));
  };

  const getDisplayedThumbnails = (images: IThumbnail[], height: number = 60) => {
    if (parrentWidth.current) {
      const thumbnailWidth = height * aspectRatio;
      const nr = Math.floor(parrentWidth.current / thumbnailWidth) + 1;
      const thumbs = selectImagesWithGap(images, nr);
      return thumbs;
    }
    return [];
  };

  useEffect(() => {
    setDisplayedThumbnails(getDisplayedThumbnails(thumbnails));
  }, [thumbnails]);

  const mouseMove = (cursorDiff: TPosition) => {
    if (!controlSelected.current) return;

    if (controlSelected.current === 'left') {
      let left = position.current.start.left - cursorDiff.x;
      if (left < 0) position.current.left = 0;
      else if (left > parrentWidth.current - position.current.right)
        position.current.left = parrentWidth.current - position.current.right;
      else position.current.left = left;
    } else if (controlSelected.current === 'right') {
      let right = position.current.start.right + cursorDiff.x;
      if (right < 0) position.current.right = 0;
      else if (right > parrentWidth.current - position.current.left)
        position.current.right = parrentWidth.current - position.current.left;
      else position.current.right = right;
    } else if (controlSelected.current === 'center') {
      let left = position.current.start.left - cursorDiff.x;
      let right = position.current.start.right + cursorDiff.x;
      if (right < 0) {
        right = 0;
        left = parrentWidth.current - selectionRel.current.width * parrentWidth.current;
      }
      if (left < 0) {
        left = 0;
        right = parrentWidth.current - selectionRel.current.width * parrentWidth.current;
      }
      selectionRel.current.width = (parrentWidth.current - right - left) / parrentWidth.current;
      position.current.left = left;
      position.current.right = right;
    }
    getSlectionRelPosition();
    setTimeStyles({ ...position.current });
    getSelectedThumbnails();
  };

  const mouseLeave = () => {
    position.current.start.left = position.current.left;
    position.current.start.right = position.current.right;
    controlSelected.current = '';
  };

  useEffect(() => {
    if (parrentRef.current) setInitialPosition();
  }, [parrentRef.current]);

  const getSlectionRelPosition = () => {
    selectionRel.current.width =
      (parrentWidth.current - position.current.left - position.current.right) / parrentWidth.current;
    selectionRel.current.left = position.current.left / parrentWidth.current;
    selectionRel.current.right = position.current.right / parrentWidth.current;
  };

  const setInitialPosition = () => {
    if (parrentRef.current) {
      const rect = parrentRef.current.getBoundingClientRect();
      parrentWidth.current = rect.width;
      if (!isInitialized.current) {
        getSlectionRelPosition();
        isInitialized.current = true;
      }
      position.current.left = selectionRel.current.left * rect.width;
      position.current.right = selectionRel.current.right * rect.width;
      setTimeStyles({ ...position.current });
      setDisplayedThumbnails(getDisplayedThumbnails(thumbnails));
      getSelectedThumbnails();
    }
  };

  useOnResize(setInitialPosition);

  useCursorMouseMove({ onMove: mouseMove, onLeave: mouseLeave });

  const handleSelectLeftControl = () => (controlSelected.current = 'left');
  const handleSelectRightControl = () => (controlSelected.current = 'right');
  const handleSelectCenterControl = () => (controlSelected.current = 'center');

  return (
    <div ref={parrentRef} className={styles.root}>
      <div className={styles.root__thumbnails} ref={thumbnailsRef}>
        {displayedThumbnails.map((thmb, index) => (
          <img key={thmb.time + index} src={thmb.url} alt="No thumbnail" />
        ))}
      </div>
      <div className={classNames(styles.root__time, styles.time)} style={timeStyles}>
        <span
          className={styles.time__center}
          onMouseDown={handleSelectCenterControl}
          onTouchStart={handleSelectCenterControl}
        />
        <span
          className={styles.time__left}
          onMouseDown={handleSelectLeftControl}
          onTouchStart={handleSelectLeftControl}
        />
        <span
          className={styles.time__right}
          onMouseDown={handleSelectRightControl}
          onTouchStart={handleSelectRightControl}
        />
      </div>
    </div>
  );
};

export default VideoTimeSelector;
