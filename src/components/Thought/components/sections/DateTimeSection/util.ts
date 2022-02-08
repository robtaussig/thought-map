import { Note, Tag, Thought } from '../../../../../store/rxdb/schemas/types';
import { saveAs } from 'file-saver';
import { EventAttributes, createEvent } from 'ics';

type Associations = {
  tags?: Tag[];
  notes?: Note[];
};



const generateDescription = (thought: Thought, { notes }: Associations) => {
  let value = '';
  if (thought.description) {
    thought.description.split('\n').forEach(paragraph => {
      value += paragraph;
      value += '\n\n';
    });
  }
  if (notes?.length > 0) {
    notes.forEach((note, idx) => {
      value += note.text;
      if (idx < notes.length - 1) {
        value += '\n\n';
      }
    });
  }
  return value;
};

export const generateICS = ({
  thought,
  tags,
  notes,
  location: eventLocation,
  participants,
  isCancel =  false,
}: {
  thought: Thought;
  tags: Tag[];
  notes: Note[];
  location?: string;
  participants?: { name: string; email: string; }[];
  isCancel?: boolean;
}) => {
  const [year, month, date] = thought.date.split('-').map(Number);
  const [hours, minutes] = thought?.time.split(':').map(Number) ?? [0, 0];
  const event: EventAttributes = {
    start: [year, month, date, hours, minutes],
    duration: { hours: thought.time ? 1 : 24, minutes: 0 },
    title: thought.title,
    uid: thought.id,
    method: isCancel ? 'CANCEL' : 'PUBLISH',
    description: generateDescription(thought, { notes }),
    location: eventLocation,
    url: `https://${location.host}/thought/${thought.id}`,
    // geo: { lat: 40.0095, lon: 105.2669 },
    categories: tags.map(({ text }) => text),
    status: isCancel ? 'CANCELLED' : 'CONFIRMED',
    busyStatus: 'BUSY',
    alarms: thought.type === 'reminder' ? [
      { action: 'display', trigger: { hours: 1, before: true } }
    ] : undefined,
    sequence: thought.lastIcsCalendarSequence + 1,
    productId: 'robtaussig//ThoughtMap//EN',
    attendees: participants.map(({ name, email }) => ({
      name, email, role: 'OPT-PARTICIPANT',
    }))
    // created: ics.convertTimestampToArray(+new Date()),
    // recurrenceRule: 'FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1',
    // organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
  };
  return new Promise((resolve, reject) => {
    createEvent(event, (error, value) => {
      if (error) {
        return reject(error);
      }
      const data = 'data:text/calendar;charset=utf8,' + value;
      saveAs(data, `${thought.id.slice(0, 6)}_${thought.lastIcsCalendarSequence + 1}_add_to_calendar.ics`);
      return resolve(data);
    });
  });
};

//Parse recurring
//Parse whole day or time

//Configure visibility?