import React, { useState, useMemo } from 'react';
import { MonthNavigation } from '../MonthNavigation/MonthNavigation';
import { Filters } from '../Filters/Filters';
import { TimesheetHeader } from '../TimesheetHeader/TimesheetHeader';
import { DayCell } from '../DayCell/DayCell';
import { mockScheduleData } from '../../data/mockScheduleData';
import type { Employee, ScheduleDay } from '../../types';
import './Timesheet.scss';

export const Timesheet: React.FC = () => {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [showOnlyLate, setShowOnlyLate] = useState(false);

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

      {/* НОВАЯ СТРУКТУРА: фиксированные левая/правая колонки */}
      <div className="timesheet__main">
        {/* Левая колонка - ФИО */}
        <div className="timesheet__sidebar-left">
          <div className="timesheet__sidebar-header">Сотрудник</div>
          {filteredData.map(({ employee }) => (
            <div key={`info-${employee.id}`} className="timesheet__employee-info">
              <div className="timesheet__avatar">
                {employee.userName.split(' ').slice(0, 2).map(n => n[0]).join('')}
              </div>
              <div className="timesheet__details">
                <div className="timesheet__name">{employee.userName}</div>
                <div className="timesheet__company">{employee.companyName}</div>
                <div className="timesheet__schedule-badge">
                  <span className="badge">{employee.schedName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Средняя колонка - скроллируемые дни */}
        <div className="timesheet__scroll-container">
          <TimesheetHeader year={year} month={month} />
          
          <div className="timesheet__rows">
            {filteredData.length > 0 ? (
              filteredData.map(({ employee, days }) => (
                <div key={`row-${employee.id}`} className="timesheet__days-row">
                  <svg
                    viewBox={`0 0 ${31 * 72} 60`}
                    width={31 * 72}
                    height={60}
                    className="days-svg"
                  >
                    {days.map((day) => (
                      <DayCell 
                        key={`day-${employee.id}-${day.id}`} 
                        day={day}
                        onClick={() => {
                          console.log('День:', day.date);
                        }}
                      />
                    ))}

                    {/* Продолжения суточных смен */}
                    {days.map((day, index) => {
                      if (day.overNight === 1 && day.isWorkDay === 1 && index < days.length - 1) {
                        const nextDay = days[index + 1];
                        const nextDayStartX = nextDay.svg_x;
                        const workEndX = day.svg_x_work_end || 0;
                        const continuationWidth = workEndX - nextDayStartX;
                        
                        if (continuationWidth > 0) {
                          return (
                            <g key={`continuation-${day.id}`}>
                              <rect
                                x={nextDayStartX}
                                y={0}
                                width={continuationWidth}
                                height={60}
                                fill="rgba(76,175,80,0.3)"
                                stroke="#4caf50"
                                strokeWidth="1.5"
                              />
                              <rect
                                x={nextDayStartX}
                                y={0}
                                width={continuationWidth}
                                height={60}
                                fill="url(#overnight-gradient)"
                                opacity="0.4"
                              />
                              <line
                                x1={nextDayStartX}
                                y1={57}
                                x2={nextDayStartX + continuationWidth}
                                y2={57}
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
              ))
            ) : (
              <div className="timesheet__empty">
                <p>Нет сотрудников по заданным фильтрам</p>
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка - итоги */}
        <div className="timesheet__sidebar-right">
          <div className="timesheet__sidebar-header">Итого</div>
          {filteredData.map(({ employee, days }) => {
            const totalHours = days
              .filter(d => d.isWorkDay === 1)
              .reduce((sum, d) => {
                if (d.factHours !== '--') {
                  const [hours, mins] = d.factHours.split(':').map(Number);
                  return sum + hours + (mins / 60);
                }
                return sum;
              }, 0);

            const lateCount = days.filter(d => d.isLateArrival === 1).length;
            const earlyDepartCount = days.filter(d => d.isEarlyDeparture === 1).length;

            return (
              <div key={`totals-${employee.id}`} className="timesheet__totals">
                <div className="total-item">
                  <span className="total-label">ЧАСЫ</span>
                  <span className="total-value">{Math.round(totalHours)}ч</span>
                </div>
                <div className="total-item">
                  <span className="total-label">ОПОЗД</span>
                  <span className={`total-value ${lateCount > 0 ? 'text-warning' : ''}`}>
                    {lateCount}
                  </span>
                </div>
                <div className="total-item">
                  <span className="total-label">РАН.УХ</span>
                  <span className={`total-value ${earlyDepartCount > 0 ? 'text-danger' : ''}`}>
                    {earlyDepartCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};