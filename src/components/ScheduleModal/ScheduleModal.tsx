import React, { useState } from 'react';
import type { Employee } from '../../types';
import './ScheduleModal.scss';

interface Schedule {
  id: number;
  name: string;
  description: string;
  type: '5/2' | '2/2' | '1/3';
}

interface ScheduleModalProps {
  employee: Employee;
  onClose: () => void;
  onAssign?: (scheduleId: number, startDate: string) => void;
}

const availableSchedules: Schedule[] = [
  { id: 1, name: '5/2 (09:00-18:00)', description: 'Пятидневка, 8 часов', type: '5/2' },
  { id: 2, name: '2/2 (08:00-20:00)', description: 'Двухдневка, 12 часов', type: '2/2' },
  { id: 3, name: '1/3 (08:00-08:00)', description: 'Сутки через трое, 24 часа', type: '1/3' },
];

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ employee, onClose, onAssign }) => {
  const [selectedScheduleId, setSelectedScheduleId] = useState<number>(employee.schedId);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Текущая дата
  );

  const handleAssign = () => {
    if (onAssign) {
      onAssign(selectedScheduleId, startDate);
    }
    onClose();
  };

  const getInitials = (name: string): string => {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('');
  };

  return (
    <div className="schedule-modal-overlay" onClick={onClose}>
      <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="schedule-modal__header">
          <h2 className="schedule-modal__title">Назначить график</h2>
          <button className="schedule-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Информация о сотруднике */}
        <div className="schedule-modal__employee">
          <div className="schedule-modal__avatar">
            {getInitials(employee.userName)}
          </div>
          <div className="schedule-modal__employee-info">
            <div className="schedule-modal__name">{employee.userName}</div>
            <div className="schedule-modal__company">{employee.companyName}</div>
          </div>
        </div>

        {/* Выбор графика */}
        <div className="schedule-modal__section">
          <label className="schedule-modal__label">Выберите график:</label>
          <div className="schedule-list">
            {availableSchedules.map((schedule) => (
              <button
                key={schedule.id}
                className={`schedule-card ${selectedScheduleId === schedule.id ? 'active' : ''}`}
                onClick={() => setSelectedScheduleId(schedule.id)}
              >
                <div className="schedule-card__name">{schedule.name}</div>
                <div className="schedule-card__description">{schedule.description}</div>
                {selectedScheduleId === schedule.id && (
                  <div className="schedule-card__check">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Дата начала */}
        <div className="schedule-modal__section">
          <label className="schedule-modal__label">Дата начала:</label>
          <input
            type="date"
            className="schedule-modal__date-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* Кнопки действий */}
        <div className="schedule-modal__actions">
          <button className="btn btn--secondary" onClick={onClose}>
            Отмена
          </button>
          <button className="btn btn--primary" onClick={handleAssign}>
            Назначить график
          </button>
        </div>
      </div>
    </div>
  );
};