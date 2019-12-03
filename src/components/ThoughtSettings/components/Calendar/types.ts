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