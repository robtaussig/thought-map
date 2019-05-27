export const intoMap = items => {
  return items.reduce((all, each) => {
    all[each.id] = each;
    return all;
  }, {});
};