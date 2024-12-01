import React, { useState } from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';

interface IButtonsRow {
  buttons: IButtonsRowButton[];
  className?: string;
}

export type IButtonsRowButton = {
  id: number;
  className?: string;
  onClick?: () => void;
  children: JSX.Element;
};

const ButtonsRow: React.FC<IButtonsRow> = ({ buttons, className }) => {
  const [activeId, setActiveId] = useState(1);

  return (
    <div className={classNames(styles.root, className)}>
      {buttons.map((b) => (
        <button
          key={b.id}
          children={b.children}
          onClick={() => {
            setActiveId(b.id);
            b.onClick?.();
          }}
          className={classNames(styles.root__button, b.className, b.id === activeId && styles.active)}
        />
      ))}
    </div>
  );
};
export default ButtonsRow;
