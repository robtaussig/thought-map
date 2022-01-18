import React, { FC, useState, useEffect, useRef, useMemo, createContext, useContext } from 'react';
import DefaultConfig from '../../apiGoogleconfig.json';

interface Config {
  clientId: string;
  apiKey: string;
  scope: string;
  discoveryDocs: string[];
}

export interface Actions {
  createEvent: (event: any, calendarId?: string) => any;
  signIn: (config: Config) => void;
}

export interface Time {
  date?: string,
  dateTime?: string,
  timeZone?: string
}

export interface GoogleCalendarEvent {
  kind: 'calendar#event',
  etag?: string,
  id: string,
  status: 'confirmed',
  htmlLink?: string,
  created?: string,
  updated?: string,
  summary: string,
  description?: string,
  location?: string,
  creator?: {
    id: string,
    email: string,
    displayName: string,
    self: boolean
  },
  start?: Time,
  end?: Time,
  endTimeUnspecified?: boolean,
  reminders: {
    overrides: [
      {
        method: 'popup',
        minutes: 0
      },
      {
        method: 'sms',
        minutes: 30
      }
    ],
    useDefault: false
  },
}

const loadScript = async (): Promise<[any, () => void]> => {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(script);

    const cleanup = () => script.remove();

    script.onload = (): void => {
      (window as any).gapi.load('client:auth2', () => resolve([(window as any).gapi, cleanup]));
    };
  });
};

export type GoogleCalendarContextValue = [boolean, Actions, Error];

const GoogleCalendarContext = createContext<GoogleCalendarContextValue>([false, null, null]);

export const GoogleCalendarProvider: FC<any> = ({ children }) => {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const gapiRef = useRef<any>(null);
  const cleanupRef = useRef<() => void>(null);

  const actions: Actions = useMemo(() => {
    const signIn = async (config: Config = DefaultConfig): Promise<boolean> => {
      return new Promise<boolean>(async resolve => {
        const [gapi, cleanup] = await loadScript().catch(error => {
          setError(error);
          return [gapiRef.current, cleanupRef.current];
        });
  
        cleanupRef.current = cleanup;
        gapiRef.current = gapi;
        
        await gapiRef.current.client.init(config).catch(setError);
  
        gapiRef.current.auth2.getAuthInstance().isSignedIn.listen((signedIn: boolean) => {
          setSignedIn(signedIn);
          if (signedIn) {
            resolve(signedIn);
          }
        });
  
        const isSignedIn = gapiRef.current.auth2.getAuthInstance().isSignedIn.get();
        setSignedIn(isSignedIn);
      
        gapiRef.current.auth2.getAuthInstance().signIn();
      });
    };

    const createEvent = async (event: any, calendarId = 'primary'): Promise<any> => {
      const isSignedIn = gapiRef.current.auth2.getAuthInstance().isSignedIn.get();

      if (!isSignedIn) {
        await signIn();
      }

      return gapiRef.current && gapiRef.current.client.calendar.events.insert({
        'calendarId': calendarId,
        'resource': event,
      });
    };
  
    return {
      createEvent,
      signIn,
    };
  }, []);

  const contextValue: GoogleCalendarContextValue = useMemo(() => {
    return [signedIn, actions, error];
  }, [signedIn, error, actions]);

  return (
    <GoogleCalendarContext.Provider value={contextValue}>
      {children}
    </GoogleCalendarContext.Provider>
  );
};


export const useGoogleCalendar = (autoSignIn = true, config: Config = DefaultConfig): [boolean, Actions, any] => {
  const [signedIn, actions, error] = useContext(GoogleCalendarContext);
  
  useEffect(() => {
    if (!signedIn && autoSignIn) {
      actions.signIn(config);
    }
  }, [signedIn, autoSignIn, actions]);

  return [signedIn, actions, error];
};

export default useGoogleCalendar;
