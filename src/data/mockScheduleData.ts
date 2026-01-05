import type { Employee, ScheduleDay } from '../types';

// 2 моковых сотрудника
export const mockEmployees: Employee[] = [
  {
    id: 1,
    enrollId: 1001,
    employerId: 101,
    companyId: 1,
    companyName: 'ТОО "Казахстан Темир Жолы"',
    userName: 'Иванов Иван Иванович',
    userAvatar: 'avatar_1.jpg',
    schedId: 1,
    schedName: '5/2 (09:00-18:00)'
  },
  {
    id: 2,
    enrollId: 1002,
    employerId: 102,
    companyId: 1,
    companyName: 'ТОО "Казахстан Темир Жолы"',
    userName: 'Петров Петр Петрович',
    userAvatar: 'avatar_2.jpg',
    schedId: 2,
    schedName: '1/3 Сутки (08:00-08:00)'
  }
];

// Генератор 31 дня для сотрудника
export const generateMockMonth = (
  employee: Employee,
  year: number = 2025,
  month: number = 1
): ScheduleDay[] => {
  const days: ScheduleDay[] = [];
  const daysInMonth = 31;
  const PIXELS_PER_HOUR = 3;
  const HOURS_PER_DAY = 24;
  const PIXELS_PER_DAY = HOURS_PER_DAY * PIXELS_PER_HOUR;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isWorkDay = employee.schedId === 1 ? !isWeekend : day % 4 === 1;

    const dateStr = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const startOfDay = new Date(year, month - 1, day, 9, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 18, 0, 0);

    const dayStartX = (day - 1) * PIXELS_PER_DAY;
    const workStartHour = 9;
    const workEndHour = 18;
    const workStartX = dayStartX + (workStartHour * PIXELS_PER_HOUR);
    const workEndX = dayStartX + (workEndHour * PIXELS_PER_HOUR);
    const overnightStartX = dayStartX + (8 * PIXELS_PER_HOUR);
    const overnightEndX = dayStartX + PIXELS_PER_DAY + (8 * PIXELS_PER_HOUR);

    days.push({
      id: parseInt(`${employee.id}${year}${month}${String(day).padStart(2, '0')}`),
      sched_id: employee.schedId,
      isWorkDay: isWorkDay ? 1 : 0,
      isHollyday: 0,
      day_status: '--',
      emploerId: employee.employerId,
      enrollid: employee.enrollId,
      date: dateStr,
      year: year,
      month: monthNames[month - 1],
      dayWeek: dayNames[dayOfWeek],
      is_validated_late_arrival: 0,
      overNight: employee.schedId === 2 ? 1 : 0,
      work_start_unix: isWorkDay ? Math.floor(startOfDay.getTime() / 1000) : 0,
      first_fact_unix: isWorkDay ? Math.floor(startOfDay.getTime() / 1000) + 300 : 0,
      checkIn: isWorkDay ? '09:05' : '--',
      arrival_min_unix: 0,
      arrival_max_unix: 0,
      work_end_unix: isWorkDay ? Math.floor(endOfDay.getTime() / 1000) : 0,
      last_fact_unix: isWorkDay ? Math.floor(endOfDay.getTime() / 1000) - 600 : 0,
      checkOut: isWorkDay ? '17:50' : '--',
      depart_min_unix: 0,
      depart_max_unix: 0,
      planHours: isWorkDay ? '08:00' : '--',
      factHours: isWorkDay ? '07:45' : '--',
      isLateArrival: isWorkDay && Math.random() > 0.8 ? 1 : 0,
      isEarlyDeparture: isWorkDay && Math.random() > 0.9 ? 1 : 0,
      LAtotalMins: 0,
      EAtotalMins: 0,
      EDtotalMins: 0,
      svg_x: dayStartX,
      svg_x_work_start: employee.schedId === 2 ? overnightStartX : workStartX,
      svg_x_work_end: employee.schedId === 2 ? overnightEndX : workEndX,
    });
  }

  return days;
};

// Итоговые данные
export const mockScheduleData = mockEmployees.map(emp => ({
  employee: emp,
  days: generateMockMonth(emp)
}));