import { db } from '../store/database';
import uuidv4 from 'uuid/v4';

export const getThoughts = async () => {
  const dbResponse = await db.select({ table: 'thoughts' });

  return dbResponse.result.sort((a, b) => a.id - b.id);
};

export const createThought = async thought => {
  const timestamp = new Date() - 1;
  const thoughtObject = {
    ...thought,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const response = await db.insert({ table: 'thoughts', object: thoughtObject });

  return Object.assign({}, thoughtObject, { id: response.result });
};

export const deleteThought = async id => {
  const response = await db.delete({ table: 'thoughts', id });

  console.log(response.result);

  return response;
};

export const editThought = async thought => {
  const response = await db.insert({ table: 'thoughts', object: Object.assign({}, thought, {
    updatedAt: new Date() - 1,
  })});

  console.log(response.result);

  return thought;
};
