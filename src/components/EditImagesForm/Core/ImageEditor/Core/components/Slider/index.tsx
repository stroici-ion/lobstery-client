import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styles from './styles.module.scss';

interface ISlider {
  id: number;
  value: number;
  initialValue: number;
  onChange: (id: number, value: number) => void;
  onMouseUp?: () => void;
  title?: string;
  icon?: JSX.Element;
  startValue?: number;
  maxValue?: number;
  minValue?: number;
  multiplicator?: number;
  step?: number;
}

const Slider: React.FC<ISlider> = ({ id, value, initialValue, title = '', icon, maxValue = 100, minValue = -100, onChange, onMouseUp, step = 1 }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);

  const initialRel = useMemo(() => (initialValue - minValue) / (maxValue - minValue), [initialValue, minValue, maxValue]);

  const getPositionByValue = (x: number) => {
    if (x === initialValue) return initialRel;
    if (x === minValue) return 0;
    if (x === maxValue) return 1;
    const range = maxValue - minValue;
    const v = x - minValue;

    return v / range;
  };

  const [position, setPosition] = useState({ point: initialRel, left: 0, right: 0 });
  useEffect(() => {
    if (valueRef.current !== value) {
      valueRef.current = value;
      const v = getPositionByValue(value);
      getComputedStyles(v);
    }
  }, [value]);

  const pointRef = useRef(getPositionByValue(value));
  const parentSize = useRef({ x: 0, width: 0 });

  const isMouseDown = useRef(false);

  const stickiness = 0.02;

  const getCursorRelativePosition = (x: number) => {
    return (x - parentSize.current.x) / parentSize.current.width;
  };

  const getStickyPosition = (x: number, initial: number) => {
    if (x <= stickiness) return 0;
    else if (x >= 1 - stickiness) return 1;
    if (initial) if (x >= initial - stickiness && x <= initial + stickiness) return initial;
    return x;
  };

  const getValueByPosition = (x: number) => {
    if (x === initialRel) return initialValue;
    if (!x) return minValue;
    if (x === 1) return maxValue;
    if (x > initialRel + stickiness) {
      const relRange = 1 - initialRel - stickiness * 2;
      const relValue = x - initialRel - stickiness;
      const rel = relValue / relRange;
      return initialValue + Math.ceil((maxValue - initialValue - step) * rel);
    } else {
      const relRange = initialRel - stickiness * 2;
      const relValue = initialRel - x - stickiness;
      const rel = 1 - relValue / relRange;
      return minValue + Math.ceil((initialValue - minValue - step) * rel);
    }
  };

  const getComputedStyles = (x: number) => {
    const point = getStickyPosition(x, initialRel);
    const right = point > initialRel ? point - initialRel : 0;
    const left = point < initialRel ? initialRel - point : 0;
    pointRef.current = point;
    setPosition({ point, left, right });
  };

  const updateValue = () => {
    const v = getValueByPosition(pointRef.current);
    if (v !== valueRef.current) {
      onChange(id, v);
      valueRef.current = v;
    }
  };

  useEffect(() => {
    if (barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      parentSize.current.x = rect.x;
      parentSize.current.width = rect.width;
    }
  }, [barRef.current]);

  const mouseDown = useCallback((e: MouseEvent) => {
    if (barRef.current && e.target && (barRef.current.contains(e.target as Node) || barRef.current === e.target)) {
      isMouseDown.current = true;

      getComputedStyles(getCursorRelativePosition(e.clientX));
      updateValue();
    }
  }, []);

  const mouseMove = useCallback((e: MouseEvent) => {
    if (isMouseDown.current) {
      getComputedStyles(getCursorRelativePosition(e.clientX));
      updateValue();
    }
  }, []);

  const mouseUp = useCallback(() => {
    if (isMouseDown.current && onMouseUp) onMouseUp();
    isMouseDown.current = false;
  }, []);

  const resize = useCallback(() => {
    if (barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      parentSize.current.x = rect.x;
      parentSize.current.width = rect.width;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
      window.removeEventListener('resize', resize);
    };
  }, [mouseDown, mouseMove, mouseUp, resize]);

  return (
    <div className={styles.slider} ref={sliderRef}>
      {title && (
        <div className={styles.slider__top}>
          {icon && <div className={styles.slider__icon}>{icon}</div>}
          <p className={styles.slider__title}>{title}</p>
          <p className={styles.slider__value}>{value}</p>
        </div>
      )}
      <div ref={barRef} className={styles.bar}>
        <div className={styles.bar__control} style={{ left: `${position.point * 100}%` }}>
          <div className={styles.bar__controlPoint} />
        </div>
        <div className={styles.bar__left} style={{ left: `${initialRel * 100}%`, width: `${position.left * 100}%` }}></div>
        <div className={styles.bar__right} style={{ left: `${initialRel * 100}%`, width: `${position.right * 100}%` }}></div>
      </div>
    </div>
  );
};

export default Slider;
