export const intoMap = items => {
  return items.reduce((all, each) => {
    all[each.id] = each;
    return all;
  }, {});
};

export const openConfirmation = (confirmationText, onConfirm, onReject = () => {}) => {
  if (window.confirm(confirmationText)) {
    onConfirm();
  } else {
    onReject();
  }
};

export const homeUrl = history => {
  const pathName = history.location.pathname;
  const split = pathName.split('/');

  if (split[1] === 'plan') {
    return `/plan/${split[2]}/`;
  } else {
    return '/';
  }
};

export const getIdFromUrl = (history, key) => {
  const path = history.location.pathname;

  return path.split('/').reduce((id, part) => {
    if (id === true) return part;
    if (id !== false) return id;
    if (part === key) return true;
    return false;
  }, false);
};
