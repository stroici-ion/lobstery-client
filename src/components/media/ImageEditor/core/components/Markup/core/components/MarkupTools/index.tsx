import React, { useCallback, useEffect, useState } from 'react';

import { DrawPenSvg, EraseAllSvg, EraseSvg } from '../../../../../icons';
import { EMarkupBrushTypes, EMarkupToolTypes } from '../../../../../../types/enums';
import { IMarkupBrush, IMarkupTool } from '../../../../../../types/interfaces';
import styles from './styles.module.scss';
import BrushButton from '../BrushButton';
import ToolButton from '../ToolButton';

interface IMarkupTools {
  activeBrush: IMarkupBrush | undefined;
  setActiveBrush: (brush: IMarkupBrush) => void;
  activeTool: IMarkupTool | undefined;
  setActiveTool: (tool: IMarkupTool) => void;
  toolClick: (tool: IMarkupTool) => void;
}

const MarkupTools: React.FC<IMarkupTools> = ({ activeBrush, setActiveBrush, activeTool, setActiveTool, toolClick }) => {
  const [brushes, setBrushes] = useState<IMarkupBrush[]>([
    {
      id: 1,
      size: 10,
      type: EMarkupBrushTypes.freeHand,
      color: '#fed430',
      icon: <DrawPenSvg />,
    },
    {
      id: 2,
      size: 4,
      type: EMarkupBrushTypes.straight,
      color: '#e3182d',
      icon: <DrawPenSvg />,
    },
  ]);

  const tools = [
    {
      id: 1,
      type: EMarkupToolTypes.erase,
      icon: <EraseSvg />,
    },
    {
      id: 2,
      notActivable: true,
      type: EMarkupToolTypes.eraseAll,
      icon: <EraseAllSvg />,
    },
  ];

  useEffect(() => {
    if (!activeBrush && !activeTool) {
      setActiveBrush(brushes[0]);
    }
  }, [activeBrush, activeTool]);

  const handleBrushClick = (brush: IMarkupBrush) => {
    setActiveBrush(brush);
  };

  const handleToolClick = (tool: IMarkupTool) => {
    if (tool.notActivable) {
      toolClick(tool);
      return;
    }
    setActiveTool(tool);
  };

  const selectedBrush = activeBrush || undefined;
  const selectedTool = activeTool || undefined;

  const handleChangeBrush = useCallback((newBrush: IMarkupBrush) => {
    setActiveBrush(newBrush);
    setBrushes(brushes.map((brush) => (brush.id === newBrush.id ? { ...newBrush } : brush)));
  }, []);

  return (
    <div className={styles.tools}>
      {brushes.map((brush) => (
        <BrushButton
          onChange={handleChangeBrush}
          brush={brush}
          isActive={selectedBrush !== undefined && brush.id === selectedBrush.id}
          onClick={() => handleBrushClick(brush)}
          key={brush.id}
        />
      ))}
      {tools.map((tool) => (
        <ToolButton
          tool={tool}
          isActive={selectedTool !== undefined && tool.id === selectedTool.id}
          onClick={() => handleToolClick(tool)}
          key={tool.id}
        />
      ))}
    </div>
  );
};

export default MarkupTools;
