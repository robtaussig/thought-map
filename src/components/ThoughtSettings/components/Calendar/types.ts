export interface Time {
  date?: string,
  dateTime?: string,
  timeZone?: string
}

export interface GoogleCalendarEvent {
  kind: 'calendar#event',
  etag?: string,
  id: string,
  status: 'confirmed',
  htmlLink?: string,
  created?: string,
  updated?: string,
  summary: string,
  description?: string,
  location?: string,
  creator?: {
    id: string,
    email: string,
    displayName: string,
    self: boolean
  },
  start?: Time,
  end?: Time,
  endTimeUnspecified?: boolean,
  reminders: {
    overrides: [
      {
        method: "popup",
        minutes: 0
      },
      {
        method: "sms",
        minutes: 30
      }
    ],
    useDefault: false
  },
}

export interface Description {

}

export interface ReminderOverride {
  method: 'sms' | 'email' | 'popup';
  minutes: number;
}

export interface Reminders {
  useDefault: false;
  overrides: ReminderOverride[];
}