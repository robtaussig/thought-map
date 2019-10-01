import { format } from 'date-fns'
import { Thought } from '../../../../../store/rxdb/schemas/thought';
import { Time } from '../types';

export const generateHtmlLinkFromThought = (thought: Thought): string => {

  return `${location.hostname}/thought/${thought.id}`;
};

export const generateStartFromThought = (thought: Thought): Time => {
  const date = thought.date ? new Date(thought.date) : new Date();

  const time: Time = {
    date: format(date, 'yyyy-MM-dd'),
    timeZone: 'America/New_York',
  };

  if (thought.time) {
    const [hours, minutes] = thought.time.split(':');
    const withHours = date.setHours(Number(hours), Number(minutes));
    const dateTime = format(new Date(withHours), 'yyyy-MM-dd\'T\'HH:mm:ssxxx');
    return {
      dateTime,
    };
  }

  return time;
};

export const generateEndFromThought = (thought: Thought): Time => {
  const date = thought.date ? new Date(thought.date) : new Date();
  const time: Time = {
    date: format(date, 'yyyy-MM-dd'),
    timeZone: 'America/New_York',
  };

  if (thought.time) {
    const [hours, minutes] = thought.time.split(':');
    const withHours = date.setHours(Number(hours) + 1, Number(minutes));
    const dateTime = format(new Date(withHours), 'yyyy-MM-dd\'T\'HH:mm:ssxxx');
    return {
      dateTime,
    };
  }

  return time;
};

export const generateDescriptionFromThought = (thought: Thought): string => {

  return `
    <b>Description</b>\n
    ${thought.description}\n
    <b>URL:</b> ${generateHtmlLinkFromThought(thought)}
  `;
};

export const generateRemindersFromThought = (thought: Thought): any => {
  return {
    overrides: [
      {
        method: "sms",
        minutes: 30
      }
    ],
    useDefault: false
  };
}
