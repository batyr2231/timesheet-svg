import React from 'react';
import type { ScheduleDay } from '../../types';

interface DayCellProps {
  day: ScheduleDay;
  onClick?: () => void;
}

export const DayCell: React.FC<DayCellProps> = ({ day, onClick }) => {
  const PIXELS_PER_HOUR = 3;
  const CELL_WIDTH = 24 * PIXELS_PER_HOUR; // 72px
  const CELL_HEIGHT = 60;
  const x = day.svg_x;

  const workStartX = day.svg_x_work_start || x;
  const workEndX = day.svg_x_work_end || x;
  
  const getCellColor = (): string => {
    if (day.isHollyday === 1) return 'rgba(255,193,7,0.3)';
    if (day.isWorkDay === 0) return '#33363e';
    return '#2a2d35';
  };

  const getWorkColor = (): string => {
    if (day.isLateArrival === 1) return 'rgba(255,193,7,0.3)';
    if (day.isEarlyDeparture === 1) return 'rgba(244,67,54,0.3)';
    return 'rgba(76,175,80,0.3)';
  };

  const getBorderColor = (): string => {
    if (day.isLateArrival === 1) return '#ffc107';
    if (day.isEarlyDeparture === 1) return '#f44336';
    if (day.isWorkDay === 1) return '#4caf50';
    return '#3a3d45';
  };

  const getCellIcon = (): string => {
    if (day.isWorkDay === 0) return '-';
    if (day.isLateArrival === 1) return '⚠';
    if (day.isEarlyDeparture === 1) return '↓';
    return '✓';
  };

  const isOvernightShift = day.overNight === 1 && day.isWorkDay === 1;

  // Для суточных смен: рассчитываем часть в текущем дне
  const dayEndX = x + CELL_WIDTH; // Конец текущего дня
  const workWidthInThisDay = isOvernightShift 
    ? Math.min(workEndX, dayEndX) - workStartX // До конца дня или до конца смены
    : workEndX - workStartX;

  return (
    <g 
      className="day-cell" 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Фон всего дня */}
      <rect
        x={x}
        y={0}
        width={CELL_WIDTH}
        height={CELL_HEIGHT}
        fill={getCellColor()}
        stroke="#3a3d45"
        strokeWidth="0.5"
      />

      {/* Рабочие часы - заливка */}
      {day.isWorkDay === 1 && workWidthInThisDay > 0 && (
        <>
          <rect
            x={workStartX}
            y={0}
            width={workWidthInThisDay}
            height={CELL_HEIGHT}
            fill={getWorkColor()}
            stroke={getBorderColor()}
            strokeWidth="1.5"
            rx={isOvernightShift ? 0 : 4}
          />

          {/* Градиент для суточных */}
          {isOvernightShift && (
            <>
              <rect
                x={workStartX}
                y={0}
                width={workWidthInThisDay}
                height={CELL_HEIGHT}
                fill="url(#overnight-gradient)"
                opacity="0.4"
              />
              <line
                x1={workStartX}
                y1={CELL_HEIGHT - 3}
                x2={workStartX + workWidthInThisDay}
                y2={CELL_HEIGHT - 3}
                stroke="#9c27b0"
                strokeWidth="3"
              />
            </>
          )}
        </>
      )}

      {/* Номер дня */}
      <text
        x={x + CELL_WIDTH / 2}
        y={CELL_HEIGHT / 2 - 8}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ffffff"
        fontSize="14"
        fontWeight="600"
      >
        {day.date.split('.')[0]}
      </text>

      {/* Иконка статуса */}
      {day.isWorkDay === 1 && (
        <text
          x={x + CELL_WIDTH / 2}
          y={CELL_HEIGHT / 2 + 10}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="12"
        >
          {getCellIcon()}
        </text>
      )}

      {/* Время прихода */}
      {day.checkIn !== '--' && day.isWorkDay === 1 && (
        <text
          x={x + CELL_WIDTH / 2}
          y={CELL_HEIGHT - 8}
          textAnchor="middle"
          fill="#8a8d95"
          fontSize="8"
        >
          {day.checkIn}
        </text>
      )}
    </g>
  );
};