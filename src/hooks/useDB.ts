import { useRef, useState, useEffect, createContext, useContext, Provider } from 'react';
import { DB_SETTINGS, initializeCollections } from '../store/rxdb';
import RxDB, { RxDatabase } from 'rxdb';
RxDB.plugin(require('pouchdb-adapter-idb'));

const DBContext = createContext<RxDatabase>(null);

export const useDB = (): [Provider<RxDatabase>, RxDatabase, boolean] => {
  const dbRef = useRef(null);
  const [readyState, setReadyState] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      const db = await RxDB.create(DB_SETTINGS);
      await initializeCollections(db);

      dbRef.current = db;
      setReadyState(true);
    }

    initializeDB();
  }, []);

  return [DBContext.Provider, dbRef.current, readyState];
};

export const useLoadedDB = (): RxDatabase => {
  const db = useContext(DBContext);

  return db;
};
