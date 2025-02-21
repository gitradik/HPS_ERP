import {
  Button,
  MenuItem,
  Typography,
  Box,
  Stack,
  Divider,
  Avatar,
  Fab,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from '@mui/material';
import * as Yup from 'yup';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { IconCheck, IconPlus, IconSquareRoundedPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import {
  EvType,
  OvertimeType,
  Schedule,
  ScheduleOvertime,
  ScheduleStatus,
} from 'src/types/schedule/schedule';
import { useGetScheduleQuery, useUpdateScheduleMutation } from 'src/services/api/scheduleApi';
import { isConflictingField } from 'src/utils/error';
import { useGetStaffsQuery } from 'src/services/api/staffApi';
import { useGetClientsQuery } from 'src/services/api/clientApi';
import dayjs from 'dayjs';
import { FieldArray, Formik } from 'formik';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSnackbar } from 'notistack';
import { ColorVariation } from 'src/utils/constants/colorVariation';
import {
  useCreateScheduleOvertimeMutation,
  useDeleteScheduleOvertimeMutation,
  useGetScheduleOvertimesByScheduleIdQuery,
  useUpdateScheduleOvertimeMutation,
} from 'src/services/api/scheduleOvertimeApi';
import { useEffect } from 'react';

interface ScheduleSettingProps {
  scheduleId: string;
}

const ScheduleSetting = ({ scheduleId }: ScheduleSettingProps) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [updateSchedule, { isLoading, error }] = useUpdateScheduleMutation();
  const [createScheduleOvertime] = useCreateScheduleOvertimeMutation();
  const [updateScheduleOvertime] = useUpdateScheduleOvertimeMutation();
  const [deleteScheduleOvertime] = useDeleteScheduleOvertimeMutation();

  // @ts-ignore
  const conflictingFields = error?.data?.extensionDetails?.conflictingFields || [];
  const isConflictingStart = isConflictingField(conflictingFields, 'start');
  const isConflictingEnd = isConflictingField(conflictingFields, 'end');

  const { data: schedulesData } = useGetScheduleQuery({ scheduleId });
  const s = schedulesData?.schedule;
  const { data: clientsData, isLoading: isLoadingClients } = useGetClientsQuery({});
  const clients = clientsData?.items || [];
  const { data: staffData, isLoading: isLoadingStaff } = useGetStaffsQuery({});
  const staffs = staffData?.items || [];
  const { data: scheduleOvertimesData, refetch } = useGetScheduleOvertimesByScheduleIdQuery({
    scheduleId,
  });
  const scheduleOvertimes = scheduleOvertimesData?.scheduleOvertimesByScheduleId || [];

  const evt: EvType | undefined = s && {
    id: s.id,
    title: s.title,
    allDay: s.allDay,
    color: s.color,
    start: dayjs(s.start).toDate(),
    end: dayjs(s.end).toDate(),
    clientId: s.client.id,
    staffId: s.staff.id,
    status: s.status,
    scheduleOvertimes,
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
    scheduleOvertimes:
      evt?.scheduleOvertimes?.map((so) => ({ ...so, date: dayjs(so.date).toDate() })) || [],
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
    scheduleOvertimes: Yup.array().of(
      Yup.object().shape({
        date: Yup.date()
          .required('Datum ist erforderlich')
          .typeError('Bitte wählen Sie ein gültiges Datum aus'),
        hours: Yup.number()
          .required('Stunden sind erforderlich')
          .min(0, 'Stunden müssen positiv sein'),
        type: Yup.string()
          .required('Typ ist erforderlich')
          .oneOf([...Object.entries(OvertimeType).map(([_, value]) => value)]),
      }),
    ),
  });

  useEffect(() => {
    refetch().unwrap();
  }, []);

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
            scheduleId,
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
                        error: (props.touched.end && Boolean(props.errors.end)) || isConflictingEnd,
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
            <Stack pt={2} spacing={1} width="100%">
              <Paper variant="outlined">
                <FieldArray name="scheduleOvertimes">
                  {({ push, remove }) => (
                    <Box>
                      <Stack
                        flexWrap="initial"
                        direction="row"
                        alignItems="center"
                        justifyContent={'space-between'}
                        pl={1}
                        pr={1}
                      >
                        <Typography variant="h6" fontWeight={600} my={2}>
                          Überstunden
                        </Typography>
                        <Box>
                          <Tooltip title="Überstunden hinzufügen">
                            <Button
                              variant="contained"
                              startIcon={<IconPlus />}
                              onClick={() =>
                                push({
                                  date: dayjs(evt?.start).toDate(),
                                  hours: 0,
                                  type: 'OVERTIME',
                                })
                              }
                            >
                              Hinzufügen
                            </Button>
                          </Tooltip>
                        </Box>
                      </Stack>

                      <TableContainer sx={{ whiteSpace: { xs: 'nowrap', md: 'unset' } }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography variant="h6" fontSize="14px">
                                  Datum
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6" fontSize="14px">
                                  Stunden
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6" fontSize="14px">
                                  Typ
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" fontSize="14px">
                                  Actions
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {props.values.scheduleOvertimes.map((overtime, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                      format="DD.MM.YYYY"
                                      value={dayjs(overtime.date)}
                                      onChange={(value) =>
                                        props.setFieldValue(
                                          `scheduleOvertimes[${index}].date`,
                                          value,
                                        )
                                      }
                                      sx={{ width: '100%' }}
                                    />
                                  </LocalizationProvider>
                                  {props.touched.scheduleOvertimes &&
                                    props.touched.scheduleOvertimes[index] &&
                                    props.errors.scheduleOvertimes &&
                                    props.errors.scheduleOvertimes[index] &&
                                    (props.errors.scheduleOvertimes[index] as { date?: string })
                                      .date && (
                                      <Typography color="error" variant="caption">
                                        {
                                          (
                                            props.errors.scheduleOvertimes[index] as {
                                              date?: string;
                                            }
                                          ).date
                                        }
                                      </Typography>
                                    )}
                                </TableCell>

                                <TableCell width={170}>
                                  <CustomTextField
                                    type="number"
                                    value={overtime.hours}
                                    onChange={props.handleChange(
                                      `scheduleOvertimes[${index}].hours`,
                                    )}
                                    sx={{ width: '100%' }}
                                  />
                                  {props.touched.scheduleOvertimes &&
                                    props.touched.scheduleOvertimes[index] &&
                                    props.errors.scheduleOvertimes &&
                                    props.errors.scheduleOvertimes[index] &&
                                    (props.errors.scheduleOvertimes[index] as { hours?: number })
                                      .hours && (
                                      <Typography color="error" variant="caption">
                                        {
                                          (
                                            props.errors.scheduleOvertimes[index] as {
                                              hours?: number;
                                            }
                                          ).hours
                                        }
                                      </Typography>
                                    )}
                                </TableCell>
                                <TableCell width={170}>
                                  <CustomSelect
                                    value={overtime.type}
                                    onChange={props.handleChange(
                                      `scheduleOvertimes[${index}].type`,
                                    )}
                                    sx={{ width: '100%' }}
                                  >
                                    {Object.entries(OvertimeType).map(([key, value], idx) => (
                                      <MenuItem key={`OvertimeType-${key}${idx}`} value={value}>
                                        {value}
                                      </MenuItem>
                                    ))}
                                  </CustomSelect>
                                </TableCell>

                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Tooltip placement="top-end" title="Überstunden hinzufügen">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        push({
                                          date: dayjs(evt?.start).toDate(),
                                          hours: 0,
                                          type: OvertimeType.OVERTIME,
                                        });
                                      }}
                                      color="primary"
                                    >
                                      <IconSquareRoundedPlus width={22} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip placement="top-end" title="Überstunden löschen">
                                    <IconButton
                                      color="error"
                                      size="small"
                                      onClick={() => remove(index)}
                                    >
                                      <IconTrash />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </FieldArray>
              </Paper>
            </Stack>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ScheduleSetting;
