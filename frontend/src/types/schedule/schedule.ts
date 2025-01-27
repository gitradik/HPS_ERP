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
  title: string;
  allDay: boolean;
  start: string;
  end: string;
  color: string;
  staffId: string;
  clientId: string;
}

export interface UpdateScheduleInput {
  id: string;
  title?: string;
  allDay?: boolean;
  start?: string;
  end?: string;
  color?: string;
}

export type EvType = {
  id: string;
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  color: string;
  clientId?: string;
  staffId?: string;
};
