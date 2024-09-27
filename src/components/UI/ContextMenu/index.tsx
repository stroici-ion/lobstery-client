import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';

interface ElementSizeAndPosition {
  top: number;
  left: number;
  width: number;
  height: number;
  isLeft: boolean;
}

interface IContextMenu {
  children: React.ReactNode;
  className?: string;
  triggerRef: HTMLElement;
  onHide: () => void;
}

const ContextMenu: React.FC<IContextMenu> = ({ className, children, triggerRef, onHide }) => {
  const [positionAndSize, setPositionAndSize] = useState<ElementSizeAndPosition | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (bodyRef.current && !bodyRef.current.contains(event.target as Node)) {
      onHide();
    }
  };

  useEffect(() => {
    const getElementPositionAndSize = () => {
      if (triggerRef) {
        const rect = triggerRef.getBoundingClientRect();

        setPositionAndSize({
          isLeft: window.innerWidth - rect.left < 200,
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    getElementPositionAndSize();

    window.addEventListener('resize', getElementPositionAndSize);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', getElementPositionAndSize);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [triggerRef]);

  return (
    <div className={styles.contextMenu}>
      {positionAndSize && (
        <>
          <div className={styles.fullscreenOverlay}>
            <svg width='0' height='0'>
              <defs>
                <mask id='mask'>
                  <rect fill='white' className={styles.rect} />
                  <rect
                    x={positionAndSize.left}
                    y={positionAndSize.top}
                    width={positionAndSize.width - 2}
                    height={positionAndSize.height - 2}
                    fill='black'
                    rx='20'
                    ry='20'
                  />
                </mask>
              </defs>
            </svg>
          </div>

          <div className={styles.overlay} style={{ mask: 'url(#mask)', WebkitMask: 'url(#mask)' }}></div>

          <div
            ref={bodyRef}
            className={classNames(styles.contextMenu__body, positionAndSize.isLeft && styles.isLeft)}
            style={{ ...positionAndSize }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default ContextMenu;
