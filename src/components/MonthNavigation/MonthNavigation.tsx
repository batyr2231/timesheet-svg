import React from 'react';
import './MonthNavigation.scss';

interface MonthNavigationProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onMonthSelect: (year: number, month: number) => void;
}

const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const MonthNavigation: React.FC<MonthNavigationProps> = ({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onMonthSelect,
}) => {
  const currentDate = new Date();
  const isCurrentMonth = year === currentDate.getFullYear() && month === currentDate.getMonth() + 1;

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    onMonthSelect(year, newMonth);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    onMonthSelect(newYear, month);
  };

  const goToToday = () => {
    onMonthSelect(currentDate.getFullYear(), currentDate.getMonth() + 1);
  };

  // Генерируем годы (текущий ± 5 лет)
  const years = Array.from({ length: 11 }, (_, i) => currentDate.getFullYear() - 5 + i);

  return (
    <div className="month-navigation">
      <div className="month-navigation__controls">
        {/* Кнопка назад */}
        <button className="month-navigation__btn" onClick={onPrevMonth}>
          ←
        </button>

        {/* Селекты месяца и года */}
        <div className="month-navigation__selects">
          <select
            className="month-navigation__select"
            value={month}
            onChange={handleMonthChange}
          >
            {monthNames.map((name, index) => (
              <option key={index} value={index + 1}>
                {name}
              </option>
            ))}
          </select>

          <select
            className="month-navigation__select"
            value={year}
            onChange={handleYearChange}
          >
            {years.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Кнопка вперед */}
        <button className="month-navigation__btn" onClick={onNextMonth}>
          →
        </button>

        {/* Кнопка "Сегодня" */}
        {!isCurrentMonth && (
          <button className="month-navigation__today" onClick={goToToday}>
            Сегодня
          </button>
        )}
      </div>
    </div>
  );
};