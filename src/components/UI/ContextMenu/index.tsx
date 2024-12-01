import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import useClickOutside from '../../../hooks/useClickOutside';

interface ElementSizeAndPosition {
  top: string;
  left: string;
  right: string;
  bottom: string;
}

interface IHighlightContextMenu {
  position: ElementSizeAndPosition;
  children: React.ReactNode;
  className?: string;
  onHide: () => void;
}

const ContextMenu: React.FC<IHighlightContextMenu> = ({ position, className, children, onHide }) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onHide);

  return (
    <div className={styles.fullScreenOveraly}>
      <div ref={ref} className={classNames(styles.wrapper)} onClick={onHide} style={{ ...position }}>
        {children}
      </div>
    </div>
  );
};

export default ContextMenu;
