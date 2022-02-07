import { format } from 'date-fns';
import { Note, Tag, Thought } from '~store/rxdb/schemas/types';

type Associations = {
  tags?: Tag[];
  notes?: Note[];
};

type TextLine = { type: 'text', value: string };
type GenerateLine = { type: 'generate', transform: (thought: Thought, associations: Associations) => string };
type BaseMappingLine = {
  type: 'mapping',
  value: string,
};
type MappingLineWithTransform = BaseMappingLine & {
  key: string,
  transform: (thought: Thought, associations: Associations) => string,
};

type MappingLineWithoutTransform = BaseMappingLine & {
  key: keyof Thought;
  transform?: never;
}

type MappingLine = MappingLineWithTransform | MappingLineWithoutTransform;

type Line = {
  if?: (thought: Thought, associations: Associations) => boolean;
} & (TextLine | MappingLine | GenerateLine);

const todoTypes = ['task', 'todo'];
const isTodo = (thought: Thought) => todoTypes.includes(thought.status.toLowerCase());

const getDateFromThought = (thought: Thought): Date => {
  if (thought.date) {
    const [year, month, date] = thought.date.split('-');
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(date),
    );
  }

  return new Date();
};

export const generateStartFromThought = (thought: Thought) => {
  const formatted = format(getDateFromThought(thought), 'yyyyMMdd');
  if (thought.time) {
    const [hours, minutes] = thought.time.split(':');
    return `${formatted}T${hours}${minutes}00`;
  }

  return formatted;
};

const lines: Line[] = [
  {
    type: 'text',
    value: 'BEGIN:VCALENDAR',
  },
  {
    type: 'text',
    value: 'VERSION:2.0',
  },
  {
    type: 'text',
    value: 'PRODID:-//RobTaussig//ThoughtMap//EN',
  },
  {
    type: 'text',
    value: 'CALSCALE:GREGORIAN',
  },
  {
    type: 'text',
    value: 'METHOD:PUBLISH',
  },
  {
    type: 'text',
    value: 'BEGIN:VEVENT',
    if: (thought) => !isTodo(thought),
  },
  {
    type: 'text',
    value: 'BEGIN:TODO',
    if: isTodo,
  },
  {
    type: 'mapping',
    value: 'SUMMARY:{title}',
    key: 'title',
  },
  {
    type: 'mapping',
    value: 'UID:{id}',
    key: 'id',
  },
  {
    type: 'mapping',
    value: 'PRIORITY:{priority}',
    key: 'priority',
    transform: () => '0', //0-9
    if: (thought) => thought.priority !== 5,
  },
  {
    type: 'text',
    value: 'SEQUENCE:0',
  },
  {
    type: 'mapping',
    value: 'STATUS:{status}',
    key: 'status',
    transform: (thought) => {
      return {
        'completed': 'COMPLETED',
        'in progress': 'IN-PROCESS',
        'new': 'NEEDS-ACTION',
        'won\'t fix': 'CANCELLED',
      }[thought.status];
    }, //If todo: NEEDS-ACTION/COMPLETED/IN-PROCESS/CANCELLED; If event: TENTATIVE/CONFIRMED/CANCELLED
    if: isTodo,
  },
  {
    type: 'text',
    value: 'TRANSP:TRANSPARENT', //Configure 
  },
  {
    type: 'generate',
    transform: (thought) => thought.recurring.toString(), //value: 'RRULE:FREQ={freq};INTERVAL={interval};BYMONTH={b};BYMONTHDAY=12',
    if: (thought) => Boolean(thought.recurring),
  },
  {
    type: 'mapping',
    value: 'DTSTART:{start}',
    key: 'start',
    transform: generateStartFromThought,
  },
  {
    type: 'mapping',
    value: 'DURATION:{duration}',
    key: 'duration',
    transform: () => 'PT1H0M0S',
    if: (thought) => Boolean(thought.time),
  },
  {
    type: 'mapping',
    value: 'DTSTAMP:{now}',
    key: 'now',
    transform: () => format(new Date(), "yyyyMMdd'T'HHmmss"),
  },
  {
    type: 'mapping',
    value: 'DUE:{when}',
    key: 'when',
    transform: generateStartFromThought,
    if: isTodo
  },
  {
    type: 'mapping',
    value: 'CATEGORIES:{categories}',
    key: 'categories',
    transform: (_, { tags }) => {
      return tags.join(', ');
    },
    if: (_, { tags }) => tags?.length > 0,
  },
  {
    type: 'mapping',
    value: 'LOCATION:{location}',
    key: 'location',
    transform: () => 'New York, New York', //Configure
  },
  {
    type: 'generate',
    transform: (thought, { notes }) => {
      let value = 'DESCRIPTION:';
      if (thought.description) {
        thought.description.split('\n').forEach(paragraph => {
          value += paragraph;
          value += '\\n\\n';
        });
      }
      if (notes?.length > 0) {
        notes.forEach((note, idx) => {
          value += note.text;
          if (idx < notes.length - 1) {
            value += '\\n\\n';
          }
        });
      }
      return value;
    },
    if: (thought, { notes }) => Boolean(thought.description || notes?.length > 0),
  },
  {
    type: 'mapping',
    value: 'URL:{url}',
    key: 'url',
    transform: (thought) => `https://${location.host}/thought/${thought.id}`,
  },
  {
    type: 'text',
    value: 'END:VEVENT',
    if: (thought) => !isTodo(thought),
  },
  {
    type: 'text',
    value: 'END:TODO',
    if: (thought) => isTodo(thought),
  },
  {
    type: 'text',
    value: 'END:VCALENDAR',
  },
];

export const generateICS = (thought: Thought, tags: Tag[], notes: Note[]) => {
  const associations = { tags, notes };
  const generated = lines
    .filter(line => {
      if (line.if) return line.if(thought, associations);
      return true;
    })
    .map(line => {
      if (line.type === 'text') {
        return line.value;
      } else if (line.type === 'mapping') {
        const value = 'transform' in line ?
          line.transform(thought, associations) : thought[line.key];

        return line.value.replace(`{${line.key}}`, String(value));
      } else if (line.type === 'generate') {
        return line.transform(thought, associations);
      }
    });

  const SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
  window.open('data:text/calendar;charset=utf8,' + generated.join(SEPARATOR));
};

//Parse recurring
//Parse whole day or time

//Configure visibility?