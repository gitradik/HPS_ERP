// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fab,
  IconButton,
  MenuItem,
  Stack,
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

import { EvType } from 'src/types/schedule/schedule';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { useGetScheduleQuery } from 'src/services/api/scheduleApi';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import { useGetClientsQuery } from 'src/services/api/clientApi';
import { useGetStaffsQuery } from 'src/services/api/staffApi';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

interface CreateCalendarEventDialogProps {
  open: boolean;
  loading: boolean;
  loadingDelete: boolean;
  scheduleId?: string;
  slotInfo?: EvType;
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

const AddCalendarEventDialog = ({
  open,
  scheduleId,
  loading,
  loadingDelete,
  slotInfo,
  onClose,
  onUpdate,
  onCreate,
  onDelete,
}: CreateCalendarEventDialogProps) => {
  const { data: schedulesData } = useGetScheduleQuery(
    { scheduleId: scheduleId! },
    { skip: !scheduleId, refetchOnMountOrArgChange: true },
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
  };

  const initialValues = {
    title: evt?.title || '',
    allDay: evt?.allDay || false,
    start: evt?.start ? new Date(evt.start) : slotInfo ? slotInfo.start : dayjs().toDate(),
    end: evt?.end ? new Date(evt.end) : slotInfo ? slotInfo.end : dayjs().add(1, 'day').toDate(),
    color: evt?.color || ColorVariation[0].value,
    clientId: evt?.clientId || '',
    staffId: evt?.staffId || '',
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .max(255, 'Title must not exceed 255 characters'),
    allDay: Yup.boolean().required('All Day is required'),
    start: Yup.date().required('Start date is required').typeError('Start must be a valid date'),
    end: Yup.date()
      .required('End date is required')
      .typeError('End must be a valid date')
      .min(Yup.ref('start'), 'End date cannot be before start date'),
    clientId: Yup.string().required('Client is required'), // Валидация для clientId
    staffId: Yup.string().required('Staff is required'), // Валидация для staffId
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
                    onChange={(value) => props.setFieldValue('start', dayjs(value).toDate())}
                    slotProps={{
                      textField: {
                        label: 'Startdatum',
                        fullWidth: true,
                        sx: { mb: 3 },
                        error: props.touched.start && Boolean(props.errors.start),
                        helperText:
                          props.touched.start && props.errors.start
                            ? String(props.errors.start)
                            : undefined,
                      },
                    }}
                  />
                  <DatePicker
                    name="end"
                    value={dayjs(props.values.end)}
                    onChange={(value) => props.setFieldValue('end', dayjs(value).toDate())}
                    slotProps={{
                      textField: {
                        label: 'Enddatum',
                        fullWidth: true,
                        sx: { mb: 3 },
                        error: props.touched.end && Boolean(props.errors.end),
                        helperText:
                          props.touched.end && props.errors.end
                            ? String(props.errors.end)
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
                      <MenuItem key={`${c.id}${idx}`} value={c.id}>
                        {c.user.firstName} {c.user.lastName}
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
                      <MenuItem key={`${s.id}${idx}`} value={s.id}>
                        {s.user.firstName} {s.user.lastName}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {props.touched.staffId &&
                    props.errors.staffId && (<Typography color="error" variant="caption">
                        {props.errors.staffId}
                      </Typography>
                    )}
                </Box>
              </Stack>
            </Stack>
          </DialogContent>
  
          <DialogActions sx={{ p: 3 }}>
            {scheduleId && evt && (
              <IconButton
                color="error"
                loading={loadingDelete}
                sx={{ mr: 'auto' }}
                onClick={() => onDelete(evt)}
                disabled={loadingDelete}
              >
                <IconTrash />
              </IconButton>
            )}
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                props.resetForm();
                onClose();
              }}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              loading={loading}
              disabled={props.isSubmitting || loading}
            >
              {scheduleId ? 'Ereignis aktualisieren' : 'Ereignis hinzufügen'}
            </Button>
          </DialogActions>
        </form>
      )}
    </Formik>
  </Dialog>
  );
};

export default AddCalendarEventDialog;
