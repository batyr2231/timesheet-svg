// Сотрудник
export interface Employee {
  id: number;
  enrollId: number;
  employerId: number;
  companyId: number;
  companyName: string;
  userName: string;
  userAvatar: string;
  schedId: number;
  schedName: string;
}

// День в графике
export interface ScheduleDay {
  id: number;
  sched_id: number;
  isWorkDay: 0 | 1;
  isHollyday: 0 | 1;
  day_status: string;
  emploerId: number;
  enrollid: number;
  date: string; // dd.mm.yyyy
  year: number;
  month: string;
  dayWeek: string;
  is_validated_late_arrival: 0 | 1;
  overNight: 0 | 1;
  work_start_unix: number;
  first_fact_unix: number;
  checkIn: string;
  arrival_min_unix: number;
  arrival_max_unix: number;
  work_end_unix: number;
  last_fact_unix: number;
  checkOut: string;
  depart_min_unix: number;
  depart_max_unix: number;
  planHours: string;
  factHours: string;
  isLateArrival: 0 | 1;
  isEarlyDeparture: 0 | 1;
  LAtotalMins: number;
  EAtotalMins: number;
  EDtotalMins: number;
  svg_x: number; // Координата X для SVG
  svg_x_work_start?: number; //  Начало работы (по часам)
  svg_x_work_end?: number; //  Конец работы (по часам)
}