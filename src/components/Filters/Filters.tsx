import React from 'react';
import './Filters.scss';

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  selectedSchedule: string;
  onScheduleChange: (value: string) => void;
  showOnlyLate: boolean;
  onShowOnlyLateChange: (value: boolean) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedSchedule,
  onScheduleChange,
  showOnlyLate,
  onShowOnlyLateChange,
}) => {
  return (
    <div className="filters">
      {/* Поиск */}
      <div className="filters__search">
        <input
          type="text"
          className="filters__search-input"
          placeholder="Поиск по ФИО..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <span className="filters__search-icon">🔍</span>
      </div>

      {/* Фильтр по отделу */}
      <div className="filters__group">
        <select
          className="filters__select"
          value={selectedDepartment}
          onChange={(e) => onDepartmentChange(e.target.value)}
        >
          <option value="">Все отделы</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
        </select>
      </div>

      {/* Фильтр по графику */}
      <div className="filters__group">
        <select
          className="filters__select"
          value={selectedSchedule}
          onChange={(e) => onScheduleChange(e.target.value)}
        >
          <option value="">Все графики</option>
          <option value="5/2">5/2</option>
          <option value="2/2">2/2</option>
          <option value="1/3">1/3</option>
        </select>
      </div>

      {/* Показать только с опозданиями */}
      <div className="filters__checkbox">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showOnlyLate}
            onChange={(e) => onShowOnlyLateChange(e.target.checked)}
          />
          <span className="checkbox-text">Только с опозданиями</span>
        </label>
      </div>

      {/* Счетчик */}
      <div className="filters__info">
        {searchQuery || selectedDepartment || selectedSchedule || showOnlyLate ? (
          <button 
            className="filters__reset"
            onClick={() => {
              onSearchChange('');
              onDepartmentChange('');
              onScheduleChange('');
              onShowOnlyLateChange(false);
            }}
          >
            Сбросить фильтры
          </button>
        ) : null}
      </div>
    </div>
  );
};