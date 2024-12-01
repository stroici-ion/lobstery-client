import { useRef, useState } from 'react';

export const useVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const onClickPlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPlaying(true);
    isPlayingRef.current = true;
    Array.from(document.getElementsByTagName('video')).forEach((video) => video.pause());
    videoRef.current?.play();
  };

  const timeoutRef = useRef<NodeJS.Timeout>();
  const isPlayingRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onPlay = () => {
    isPlayingRef.current = true;
    clearTimeout(timeoutRef.current);
    setIsPlaying(true);
  };

  const onPause = () => {
    isPlayingRef.current = false;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!isPlayingRef.current) setIsPlaying(false);
    }, 1000);
  };

  const onSeeking = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const onSeeked = () => {
    timeoutRef.current = setTimeout(() => {
      if (!isPlayingRef.current) setIsPlaying(false);
    }, 1000);
  };

  return {
    isPlaying,
    onClickPlay,
    videoParams: {
      ref: videoRef,
      onPlay,
      onPause,
      onSeeking,
      onSeeked,
    },
  };
};
