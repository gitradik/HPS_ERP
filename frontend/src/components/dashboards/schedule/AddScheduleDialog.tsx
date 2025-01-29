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
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IconCheck, IconTrash } from '@tabler/icons-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import { EvType, ScheduleStatus } from 'src/types/schedule/schedule';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { useGetScheduleQuery } from 'src/services/api/scheduleApi';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import { useGetClientsQuery } from 'src/services/api/clientApi';
import { useGetStaffsQuery } from 'src/services/api/staffApi';
import { getUploadsImagesProfilePath } from 'src/utils/uploadsPath';
import { isConflictingField } from 'src/utils/error';

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

const ColorVariation = [
  {
    id: 1,
    eColor: '#1a97f5',
    value: 'default',
  },
  {
    id: 2,
    eColor: '#39b69a',
    value: 'green',
  },
  {
    id: 3,
    eColor: '#fc4b6c',
    value: 'red',
  },
  {
    id: 4,
    eColor: '#615dff',
    value: 'azure',
  },
  {
    id: 5,
    eColor: '#fdd43f',
    value: 'warning',
  },
];

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
  const { data: clientsData, isLoading: isLoadingClients } = useGetClientsQuery();
  const clients = clientsData?.clients || [];
  const { data: staffData, isLoading: isLoadingStaff } = useGetStaffsQuery();
  const staffs = staffData?.staffs || [];

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
    start: evt?.start
      ? dayjs(evt.start).toDate()
      : slotInfo
        ? dayjs(slotInfo.start).startOf('day').toDate()
        : dayjs().startOf('day').toDate(),
    end: evt?.end
      ? dayjs(evt.end).toDate()
      : slotInfo
        ? dayjs(slotInfo.end).add(-1, 'day').endOf('day').toDate()
        : dayjs().endOf('day').toDate(),
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
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
                  ? 'Um ein Ereignis hinzuzufügen, füllen Sie bitte den Titel aus, wählen Sie die Ereignisfarbe und klicken Sie auf den Hinzufügen-Button'
                  : 'Um ein Ereignis zu bearbeiten/aktualisieren, ändern Sie bitte den Titel, wählen Sie die Ereignisfarbe und klicken Sie auf den Aktualisieren-Button'}
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
                      onChange={(value) =>
                        props.setFieldValue('start', dayjs(value).startOf('day').toDate())
                      }
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
                      onChange={(value) =>
                        props.setFieldValue('end', dayjs(value).endOf('day').toDate())
                      }
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
                        <MenuItem key={`AddScheduleDialog-Staff-${s.id}${idx}`} value={s.id}>
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
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              {scheduleId && evt && (
                <Tooltip title="Löschen Sie dieses Ereignis" arrow>
                  <IconButton
                    color="error"
                    loading={loadingDelete}
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
