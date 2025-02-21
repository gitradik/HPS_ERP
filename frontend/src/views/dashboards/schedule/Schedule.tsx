import React from 'react';
import { useTranslation } from 'react-i18next';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { ScheduleTimeline } from './ScheduleTimeline';
import { useEffect } from 'react';
import { useDispatch } from 'src/store/Store';
import { toggleLayout } from 'src/store/customizer/CustomizerSlice';
import AddScheduleDialog from 'src/components/dashboards/schedule/AddScheduleDialog';
import { EvType, Schedule, ScheduleOvertime } from 'src/types/schedule/schedule';
import {
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useUpdateScheduleMutation,
} from 'src/services/api/scheduleApi';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import {
  useCreateScheduleOvertimeMutation,
  useDeleteScheduleOvertimeMutation,
  useGetScheduleOvertimesByScheduleIdQuery,
  useUpdateScheduleOvertimeMutation,
} from 'src/services/api/scheduleOvertimeApi';

const SchedulePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const BCrumb = [{ to: '/', title: t('MenuItems.home_page') }, { title: t('MenuItems.schedule') }];
  const dispatch = useDispatch();

  const [createSchedule, { isLoading: createIsLoading, error: createError, reset: resetCreate }] =
    useCreateScheduleMutation();
  const [updateSchedule, { isLoading: updateIsLoading, error: updateError, reset: resetUpdate }] =
    useUpdateScheduleMutation();
  const [deleteSchedule, { isLoading: deleteIsLoading }] = useDeleteScheduleMutation();

  const [createScheduleOvertime] = useCreateScheduleOvertimeMutation();
  const [updateScheduleOvertime] = useUpdateScheduleOvertimeMutation();
  const [deleteScheduleOvertime] = useDeleteScheduleOvertimeMutation();

  const [open, setOpen] = React.useState<boolean>(false);
  const [evtId, setEvtId] = React.useState<string | undefined>();

  const { data: scheduleOvertimesData } = useGetScheduleOvertimesByScheduleIdQuery(
    { scheduleId: evtId },
    { skip: !evtId },
  );
  const scheduleOvertimes = scheduleOvertimesData?.scheduleOvertimesByScheduleId || [];

  useEffect(() => {
    resetCreate();
    resetUpdate();
  }, [open]);

  useEffect(() => {
    dispatch(toggleLayout('full'));
    return () => {
      dispatch(toggleLayout('boxed'));
    };
  }, []);

  const notifyConflictingSchedules = (conflictingObjects: Array<Schedule> | undefined) => {
    if (Array.isArray(conflictingObjects)) {
      conflictingObjects.forEach((s: Schedule) => {
        const conflictMessage = `Einsatz-Konflikt: ${s.title} (${moment(s.start).format('DD.MM.YYYY HH:mm')} - ${moment(s.end).format('DD.MM.YYYY HH:mm')})`;
        enqueueSnackbar(`Konflikt mit ${conflictMessage}`, {
          variant: 'warning',
          autoHideDuration: 10000,
        });
      });
    }
  };

  const handleCreate = async (values: any, actions: any) => {
    try {
      const result = await createSchedule({
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
      setEvtId(result.createSchedule.id);
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
      notifyConflictingSchedules(err?.data?.extensionDetails?.conflictingObjects);
      actions.setSubmitting(false);
    }
  };
  const handleUpdate = async (values: any, actions: any) => {
    try {
      const existingIds = new Set(scheduleOvertimes.map((so: ScheduleOvertime) => so.id));
      const newIds = new Set(values.scheduleOvertimes.map((overtime: any) => overtime.id));

      await Promise.all([
        ...values.scheduleOvertimes.map((overtime: any) => {
          if (overtime.id) {
            return updateScheduleOvertime({
              id: overtime.id,
              date: overtime.date.toISOString(),
              hours: overtime.hours,
              type: overtime.type,
            }).unwrap();
          }

          return createScheduleOvertime({
            scheduleId: evtId,
            date: overtime.date.toISOString(),
            hours: overtime.hours,
            type: overtime.type,
          }).unwrap();
        }),
        ...Array.from(existingIds)
          .filter((id) => !newIds.has(id))
          .map((id) => deleteScheduleOvertime({ id }).unwrap()),
      ]);

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
    setOpen(false);
  };

  const handleEditEvent = (s: Schedule) => {
    setEvtId(s.id);
    setOpen(true);
  };
  const addEvent = () => setOpen(true);

  return (
    <PageContainer title={t('MenuItems.schedule')} description={t('MenuItems.schedule_descr')}>
      <Breadcrumb title={t('MenuItems.schedule')} items={BCrumb} />
      <ScheduleTimeline onCreate={addEvent} onEdit={handleEditEvent} />

      {/* ------------------------------------------- */}
      {/* Add Calendar Event Dialog */}
      {/* ------------------------------------------- */}
      <AddScheduleDialog
        open={open}
        scheduleId={evtId}
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

export default SchedulePage;
