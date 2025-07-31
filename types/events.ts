export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  eventType: EventType;
  startDate: Date;
  endDate?: Date;
  location?: string;
  isOnline: boolean;
  maxAttendees?: number;
  registrationUrl?: string;
  isActive: boolean;
  companyId: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  stateId?: number;
  state?: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export enum EventType {
  BOOTCAMP = 'bootcamp',
  JOB_FAIR = 'job_fair',
  COURSE = 'course',
  WORKSHOP = 'workshop',
  CONFERENCE = 'conference',
  NETWORKING = 'networking',
  WEBINAR = 'webinar',
  OTHER = 'other'
}

export const EventTypeLabels: Record<EventType, string> = {
  [EventType.BOOTCAMP]: 'Bootcamp',
  [EventType.JOB_FAIR]: 'Feria de Empleo',
  [EventType.COURSE]: 'Curso',
  [EventType.WORKSHOP]: 'Taller',
  [EventType.CONFERENCE]: 'Conferencia',
  [EventType.NETWORKING]: 'Networking',
  [EventType.WEBINAR]: 'Webinar',
  [EventType.OTHER]: 'Otro'
};

export interface CreateEventData {
  title: string;
  description: string;
  eventType: EventType;
  startDate: Date;
  endDate?: Date;
  location?: string;
  isOnline: boolean;
  maxAttendees?: number;
  registrationUrl?: string;
  stateId?: number;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  isActive?: boolean;
}