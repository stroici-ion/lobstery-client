import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { defaultContextMenuMaxHeight, defaultContextMenuWidth } from '../../utils/consts';
import SmallButton from '../UI/buttons/SmallButton';
import { SubmenuSvg } from '../../icons';
import styles from './styles.module.scss';

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
    right: '0',
    top: 'calc(100% + 5px)',
    bottom: 'auto',
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
      if (boundsBlock.x < 200) {
        setBodyStyles({
          ...bodyStyles,
          left: '0',
          right: 'auto',
          bottom: 'calc(100% + 5px)',
          top: 'auto',
        });
      }
    }
  }, [popupRef.current]);

  return (
    <div ref={popupRef} style={bodyStyles} className={styles.root__body} onClick={() => close()}>
      {children}
    </div>
  );
};

export default ContextMenu;
