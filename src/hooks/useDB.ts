import { useRef, useState, useEffect, createContext, useContext, Provider } from 'react';
import { DB_SETTINGS, initializeCollections } from '../store/rxdb';
import RxDB, { RxDatabase } from 'rxdb';
RxDB.plugin(require('pouchdb-adapter-idb'));

export interface DBContext {
  db: RxDatabase;
  initialize: () => Promise<RxDatabase>;
}
const DBContext = createContext<DBContext>(null);

export const useDB = (): [Provider<DBContext>, DBContext, boolean] => {
  const dbContext = useRef<DBContext>({ db: null, initialize: null });
  const [readyState, setReadyState] = useState(false);

  useEffect(() => {
    dbContext.current.initialize = async () => {
      const db = await RxDB.create(DB_SETTINGS);
      await initializeCollections(db);

      dbContext.current.db = db;
      setReadyState(true);
      return dbContext.current.db;
    }

    dbContext.current.initialize();
  }, []);

  return [DBContext.Provider, dbContext.current, readyState];
};

export const useLoadedDB = (): DBContext => {
  const dbContext = useContext(DBContext);

  return dbContext;
};
