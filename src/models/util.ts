interface WithTime {
  createdAt: number;
  updatedAt: number;
  [key: string]: any;
}

export const withTime = (object: any): WithTime => {
  const timestamp = +new Date();
  return {
    ...object,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};
