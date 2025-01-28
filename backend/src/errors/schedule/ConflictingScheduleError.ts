import { ApolloError } from 'apollo-server-express';
import Schedule from '../../models/Schedule';
import moment from 'moment';

export const ConflictingScheduleStartEndError = (
  conflictingSchedules: Schedule[],
  inputStart: string,
  inputEnd: string,
) => {
  const conflictingFields = new Map();

  conflictingSchedules.forEach((s) => {
    if (moment(inputStart).isBetween(moment(s.start), moment(s.end), null, '[)')) {
      conflictingFields.set('start', true);
    }

    if (moment(inputEnd).isBetween(moment(s.start), moment(s.end), null, '(]')) {
      conflictingFields.set('end', true);
    }
  });

  return new ApolloError(
    `Personal ist im angegebenen Zeitraum nicht verfügbar.`,
    'CONFLICTING_SCHEDULE',
    {
      conflictingFields: Array.from(conflictingFields.keys()), // Возвращаем только имя поля с конфликтом
      conflictingObjects: conflictingSchedules,
    },
  );
};
