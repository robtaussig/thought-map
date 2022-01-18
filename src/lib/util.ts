import { useLocation } from 'react-router-dom';
import { Setting } from '../store/rxdb/schemas/setting';
import { Status } from '../store/rxdb/schemas/status';
import { SettingState } from '../types';

export interface Mappable {
  id?: string;
}

export interface MappedCollection {
  [id: string]: Mappable;
}

export const intoMap = <t extends Mappable>(items: t[]) => {
    return items.reduce((all, each) => {
        all[each.id] = each;
        return all;
    }, {} as {
    [id: string]: t
  });
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

export const useHomeUrl = () => {
    const location = useLocation();
    const pathName = location.pathname;
    const split = pathName.split('/');

    if (split[1] === 'plan') {
        return `/plan/${split[2]}/`;
    } else {
        return '/';
    }
};

export const useIdFromUrl = (key: string) => {
    const location = useLocation();
    const path = location.pathname;

    return path.split('/').reduce((id, part) => {
        if (id === true) return part;
        if (id !== false) return id;
        if (part === key) return true;
        return false;
    }, false);
};

export const getSearchParam = (key: string) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(key);
};
