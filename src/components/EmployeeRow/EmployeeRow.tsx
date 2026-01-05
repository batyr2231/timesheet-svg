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
      const hours = d.planHours !== '--' ? parseInt(d.planHours.split(':')[0]) : 0;
      return sum + hours;
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
            {days.map((day) => (
              <DayCell 
                key={`day-${employee.id}-${day.id}`} 
                day={day}
                onClick={() => setSelectedDay(day)}
              />
            ))}

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
            <span className="total-value">{totalHours}ч</span>
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