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
