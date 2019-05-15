export const withTime = object => {
  const timestamp = new Date() - 1;
  return {
    ...object,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};
