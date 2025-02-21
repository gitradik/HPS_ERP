import { ApolloError } from 'apollo-server-express';
import Schedule from '../../models/Schedule';
import moment from 'moment';
import { OvertimeType } from '../../models/ScheduleOvertime';

export const ConflictingScheduleOvertimeError = (
  schedule: Schedule,
  date: Date,
  hours: number,
  type: OvertimeType,
) => {
  const scheduleStart = moment(schedule.start);
  const scheduleEnd = moment(schedule.end);
  const overtimeDate = moment(date);

  // Проверка: дата должна быть в пределах рабочего периода
  if (!overtimeDate.isBetween(scheduleStart, scheduleEnd, 'day', '[]')) {
    throw new ApolloError(
      `Das Datum ${overtimeDate.format('YYYY-MM-DD')} liegt außerhalb des Arbeitszeitraums (${scheduleStart.format('YYYY-MM-DD')} - ${scheduleEnd.format('YYYY-MM-DD')})`,
      'CONFLICTING_SCHEDULE_OVERTIME',
    );
  }

  // Проверка: количество часов не может быть меньше или равно 0
  if (hours <= 0) {
    throw new ApolloError(
      `Die Stundenanzahl ${hours} ist ungültig. Sie muss größer als 0 sein.`,
      'INVALID_OVERTIME_HOURS',
    );
  }

  // Проверка: не может быть более 8 часов на один Overtime
  if (hours > 8) {
    throw new ApolloError(
      `Die Stundenanzahl ${hours} überschreitet das maximale Limit von 8 Stunden pro Overtime`,
      'CONFLICTING_SCHEDULE_OVERTIME',
    );
  }

  // Проверка соответствия типа overtime
  const isWeekend = overtimeDate.isoWeekday() > 5;
  const isHoliday = isHolidayDate(overtimeDate);

  if (
    (type === OvertimeType.WEEKEND && !isWeekend) ||
    (type === OvertimeType.HOLIDAY && !isHoliday) ||
    (type === OvertimeType.OVERTIME && (isWeekend || isHoliday))
  ) {
    throw new ApolloError(
      `Ungültiger Overtime-Typ: ${type} kann nicht auf diesem Datum angewendet werden`,
      'INVALID_OVERTIME_TYPE',
    );
  }
};

function getHolidays(year: string): moment.Moment[] {
  return [
    moment(`${year}-01-01`), // Neujahr
    moment(`${year}-05-01`), // Tag der Arbeit
    moment(`${year}-12-25`), // Weihnachten
    moment(`${year}-12-26`), // Zweiter Weihnachtstag
  ];
}

function isHolidayDate(date: moment.Moment): boolean {
  const holidays = getHolidays(date.year().toString()).map((holiday) =>
    holiday.format('YYYY-MM-DD'),
  );
  return holidays.includes(date.format('YYYY-MM-DD'));
}
