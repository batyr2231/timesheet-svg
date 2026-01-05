import React from 'react';
import type { ScheduleDay, Employee } from '../../types';
import './DayModal.scss';

interface DayModalProps {
  day: ScheduleDay;
  employee: Employee;
  onClose: () => void;
}

export const DayModal: React.FC<DayModalProps> = ({ day, employee, onClose }) => {
  const getStatusText = (): string => {
    if (day.isWorkDay === 0) return 'Выходной';
    if (day.isHollyday === 1) return 'Праздник';
    if (day.isLateArrival === 1) return 'Опоздание';
    if (day.isEarlyDeparture === 1) return 'Ранний уход';
    return 'Норма';
  };

  const getStatusColor = (): string => {
    if (day.isLateArrival === 1) return '#ffc107';
    if (day.isEarlyDeparture === 1) return '#f44336';
    if (day.isWorkDay === 1) return '#4caf50';
    return '#8a8d95';
  };

  const getInitials = (name: string): string => {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('');
  };

  return (
    <div className="day-modal-overlay" onClick={onClose}>
      <div className="day-modal" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="day-modal__header">
          <div className="day-modal__title">
            <span className="day-modal__date">{day.date}</span>
            <span className="day-modal__weekday">{day.dayWeek}</span>
          </div>
          <button className="day-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Информация о сотруднике */}
        <div className="day-modal__employee">
          <div className="day-modal__avatar">
            {getInitials(employee.userName)}
          </div>
          <div className="day-modal__employee-info">
            <div className="day-modal__name">{employee.userName}</div>
            <div className="day-modal__schedule">{employee.schedName}</div>
          </div>
        </div>

        {/* Статус */}
        <div className="day-modal__status" style={{ borderColor: getStatusColor() }}>
          <span className="day-modal__status-label">Статус:</span>
          <span className="day-modal__status-value" style={{ color: getStatusColor() }}>
            {getStatusText()}
          </span>
        </div>

        {/* Время работы */}
        {day.isWorkDay === 1 && (
          <div className="day-modal__time">
            <div className="time-block">
              <div className="time-block__label">Приход</div>
              <div className="time-block__values">
                <div className="time-value">
                  <span className="time-value__label">План:</span>
                  <span className="time-value__time">{day.checkIn}</span>
                </div>
                <div className="time-value">
                  <span className="time-value__label">Факт:</span>
                  <span className="time-value__time">{day.checkIn}</span>
                </div>
              </div>
            </div>

            <div className="time-block">
              <div className="time-block__label">Уход</div>
              <div className="time-block__values">
                <div className="time-value">
                  <span className="time-value__label">План:</span>
                  <span className="time-value__time">{day.checkOut}</span>
                </div>
                <div className="time-value">
                  <span className="time-value__label">Факт:</span>
                  <span className="time-value__time">{day.checkOut}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Часы */}
        {day.isWorkDay === 1 && (
          <div className="day-modal__hours">
            <div className="hours-item">
              <span className="hours-item__label">План:</span>
              <span className="hours-item__value">{day.planHours}</span>
            </div>
            <div className="hours-item">
              <span className="hours-item__label">Факт:</span>
              <span className="hours-item__value">{day.factHours}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};