import { History } from 'history';
import { Setting } from '../store/rxdb/schemas/setting';
import { Status } from '../store/rxdb/schemas/status';
import { SettingState } from '../types';

interface Mappable {
  id?: string;
}

interface MappedCollection {
  [id: string]: Mappable;
}

export const intoMap = (items: Mappable[]) => {
  return items.reduce((all, each) => {
    all[each.id] = each;
    return all;
  }, {} as MappedCollection);
};

export const convertSettings = (settings: Setting[]): SettingState => {
  return settings.reduce<any>((next, setting: Setting) => {
    next[setting.field] = setting.value;
    return next;
  }, {});
};

export const openConfirmation = (confirmationText: string, onConfirm: () => void, onReject: () => void = () => {}) => {
  if (window.confirm(confirmationText)) {
    onConfirm();
  } else {
    onReject();
  }
};

type StatusesByThought = { [thoughtId: string]: string[] };

export const thoughtStatuses = (statuses: Status[]): StatusesByThought => {
  const statusesByThought: StatusesByThought = {};
  statuses.forEach(({ id, thoughtId }) => {
    statusesByThought[thoughtId] = statusesByThought[thoughtId] || [];
    statusesByThought[thoughtId].push(id);
  });

  return statusesByThought;
};

export const homeUrl = (history: History) => {
  const pathName = history.location.pathname;
  const split = pathName.split('/');

  if (split[1] === 'plan') {
    return `/plan/${split[2]}/`;
  } else {
    return '/';
  }
};

export const getIdFromUrl = (history: History, key: string) => {
  const path = history.location.pathname;

  return path.split('/').reduce((id, part) => {
    if (id === true) return part;
    if (id !== false) return id;
    if (part === key) return true;
    return false;
  }, false);
};

export const getSearchParam = (history: History, key: string) => {
  const { search } = history.location;
  const searchParams = new URLSearchParams(search);
  return searchParams.get(key);
};
