import { createSlice } from '@reduxjs/toolkit';
import { Schedule, ScheduleStatus } from 'src/types/schedule/schedule';

export interface StaffScheduleState {
  schedules: Schedule[];
  currentFilter: ScheduleStatus | 'all';
  scheduleSearch: string;
}

const initialState: StaffScheduleState = {
  schedules: [],
  currentFilter: 'all',
  scheduleSearch: '',
};

export const StaffScheduleSlice = createSlice({
  name: 'staffSchedule',
  initialState,
  reducers: {
    setSchedules: (state, action) => {
      state.schedules = action.payload;
    },
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    setSearchSchedule: (state, action) => {
      state.scheduleSearch = action.payload;
    },
  },
});

export const { setSchedules, setVisibilityFilter, setSearchSchedule } = StaffScheduleSlice.actions;

export const selectSchedules = (state: { staffSchedule: StaffScheduleState }) =>
  state.staffSchedule.schedules;
export const selectCurrentFilter = (state: { staffSchedule: StaffScheduleState }) =>
  state.staffSchedule.currentFilter;
export const selectScheduleSearch = (state: { staffSchedule: StaffScheduleState }) =>
  state.staffSchedule.scheduleSearch;

export default StaffScheduleSlice.reducer;
