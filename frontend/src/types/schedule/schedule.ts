import { Staff } from 'src/types/staff/staff';
import { Client } from 'src/types/client/client';

export interface ScheduleResponse {
  id: string;
  title: string;
  allDay: boolean;
  start: string;
  end: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  staff: Staff;
  client: Client;
}

export interface Schedule extends ScheduleResponse {}

export interface CreateScheduleInput {
  staffId: number;
  clientId: number;
  title: string;
  allDay: boolean;
  start: string;
  end: string;
  color?: string;
}

export interface UpdateScheduleInput {
  id: number;
  title?: string;
  allDay?: boolean;
  start?: string;
  end?: string;
  color?: string;
}
