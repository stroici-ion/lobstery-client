import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { defaultContextMenuMaxHeight, defaultContextMenuWidth } from '../../utils/consts';
import { SubmenuSvg } from '../../icons';
import styles from './styles.module.scss';
import SmallButton from '../UI/Buttons/SmallButton';

interface IContextMenu {
  children: any;
  className?: string;
  openButton?: any;
  width?: number;
  maxHeight?: number;
}

interface IContextMenuBody {
  children: any;
  className?: string;
  close: () => void;
  width: number;
  maxHeight: number;
  parentRef: React.RefObject<HTMLDivElement>;
}

const ContextMenu: React.FC<IContextMenu> = ({ className, children, openButton, width, maxHeight }) => {
  const [isVisible, setIsVisible] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={classNames(styles.root, className)} ref={parentRef}>
      {openButton ? (
        openButton(() => setIsVisible(!isVisible))
      ) : (
        <SmallButton className={styles.root__button} onClick={() => setIsVisible(!isVisible)}>
          <SubmenuSvg />
        </SmallButton>
      )}
      {isVisible && parentRef.current && (
        <ContextMenuBody
          parentRef={parentRef}
          width={width || defaultContextMenuWidth}
          maxHeight={maxHeight || defaultContextMenuMaxHeight}
          close={() => setIsVisible(false)}
        >
          {children}
        </ContextMenuBody>
      )}
    </div>
  );
};

const ContextMenuBody: React.FC<IContextMenuBody> = ({ children, close, width, maxHeight, parentRef }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [bodyStyles, setBodyStyles] = useState({
    left: 'auto',
    right: 'auto',
    top: 'auto',
    bottom: 'auto',
    display: 'none',
    width,
    maxHeight,
  });

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (parentRef.current && !parentRef.current.contains(event.target as Node))
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        close();
      }
  };

  useEffect(() => {
    if (popupRef.current) {
      const boundsBlock = popupRef.current.getBoundingClientRect();

      const positionStyles = {
        left: 'auto',
        right: 'auto',
        top: 'auto',
        bottom: 'auto',
      };
      if (boundsBlock.x < window.innerWidth / 2) {
        positionStyles.left = '0';
        positionStyles.right = 'auto';
      } else {
        if (window.innerWidth - boundsBlock.x > 250) {
          positionStyles.left = '0';
          positionStyles.right = 'auto';
        } else {
          positionStyles.left = 'auto';
          positionStyles.right = '0';
        }
      }

      if (boundsBlock.y < window.innerHeight / 2) {
        positionStyles.top = 'calc(100% + 10px)';
        positionStyles.bottom = 'auto';
      } else {
        positionStyles.top = 'auto';
        positionStyles.bottom = 'calc(100% + 10px)';
      }

      setBodyStyles({
        ...bodyStyles,
        ...positionStyles,
        display: 'block',
      });
    }
  }, [popupRef.current]);

  return (
    <div ref={popupRef} style={bodyStyles} className={styles.root__body} onClick={() => close()}>
      {children}
    </div>
  );
};

export default ContextMenu;
