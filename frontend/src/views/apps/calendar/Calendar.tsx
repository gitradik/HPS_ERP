// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useEffect, useMemo } from 'react';
import { CardContent } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import './Calendar.css';
import PageContainer from 'src/components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';
import {
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useGetSchedulesQuery,
  useUpdateScheduleMutation,
} from 'src/services/api/scheduleApi';
import { EvType, Schedule } from 'src/types/schedule/schedule';
import { useSnackbar } from 'notistack';
import AddScheduleDialog from 'src/components/dashboards/schedule/AddScheduleDialog';
import { useTranslation } from 'react-i18next';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const { t } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();
  const { data: schedulesData } = useGetSchedulesQuery();
  const calevents = schedulesData?.schedules.map((s) => ({
    ...s,
    start: dayjs(Number(s.start)).toDate(),
    end: dayjs(Number(s.end)).toDate(),
  }));

  const [createSchedule, { isLoading: createIsLoading, error: createError, reset: resetCreate }] =
    useCreateScheduleMutation();
  const [updateSchedule, { isLoading: updateIsLoading, error: updateError, reset: resetUpdate }] =
    useUpdateScheduleMutation();
  const [deleteSchedule, { isLoading: deleteIsLoading }] = useDeleteScheduleMutation();

  const [open, setOpen] = React.useState<boolean>(false);
  const [evtId, setEvtId] = React.useState<string | undefined>();
  const [slotInfo, setSlotInfo] = React.useState<EvType | undefined>();

  useEffect(() => {
    resetCreate();
    resetUpdate();
  }, [open]);

  const addEvent = (event: EvType) => {
    setOpen(true);
    setSlotInfo(event);
  };
  const editEvent = (event: EvType) => {
    setEvtId(event.id);
    setOpen(true);
  };

  const notifyConflictingSchedules = (conflictingObjects: Array<Schedule> | undefined) => {
    if (Array.isArray(conflictingObjects)) {
      conflictingObjects.forEach((s: Schedule) => {
        const conflictMessage = `Einsatz-Konflikt: ${s.title} (${dayjs(s.start).format('DD.MM.YYYY HH:mm')} - ${dayjs(s.end).format('DD.MM.YYYY HH:mm')})`;
        enqueueSnackbar(`Konflikt mit ${conflictMessage}`, {
          variant: 'warning',
          autoHideDuration: 10000,
        });
      });
    }
  };

  const handleCreate = async (values: any, actions: any) => {
    try {
      await createSchedule({
        allDay: values.allDay,
        title: values.title,
        start: values.start.toISOString(),
        end: values.end.toISOString(),
        color: values.color,
        clientId: values.clientId,
        staffId: values.staffId,
        status: values.status,
      }).unwrap();
      enqueueSnackbar('Die Veranstaltung wurde erfolgreich erstellt!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      actions.setSubmitting(false);
      handleClose();
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
      notifyConflictingSchedules(err?.data?.extensionDetails?.conflictingObjects);
      actions.setSubmitting(false);
    }
  };
  const handleUpdate = async (values: any, actions: any) => {
    try {
      await updateSchedule({
        id: evtId!,
        allDay: values.allDay,
        title: values.title,
        start: values.start.toISOString(),
        end: values.end.toISOString(),
        color: values.color,
        status: values.status,
      }).unwrap();
      enqueueSnackbar('Die Veranstaltung wurde erfolgreich aktualisiert!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      actions.setSubmitting(false);
      handleClose();
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
      notifyConflictingSchedules(err?.data?.extensionDetails?.conflictingObjects);
      actions.setSubmitting(false);
    }
  };
  const handleDelete = async (e: EvType) => {
    try {
      await deleteSchedule({ id: e.id });
      enqueueSnackbar('Die Veranstaltung wurde erfolgreich gelöscht!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      handleClose();
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
    }
  };
  const handleClose = () => {
    setEvtId(undefined);
    setSlotInfo(undefined);
    setOpen(false);
  };

  const eventColors = (event: Schedule) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }

    return { className: `event-default` };
  };

  return (
    <PageContainer title={t('MenuItems.calendar')} description={t('MenuItems.calendar_descr')}>
      <BlankCard>
        {/* ------------------------------------------- */}
        {/* Calendar */}
        {/* ------------------------------------------- */}
        <CardContent>
          <Calendar
            selectable
            events={calevents}
            defaultView="month"
            startAccessor="start"
            endAccessor="end"
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            localizer={localizer}
            onSelectEvent={(event: any) => editEvent(event)}
            onSelectSlot={(slotInfo: any) => addEvent(slotInfo)}
            eventPropGetter={(event: any) => eventColors(event)}
          />
        </CardContent>
      </BlankCard>

      {/* ------------------------------------------- */}
      {/* Add Calendar Event Dialog */}
      {/* ------------------------------------------- */}
      <AddScheduleDialog
        open={open}
        scheduleId={evtId}
        slotInfo={slotInfo}
        loading={createIsLoading || updateIsLoading}
        loadingDelete={deleteIsLoading}
        error={createError || updateError}
        onClose={handleClose}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />
    </PageContainer>
  );
};

export default CalendarPage;
