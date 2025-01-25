// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fab,
  TextField,
  Typography,
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import './Schedule.css';
import PageContainer from 'src/components/container/PageContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IconCheck } from '@tabler/icons-react';
import BlankCard from 'src/components/shared/BlankCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import {
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useGetSchedulesQuery,
  useUpdateScheduleMutation,
} from 'src/services/api/scheduleApi';
import { Schedule } from 'src/types/schedule/schedule';
import { useSnackbar } from 'notistack';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

const BCrumb = [
  {
    to: '/',
    title: 'Startseite',
  },
  {
    title: 'Einsatzplan verwalten',
  },
];

const localizer = momentLocalizer(moment);

type EvType = {
  id: number;
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  color: string;
};

const SchedulePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { data: schedulesData } = useGetSchedulesQuery();
  const calevents = schedulesData?.schedules.map((s) => ({
    ...s,
    start: dayjs(Number(s.start)).toDate(),
    end: dayjs(Number(s.end)).toDate(),
  }));

  const [createSchedule, { isLoading: createIsLoading }] = useCreateScheduleMutation();
  const [updateSchedule, { isLoading: updateIsLoading }] = useUpdateScheduleMutation();
  const [deleteSchedule, { isLoading: deleteIsLoading }] = useDeleteScheduleMutation();

  // const [calevents, setCalEvents] = React.useState<any>(Events);
  const [open, setOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>('');
  const [slot, setSlot] = React.useState<EvType>();
  const [start, setStart] = React.useState<any | null>(dayjs());
  const [end, setEnd] = React.useState<any | null>(dayjs());
  const [color, setColor] = React.useState<string>('default');
  const [update, setUpdate] = React.useState<EvType | undefined | any>();
  // Example function to set and format the date

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
  const addNewEventAlert = (slotInfo: EvType) => {
    setOpen(true);
    setSlot(slotInfo);
    setStart(dayjs(slotInfo.start));
    setEnd(dayjs(slotInfo.end));
  };

  const editEvent = (event: EvType) => {
    setTitle(event.title);
    setColor(event.color);
    setStart(dayjs(event.start));
    setEnd(dayjs(event.end));
    setUpdate(event);
    setOpen(true);
  };

  const updateEvent = async (e: any) => {
    e.preventDefault();

    try {
      await updateSchedule({
        id: update.id,
        allDay: false,
        title,
        start: start.toISOString(),
        end: end.toISOString(),
        color,
      });
      enqueueSnackbar('Die Veranstaltung wurde erfolgreich aktualisiert!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      setOpen(false);
      setTitle('');
      setStart(dayjs());
      setEnd(dayjs());
      setUpdate(null);
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
    }
  };
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const selectinputChangeHandler = (id: string) => setColor(id);

  // When submitting or updating the event
  const submitHandler = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    try {
      await createSchedule({
        staffId: 1,
        allDay: false,
        clientId: 1,
        title,
        start: start.toISOString(),
        end: end.toISOString(),
        color,
      });
      enqueueSnackbar('Die Veranstaltung wurde erfolgreich erstellt!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      setOpen(false);
      setTitle('');
      setStart(dayjs());
      setEnd(dayjs());
      setUpdate(null);
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
    }
  };

  const deleteHandler = async (e: EvType) => {
    try {
      await deleteSchedule({ id: e.id });
      enqueueSnackbar('Die Veranstaltung wurde erfolgreich gelöscht!', {
        variant: 'success',
        autoHideDuration: 3000,
      });
      setOpen(false);
      setTitle('');
      setStart(dayjs());
      setEnd(dayjs());
      setUpdate(null);
    } catch (err: any) {
      enqueueSnackbar(err?.data?.friendlyMessage, { variant: 'error', autoHideDuration: 3000 });
    }
  };

  const handleClose = () => {
    // eslint-disable-line newline-before-return
    setOpen(false);
    setTitle('');
    setStart(dayjs());
    setEnd(dayjs());
    setUpdate(null);
  };

  const eventColors = (event: Schedule) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }

    return { className: `event-default` };
  };

  const handleStartChange = (newValue: any) => {
    if (newValue instanceof Date) {
      // Convert the native Date object to a dayjs object
      setStart(dayjs(newValue));
    } else {
      setStart(newValue);
    }
  };

  const handleEndChange = (newValue: any) => {
    if (newValue instanceof Date) {
      // Convert the native Date object to a dayjs object
      setEnd(dayjs(newValue));
    } else {
      setEnd(newValue);
    }
  };

  return (
    <PageContainer
      title="Einsatzplan verwalten"
      description="Dies ist die Seite zur Verwaltung des Einsatzplans"
    >
      <Breadcrumb title="Einsatzplan verwalten" items={BCrumb} />
      <BlankCard>
        {/* ------------------------------------------- */}
        {/* Calendar */}
        {/* ------------------------------------------- */}
        <CardContent>
          <Calendar
            selectable
            events={calevents}
            defaultView="month"
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            localizer={localizer}
            onSelectEvent={(event: any) => editEvent(event)}
            onSelectSlot={(slotInfo: any) => addNewEventAlert(slotInfo)}
            eventPropGetter={(event: any) => eventColors(event)}
            resourceTitleAccessor={(d) => {
              console.log(d)
              return "ss"
            }}
          />
        </CardContent>
      </BlankCard>

      {/* ------------------------------------------- */}
      {/* Add Calendar Event Dialog */}
      {/* ------------------------------------------- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <form onSubmit={update ? updateEvent : submitHandler}>
          <DialogContent>
            {/* ------------------------------------------- */}
            {/* Add Edit title */}
            {/* ------------------------------------------- */}
            <Typography variant="h4" sx={{ mb: 2 }}>
              {update ? 'Update Event' : 'Add Event'}
            </Typography>
            <Typography mb={3} variant="subtitle2">
              {!update
                ? 'To add Event kindly fillup the title and choose the event color and press the add button'
                : 'To Edit/Update Event kindly change the title and choose the event color and press the update button'}
              {slot?.title}
            </Typography>

            <TextField
              id="Event Title"
              placeholder="Enter Event Title"
              variant="outlined"
              fullWidth
              label="Event Title"
              value={title}
              sx={{ mb: 3 }}
              onChange={inputChangeHandler}
            />
            {/* ------------------------------------------- */}
            {/* Selection of Start and end date */}
            {/* ------------------------------------------- */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={start}
                onChange={handleStartChange}
                slotProps={{
                  textField: {
                    label: 'Start Date',
                    fullWidth: true,
                    sx: { mb: 3 },
                  },
                }}
              />

              <DatePicker
                value={end}
                onChange={handleEndChange}
                slotProps={{
                  textField: {
                    label: 'End Date',
                    fullWidth: true,
                    sx: { mb: 3 },
                    error: start && end && start > end,
                    helperText:
                      start && end && start > end ? 'End date must be later than start date' : '',
                  },
                }}
              />
            </LocalizationProvider>

            {/* ------------------------------------------- */}
            {/* Calendar Event Color*/}
            {/* ------------------------------------------- */}
            <Typography variant="h6" fontWeight={600} my={2}>
              Select Event Color
            </Typography>
            {/* ------------------------------------------- */}
            {/* colors for event */}
            {/* ------------------------------------------- */}
            {ColorVariation.map((mcolor, idx) => {
              return (
                <Fab
                  color="primary"
                  style={{ backgroundColor: mcolor.eColor }}
                  sx={{
                    marginRight: '3px',
                    transition: '0.1s ease-in',
                    scale: mcolor.value === color ? '0.9' : '0.7',
                  }}
                  size="small"
                  key={mcolor.id + idx}
                  onClick={() => selectinputChangeHandler(mcolor.value)}
                >
                  {mcolor.value === color ? <IconCheck width={16} /> : ''}
                </Fab>
              );
            })}
          </DialogContent>
          {/* ------------------------------------------- */}
          {/* Action for dialog */}
          {/* ------------------------------------------- */}
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>

            {update && (
              <Button
                loading={deleteIsLoading}
                color="error"
                variant="contained"
                onClick={() => deleteHandler(update)}
              >
                Delete
              </Button>
            )}
            <Button
              loading={createIsLoading || updateIsLoading}
              type="submit"
              disabled={!title}
              variant="contained"
            >
              {update ? 'Update Event' : 'Add Event'}
            </Button>
          </DialogActions>
          {/* ------------------------------------------- */}
          {/* End Calendar */}
          {/* ------------------------------------------- */}
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default SchedulePage;
