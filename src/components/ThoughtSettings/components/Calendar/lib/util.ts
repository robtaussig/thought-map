import { format } from 'date-fns';
import { Thought } from '../../../../../store/rxdb/schemas/thought';
import { Time } from '../../../../../hooks/useGoogleCalendar';

export const generateHtmlLinkFromThought = (thought: Thought): string => {

    return `${location.hostname}/thought/${thought.id}`;
};

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

export const generateStartFromThought = (thought: Thought): Time => {
    const date = getDateFromThought(thought);

    const time: Time = {
        date: format(date, 'yyyy-MM-dd'),
        timeZone: 'America/New_York',
    };

    if (thought.time) {
        const [hours, minutes] = thought.time.split(':');
        const withHours = new Date(date.setHours(Number(hours), Number(minutes)));
        const dateTime = format(withHours, 'yyyy-MM-dd\'T\'HH:mm:ssxxx');
        return {
            dateTime,
        };
    }

    return time;
};

export const generateEndFromThought = (thought: Thought): Time => {
    const date = getDateFromThought(thought);

    const time: Time = {
        date: format(date, 'yyyy-MM-dd'),
        timeZone: 'America/New_York',
    };

    if (thought.time) {
        const [hours, minutes] = thought.time.split(':');
        const withHours = new Date(date.setHours(Number(hours) + 1, Number(minutes)));
        const dateTime = format(withHours, 'yyyy-MM-dd\'T\'HH:mm:ssxxx');
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
                method: 'sms',
                minutes: 30
            }
        ],
        useDefault: false
    };
};
