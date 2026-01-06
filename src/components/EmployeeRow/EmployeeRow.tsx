import React, { useState } from 'react';
import { DayCell } from '../DayCell/DayCell';
import { DayModal } from '../DayModal/DayModal';
import { ScheduleModal } from '../ScheduleModal/ScheduleModal'; // ← ДОБАВИЛИ
import type { Employee, ScheduleDay } from '../../types';
import './EmployeeRow.scss';

interface EmployeeRowProps {
  employee: Employee;
  days: ScheduleDay[];
}

export const EmployeeRow: React.FC<EmployeeRowProps> = ({ employee, days }) => {
  const TOTAL_WIDTH = 31 * 72;
  const CELL_HEIGHT = 60;

  const [selectedDay, setSelectedDay] = useState<ScheduleDay | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false); // ← ДОБАВИЛИ

const totalHours = days
  .filter(d => d.isWorkDay === 1)
  .reduce((sum, d) => {
    // ← ИСПРАВИЛИ: берём из factHours, а не planHours
    if (d.factHours !== '--') {
      const [hours, mins] = d.factHours.split(':').map(Number);
      return sum + hours + (mins / 60);
    }
    return sum;
  }, 0);

const lateCount = days.filter(d => d.isLateArrival === 1).length;
const earlyDepartCount = days.filter(d => d.isEarlyDeparture === 1).length;

  const getInitials = (name: string): string => {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('');
  };

  // ← ДОБАВИЛИ обработчик назначения графика
  const handleAssignSchedule = (scheduleId: number, startDate: string) => {
    console.log('Назначен график:', scheduleId, 'с даты:', startDate);
    // Здесь будет логика сохранения на сервер
  };

  return (
    <>
      <div className="employee-row">
        <div className="employee-row__info">
          <div className="employee-row__avatar">
            {getInitials(employee.userName)}
          </div>
          <div className="employee-row__details">
            <div className="employee-row__name">{employee.userName}</div>
            <div className="employee-row__company">{employee.companyName}</div>
            <div className="employee-row__schedule">
              <span 
                className="badge" 
                onClick={() => setShowScheduleModal(true)} // ← ДОБАВИЛИ клик
              >
                {employee.schedName}
              </span>
            </div>
          </div>
        </div>

        <div className="employee-row__days">
            <svg
            viewBox={`0 0 ${TOTAL_WIDTH} ${CELL_HEIGHT}`}
            width={TOTAL_WIDTH}
            height={CELL_HEIGHT}
            className="days-svg"
            >
            {/* Основные дни */}
            {days.map((day) => (
                <DayCell 
                key={`day-${employee.id}-${day.id}`} 
                day={day}
                onClick={() => setSelectedDay(day)}
                />
            ))}

            {/* ← ДОБАВИЛИ: Продолжения суточных смен */}
            {days.map((day, index) => {
                if (day.overNight === 1 && day.isWorkDay === 1 && index < days.length - 1) {
                const nextDay = days[index + 1];
                const PIXELS_PER_HOUR = 3;
                const CELL_WIDTH = 72;
                
                // Начало следующего дня
                const nextDayStartX = nextDay.svg_x;
                // Конец смены (8:00 следующего дня)
                const workEndX = day.svg_x_work_end || 0;
                // Ширина части смены в следующем дне
                const continuationWidth = workEndX - nextDayStartX;
                
                if (continuationWidth > 0) {
                    return (
                    <g key={`continuation-${day.id}`}>
                        <rect
                        x={nextDayStartX}
                        y={0}
                        width={continuationWidth}
                        height={CELL_HEIGHT}
                        fill="rgba(76,175,80,0.3)"
                        stroke="#4caf50"
                        strokeWidth="1.5"
                        />
                        <rect
                        x={nextDayStartX}
                        y={0}
                        width={continuationWidth}
                        height={CELL_HEIGHT}
                        fill="url(#overnight-gradient)"
                        opacity="0.4"
                        />
                        <line
                        x1={nextDayStartX}
                        y1={CELL_HEIGHT - 3}
                        x2={nextDayStartX + continuationWidth}
                        y2={CELL_HEIGHT - 3}
                        stroke="#9c27b0"
                        strokeWidth="3"
                        />
                    </g>
                    );
                }
                }
                return null;
            })}

            <defs>
                <linearGradient id="overnight-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2196f3" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#9c27b0" stopOpacity="0.6" />
                </linearGradient>
            </defs>
            </svg>
        </div>

        <div className="employee-row__totals">
          <div className="total-item">
            <span className="total-label">Часы</span>
            <span className="total-value">{Math.round(totalHours)}ч</span>
          </div>
          <div className="total-item">
            <span className="total-label">Опозд</span>
            <span className={`total-value ${lateCount > 0 ? 'text-warning' : ''}`}>
              {lateCount}
            </span>
          </div>
          <div className="total-item">
            <span className="total-label">Ран.ух</span>
            <span className={`total-value ${earlyDepartCount > 0 ? 'text-danger' : ''}`}>
              {earlyDepartCount}
            </span>
          </div>
        </div>
      </div>

      {/* Модалка просмотра дня */}
      {selectedDay && (
        <DayModal
          day={selectedDay}
          employee={employee}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {/* ← ДОБАВИЛИ модалку назначения графика */}
      {showScheduleModal && (
        <ScheduleModal
          employee={employee}
          onClose={() => setShowScheduleModal(false)}
          onAssign={handleAssignSchedule}
        />
      )}
    </>
  );
};