import { Staff } from 'src/types/staff/staff';
import { Client } from 'src/types/client/client';

export enum ScheduleStatus {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  PENDING = 'PENDING',
}

export interface ScheduleResponse {
  id: string;
  title: string;
  allDay: boolean;
  start: string;
  end: string;
  color: string;
  status: ScheduleStatus;
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
  status?: ScheduleStatus;
}

export interface UpdateScheduleInput {
  id: string;
  title?: string;
  allDay?: boolean;
  start?: string;
  end?: string;
  color?: string;
  status?: ScheduleStatus;
}

export type EvType = {
  id: string;
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  color: string;
  status?: ScheduleStatus;
  clientId?: string;
  staffId?: string;
};
