import React from 'react';
import './TimesheetHeader.scss';

interface TimesheetHeaderProps {
  year: number;
  month: number;
}

export const TimesheetHeader: React.FC<TimesheetHeaderProps> = ({ year, month }) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const CELL_WIDTH = 72;
  const TOTAL_WIDTH = daysInMonth * CELL_WIDTH;
  const HEADER_HEIGHT = 50;

  // Текущая дата
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month - 1;
  const currentDay = isCurrentMonth ? today.getDate() : 0;

  // Дни месяца
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    return {
      day,
      dayName: dayNames[dayOfWeek],
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      x: i * CELL_WIDTH
    };
  });

  return (
    <div className="timesheet-header">
      <div className="timesheet-header__left">
        {/* Пустое место под инфо сотрудников */}
      </div>

      <div className="timesheet-header__days">
        <svg
          viewBox={`0 0 ${TOTAL_WIDTH} ${HEADER_HEIGHT}`}
          width={TOTAL_WIDTH}
          height={HEADER_HEIGHT}
          className="header-svg"
        >
          {/* Фон */}
          <rect
            x={0}
            y={0}
            width={TOTAL_WIDTH}
            height={HEADER_HEIGHT}
            fill="#3a3d45"
          />

          
            {/* Индикатор текущего дня - ЛИНИЯ */}
            {currentDay > 0 && (
            <>
                {/* Вертикальная линия */}
                <line
                x1={currentDay * CELL_WIDTH}
                y1={0}
                x2={currentDay * CELL_WIDTH}
                y2={HEADER_HEIGHT}
                stroke="#2196f3"
                strokeWidth="2"
                />
            </>
            )}

          {/* Дни */}
          {days.map(({ day, dayName, isWeekend, x }) => (
            <g key={day}>
              {/* Разделитель */}
              <line
                x1={x}
                y1={0}
                x2={x}
                y2={HEADER_HEIGHT}
                stroke="#4a4d55"
                strokeWidth="1"
              />

              {/* Фон для выходных */}
              {isWeekend && (
                <rect
                  x={x}
                  y={0}
                  width={CELL_WIDTH}
                  height={HEADER_HEIGHT}
                  fill="rgba(0, 0, 0, 0.2)"
                />
              )}

              {/* Номер дня */}
              <text
                x={x + CELL_WIDTH / 2}
                y={HEADER_HEIGHT / 2 - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={day === currentDay ? '#2196f3' : '#ffffff'}
                fontSize="16"
                fontWeight={day === currentDay ? '700' : '600'}
              >
                {String(day).padStart(2, '0')}
              </text>

              {/* День недели */}
              <text
                x={x + CELL_WIDTH / 2}
                y={HEADER_HEIGHT / 2 + 10}
                textAnchor="middle"
                fill={isWeekend ? '#ffc107' : '#8a8d95'}
                fontSize="10"
                fontWeight="500"
              >
                {dayName}
              </text>
            </g>
          ))}

          {/* Линия текущего дня (вертикальная) */}
          {currentDay > 0 && (
            <line
              x1={currentDay * CELL_WIDTH}
              y1={0}
              x2={currentDay * CELL_WIDTH}
              y2={HEADER_HEIGHT}
              stroke="#2196f3"
              strokeWidth="3"
            />
          )}
        </svg>
      </div>

      <div className="timesheet-header__right">
        {/* Пустое место под итоги */}
      </div>
    </div>
  );
};