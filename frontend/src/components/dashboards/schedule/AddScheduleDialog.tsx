import { useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fab,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IconCheck, IconPlus, IconSquareRoundedPlus, IconTrash } from '@tabler/icons-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { FieldArray } from 'formik';

import { EvType, OvertimeType, ScheduleStatus } from 'src/types/schedule/schedule';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { useGetScheduleQuery } from 'src/services/api/scheduleApi';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import { useGetClientsQuery } from 'src/services/api/clientApi';
import { useGetStaffsQuery } from 'src/services/api/staffApi';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';
import { isConflictingField } from 'src/utils/error';
import { ColorVariation } from 'src/utils/constants/colorVariation';
import { useGetScheduleOvertimesByScheduleIdQuery } from 'src/services/api/scheduleOvertimeApi';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

interface AddScheduleDialogProps {
  open: boolean;
  loading: boolean;
  loadingDelete: boolean;
  scheduleId?: string;
  slotInfo?: EvType;
  error?: any;
  onClose: () => void;
  onUpdate: (values: any, actions: any) => Promise<void>;
  onCreate: (values: any, actions: any) => Promise<void>;
  onDelete: (e: EvType) => Promise<void>;
}

const AddScheduleDialog = ({
  open,
  scheduleId,
  loading,
  loadingDelete,
  slotInfo,
  error,
  onClose,
  onUpdate,
  onCreate,
  onDelete,
}: AddScheduleDialogProps) => {
  const conflictingFields = error?.data?.extensionDetails?.conflictingFields || [];
  const isConflictingStart = isConflictingField(conflictingFields, 'start');
  const isConflictingEnd = isConflictingField(conflictingFields, 'end');

  const { data: schedulesData } = useGetScheduleQuery(
    { scheduleId: scheduleId! },
    { skip: !scheduleId },
  );
  const s = scheduleId ? schedulesData?.schedule : undefined;
  const { data: clientsData, isLoading: isLoadingClients } = useGetClientsQuery({});
  const clients = clientsData?.items || [];
  const { data: staffData, isLoading: isLoadingStaff } = useGetStaffsQuery({});
  const staffs = staffData?.items || [];
  const { data: scheduleOvertimesData, refetch } = useGetScheduleOvertimesByScheduleIdQuery(
    { scheduleId },
    { skip: !scheduleId },
  );
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
    start: evt?.start
      ? dayjs(evt.start).toDate()
      : slotInfo
        ? dayjs(slotInfo.start).startOf('week').add(1, 'day').toDate()
        : dayjs().startOf('week').add(1, 'day').toDate(),
    end: evt?.end
      ? dayjs(evt.end).toDate()
      : slotInfo
        ? dayjs(slotInfo.end).endOf('week').subtract(1, 'day').toDate()
        : dayjs().endOf('week').subtract(1, 'day').toDate(),
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
    open && scheduleId && refetch().unwrap();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'md'}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) =>
          scheduleId ? onUpdate(values, actions) : onCreate(values, actions)
        }
        enableReinitialize={true}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <DialogContent>
              {/* ------------------------------------------- */}
              {/* Add/Edit Title */}
              {/* ------------------------------------------- */}
              <Typography variant="h4" sx={{ mb: 2 }}>
                {scheduleId ? 'Ereignis aktualisieren' : 'Ereignis hinzufügen'}
              </Typography>
              <Typography mb={3} variant="subtitle2">
                {!scheduleId
                  ? 'Um ein Ereignis hinzuzufügen, füllen Sie bitte den Titel aus, wählen Sie die Ereignisfarbe und klicken Sie auf den Hinzufügen-Button '
                  : 'Um ein Ereignis zu bearbeiten/aktualisieren, ändern Sie bitte den Titel, wählen Sie die Ereignisfarbe und klicken Sie auf den Aktualisieren-Button '}
                {evt?.title}
              </Typography>

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
                      shouldDisableDate={(date) => date.day() !== 1} // Только понедельник
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
                      shouldDisableDate={(date) => date.day() !== 5} // Только пятница
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
                        <MenuItem key={`AddScheduleDialog-Client-${c.id}${idx}`} value={c.id}>
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
                        <MenuItem key={`AddScheduleDialog-Staff-${s.id}${idx + 1}`} value={s.id}>
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

              {scheduleId && (
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
                                        (
                                          props.errors.scheduleOvertimes[index] as {
                                            hours?: number;
                                          }
                                        ).hours && (
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
              )}
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              {scheduleId && evt && (
                <Tooltip title="Löschen Sie dieses Ereignis" arrow>
                  <IconButton
                    color="error"
                    loading={loadingDelete}
                    size="large"
                    sx={{ mr: 'auto' }}
                    onClick={() => onDelete(evt)}
                    disabled={loadingDelete}
                  >
                    <IconTrash />
                  </IconButton>
                </Tooltip>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                loading={loading}
                disabled={props.isSubmitting || loading}
              >
                {scheduleId ? 'Ereignis aktualisieren' : 'Ereignis hinzufügen'}
              </Button>
              <Button
                color="error"
                variant="text"
                onClick={() => {
                  props.resetForm();
                  onClose();
                }}
              >
                Abbrechen
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddScheduleDialog;
