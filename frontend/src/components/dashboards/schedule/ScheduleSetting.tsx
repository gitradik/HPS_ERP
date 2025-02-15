import { Button, MenuItem, Typography, Box, Stack, Divider, Avatar, Fab } from '@mui/material';
import * as Yup from 'yup';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { IconCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { EvType, Schedule, ScheduleStatus } from 'src/types/schedule/schedule';
import { useGetScheduleQuery, useUpdateScheduleMutation } from 'src/services/api/scheduleApi';
import { isConflictingField } from 'src/utils/error';
import { useGetStaffsQuery } from 'src/services/api/staffApi';
import { useGetClientsQuery } from 'src/services/api/clientApi';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSnackbar } from 'notistack';
import { ColorVariation } from 'src/utils/constants/colorVariation';

interface ScheduleSettingProps {
  scheduleId: string;
}

const ScheduleSetting = ({ scheduleId }: ScheduleSettingProps) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [updateSchedule, { isLoading, error }] = useUpdateScheduleMutation();

  // @ts-ignore
  const conflictingFields = error?.data?.extensionDetails?.conflictingFields || [];
  const isConflictingStart = isConflictingField(conflictingFields, 'start');
  const isConflictingEnd = isConflictingField(conflictingFields, 'end');

  const { data: schedulesData } = useGetScheduleQuery({ scheduleId: scheduleId! });
  const s = scheduleId ? schedulesData?.schedule : undefined;
  const { data: clientsData, isLoading: isLoadingClients } = useGetClientsQuery({});
  const clients = clientsData?.items || [];
  const { data: staffData, isLoading: isLoadingStaff } = useGetStaffsQuery({});
  const staffs = staffData?.items || [];

  const evt: EvType | undefined = s && {
    id: s.id,
    title: s.title,
    allDay: s.allDay,
    color: s.color,
    start: dayjs(Number(s.start)).toDate(),
    end: dayjs(Number(s.end)).toDate(),
    clientId: s.client.id,
    staffId: s.staff.id,
    status: s.status,
  };

  const initialValues = {
    title: evt?.title || '',
    allDay: evt?.allDay || false,
    start: evt?.start ? dayjs(evt.start).toDate() : dayjs().startOf('week').add(1, 'day').toDate(),
    end: evt?.end ? dayjs(evt.end).toDate() : dayjs().endOf('week').subtract(1, 'day').toDate(),
    color: evt?.color || ColorVariation[0].value,
    clientId: evt?.clientId || '',
    staffId: evt?.staffId || '',
    status: evt?.status || ScheduleStatus.PENDING,
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Titel ist erforderlich')
      .max(255, 'Titel darf 255 Zeichen nicht überschreiten'),
    allDay: Yup.boolean().required('Ganztägig ist erforderlich'),
    start: Yup.date()
      .required('Startdatum ist erforderlich')
      .typeError('Start muss ein gültiges Datum sein'),
    end: Yup.date()
      .required('Enddatum ist erforderlich')
      .typeError('Ende muss ein gültiges Datum sein')
      .min(Yup.ref('start'), 'Enddatum darf nicht vor dem Startdatum liegen'),
    clientId: Yup.string().required('Kunde ist erforderlich'),
    staffId: Yup.string().required('Mitarbeiter ist erforderlich'),
  });

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

  const handleCancel = ({ resetForm }: any) => {
    resetForm();
  };
  const handleSubmit = async (values: any, actions: any) => {
    try {
      await updateSchedule({
        id: scheduleId,
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
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
      notifyConflictingSchedules(err?.data?.extensionDetails?.conflictingObjects);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 2, md: 4 }}
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h4" sx={{ mb: 2 }}>
                # {evt?.title}
              </Typography>
              <Box display="flex" gap={1}>
                <Button loading={isLoading} type="submit" variant="contained" color="primary">
                  Speichern
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleCancel(props)}>
                  Abbrechen
                </Button>
              </Box>
            </Stack>
            <Divider></Divider>
            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 2, md: 4 }}
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Box>
                <CustomFormLabel htmlFor="demo-simple-select">Status</CustomFormLabel>
                <CustomSelect
                  name="status"
                  value={props.values.status}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  error={props.touched.title && Boolean(props.errors.title)}
                  helperText={props.touched.title && props.errors.title}
                >
                  <MenuItem value={ScheduleStatus.PENDING}>
                    {t(`ScheduleStatus.${ScheduleStatus.PENDING}`)}
                  </MenuItem>
                  <MenuItem value={ScheduleStatus.OPEN}>
                    {t(`ScheduleStatus.${ScheduleStatus.OPEN}`)}
                  </MenuItem>
                  <MenuItem value={ScheduleStatus.CLOSED}>
                    {t(`ScheduleStatus.${ScheduleStatus.CLOSED}`)}
                  </MenuItem>
                </CustomSelect>
              </Box>
              <Box textAlign="right">
                <CustomFormLabel htmlFor="demo-simple-select">Einsatzdaten</CustomFormLabel>
                <Typography variant="body1">
                  {`${dayjs(evt?.start).format('DD MMM YYYY')} - ${dayjs(evt?.end).format('DD MMM YYYY')}`}
                </Typography>
              </Box>
            </Stack>
            <Divider></Divider>
            <Stack>
              <Stack direction="row" spacing={2}>
                <Stack spacing={3} width="100%">
                  <Box>
                    <CustomFormLabel htmlFor="title">Titel</CustomFormLabel>
                    <CustomTextField
                      name="title"
                      variant="outlined"
                      fullWidth
                      value={props.values.title}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={props.touched.title && Boolean(props.errors.title)}
                      helperText={props.touched.title && props.errors.title}
                    />
                  </Box>

                  {/* ------------------------------------------- */}
                  {/* Start and End Date */}
                  {/* ------------------------------------------- */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      name="start"
                      value={dayjs(props.values.start)}
                      format="DD.MM.YYYY"
                      shouldDisableDate={(date) => date.day() !== 1} // Only monday
                      onChange={(value) => {
                        if (value && value.day() === 1) {
                          props.setFieldValue('start', dayjs(value).startOf('day').toDate());
                        }
                      }}
                      slotProps={{
                        textField: {
                          label: 'Startdatum',
                          fullWidth: true,
                          sx: { mb: 3 },
                          error:
                            (props.touched.start && Boolean(props.errors.start)) ||
                            isConflictingStart,
                          helperText:
                            props.touched.start && props.errors.start
                              ? String(props.errors.start)
                              : isConflictingStart
                                ? 'Konflikt mit diesem Startdatum.'
                                : undefined,
                        },
                      }}
                    />
                    <DatePicker
                      name="end"
                      value={dayjs(props.values.end)}
                      format="DD.MM.YYYY"
                      shouldDisableDate={(date) => date.day() !== 5} // Only friday
                      onChange={(value) => {
                        if (value && value.day() === 5) {
                          props.setFieldValue('end', dayjs(value).endOf('day').toDate());
                        }
                      }}
                      slotProps={{
                        textField: {
                          label: 'Enddatum',
                          fullWidth: true,
                          sx: { mb: 3 },
                          error:
                            (props.touched.end && Boolean(props.errors.end)) || isConflictingEnd,
                          helperText:
                            props.touched.end && props.errors.end
                              ? String(props.errors.end)
                              : isConflictingEnd
                                ? 'Konflikt mit diesem Enddatum.'
                                : undefined,
                        },
                      }}
                    />
                  </LocalizationProvider>

                  {/* ------------------------------------------- */}
                  {/* Event Color */}
                  {/* ------------------------------------------- */}
                  <Typography variant="h6" fontWeight={600} my={2}>
                    Wählen Sie die Ereignisfarbe
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {ColorVariation.map((mcolor) => (
                      <Fab
                        color="primary"
                        style={{ backgroundColor: mcolor.eColor }}
                        sx={{
                          transition: '0.1s ease-in',
                          scale: mcolor.value === props.values.color ? '0.9' : '0.7',
                        }}
                        size="small"
                        key={mcolor.value}
                        onClick={() => props.setFieldValue('color', mcolor.value)}
                      >
                        {mcolor.value === props.values.color && <IconCheck width={16} />}
                      </Fab>
                    ))}
                  </Stack>
                </Stack>

                <Stack spacing={3} width="100%">
                  <Box pt={3}>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="clientId">
                      Kunde
                    </CustomFormLabel>
                    <CustomSelect
                      fullWidth
                      variant="outlined"
                      disabled={isLoadingClients || !!scheduleId}
                      value={props.values.clientId}
                      onChange={(e: any) => props.setFieldValue('clientId', e.target.value)}
                    >
                      {clients.map((c, idx) => (
                        <MenuItem key={`ScheduleSetting-Client-${c.id}${idx}`} value={c.id}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar
                              src={getUploadsImagesProfilePath(c.user.photo)}
                              alt={c.user.photo}
                              sx={{ width: 30, height: 30 }}
                            />
                            <Stack>
                              <Typography variant="subtitle1" color="textSecondary">
                                {c.user.firstName} {c.user.lastName}
                              </Typography>
                              {c.companyName && (
                                <Typography variant="caption" color="info">
                                  {c.companyName}
                                </Typography>
                              )}
                            </Stack>
                          </Stack>
                        </MenuItem>
                      ))}
                    </CustomSelect>
                    {props.touched.clientId && props.errors.clientId && (
                      <Typography color="error" variant="caption">
                        {props.errors.clientId}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <CustomFormLabel sx={{ mt: 0 }} htmlFor="staffId">
                      Personale
                    </CustomFormLabel>
                    <CustomSelect
                      fullWidth
                      variant="outlined"
                      disabled={isLoadingStaff || !!scheduleId}
                      value={props.values.staffId}
                      onChange={(e: any) => props.setFieldValue('staffId', e.target.value)}
                    >
                      {staffs.map((s, idx) => (
                        <MenuItem key={`ScheduleSetting-Staff-${s.id}${idx}`} value={s.id}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar
                              src={getUploadsImagesProfilePath(s.user.photo)}
                              alt={s.user.photo}
                              sx={{ width: 30, height: 30 }}
                            />
                            <Stack>
                              <Typography variant="subtitle1" color="textSecondary">
                                {s.user.firstName} {s.user.lastName}
                              </Typography>
                              {s.user.position && (
                                <Typography variant="caption" color="info">
                                  {s.user.position}
                                </Typography>
                              )}
                            </Stack>
                          </Stack>
                        </MenuItem>
                      ))}
                    </CustomSelect>
                    {props.touched.staffId && props.errors.staffId && (
                      <Typography color="error" variant="caption">
                        {props.errors.staffId}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ScheduleSetting;
