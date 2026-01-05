import React, { useState, useMemo } from 'react';
import { TimesheetHeader } from '../TimesheetHeader/TimesheetHeader';
import { MonthNavigation } from '../MonthNavigation/MonthNavigation'; 
import { Filters } from '../Filters/Filters';
import { EmployeeRow } from '../EmployeeRow/EmployeeRow';
import { mockScheduleData } from '../../data/mockScheduleData';
import type { Employee, ScheduleDay } from '../../types';
import './Timesheet.scss';

export const Timesheet: React.FC = () => {
  // ← ИЗМЕНИЛИ: теперь состояние
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(1); // Январь

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [showOnlyLate, setShowOnlyLate] = useState(false);

  // ← ДОБАВИЛИ обработчики навигации
  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleMonthSelect = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  // ← ДОБАВИЛИ название месяца
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const filteredData = useMemo(() => {
    return mockScheduleData.filter(({ employee, days }: { employee: Employee; days: ScheduleDay[] }) => {
      if (searchQuery && !employee.userName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (selectedSchedule) {
        const schedType = employee.schedName.split(' ')[0];
        if (schedType !== selectedSchedule) {
          return false;
        }
      }

      if (showOnlyLate) {
        const hasLate = days.some(d => d.isLateArrival === 1);
        if (!hasLate) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedDepartment, selectedSchedule, showOnlyLate]);

  return (
    <div className="timesheet">
      <div className="timesheet__header">
        <h1 className="timesheet__title">Цифровой Табель</h1>
        <div className="timesheet__period">{monthNames[month - 1]} {year}</div>
      </div>

      {/* ← ДОБАВИЛИ навигацию */}
      <MonthNavigation
        year={year}
        month={month}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onMonthSelect={handleMonthSelect}
      />

      <Filters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        selectedSchedule={selectedSchedule}
        onScheduleChange={setSelectedSchedule}
        showOnlyLate={showOnlyLate}
        onShowOnlyLateChange={setShowOnlyLate}
      />

      <TimesheetHeader year={year} month={month} />

      <div className="timesheet__content">
        {filteredData.length > 0 ? (
          filteredData.map(({ employee, days }) => (
            <EmployeeRow
              key={`employee-${employee.id}`}
              employee={employee}
              days={days}
            />
          ))
        ) : (
          <div className="timesheet__empty">
            <p>Нет сотрудников по заданным фильтрам</p>
          </div>
        )}
      </div>
    </div>
  );
};