import { useState, useEffect, useRef, useMemo } from 'react';
import DefaultConfig from "../../apiGoogleconfig.json";

interface Config {
  clientId: string;
  apiKey: string;
  scope: string;
  discoveryDocs: string[];
}

export interface Actions {
  createEvent: (event: any, calendarId?: string) => any;
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
        method: "popup",
        minutes: 0
      },
      {
        method: "sms",
        minutes: 30
      }
    ],
    useDefault: false
  },
}

const loadScript = async (): Promise<[any, () => void]> => {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    document.body.appendChild(script);

    const cleanup = () => script.remove();

    script.onload = (): void => {
      (window as any).gapi.load('client:auth2', () => resolve([(window as any).gapi, cleanup]));
    };
  });
};

export const useGoogleCalendar = (autoSignIn: boolean = true, config: Config = DefaultConfig): [boolean, Actions, any] => {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const gapiRef = useRef<any>(null);
  const cleanupRef = useRef<() => void>(null);

  useEffect(() => {
    if (autoSignIn) {
      const init = async () => {
        const [gapi, cleanup] = await loadScript().catch(setError);
  
        cleanupRef.current = cleanup;
        gapiRef.current = gapi;
  
        await gapiRef.current.client.init(config).catch(setError);
  
        gapiRef.current.auth2.getAuthInstance().isSignedIn.listen(setSignedIn);
  
        const isSignedIn = gapiRef.current.auth2.getAuthInstance().isSignedIn.get();
        if (!isSignedIn) {
          gapiRef.current.auth2.getAuthInstance().signIn();
        }
  
        setSignedIn(isSignedIn);
  
        return true;
      };
      let unmounted = false;
      let timeout = setTimeout(() => {
        if (unmounted === false) setError(new Error('Connection timed out'));
      }, 5000);
      
      init()
        .then(() => clearTimeout(timeout))
        .catch(err => {
          clearTimeout(timeout);
          if (unmounted === false) setError(err);
        });
  
      return () => {
        unmounted = true;
        if (cleanupRef.current) cleanupRef.current();
      };
    }
  }, [autoSignIn]);

  const actions: Actions = useMemo(() => {

    const createEvent = (event: any, calendarId: string = 'primary'): any => {
      return gapiRef.current && gapiRef.current.client.calendar.events.insert({
        'calendarId': calendarId,
        'resource': event,
      });
    };

    return {
      createEvent,
    };
  }, []);

  return [signedIn, actions, error];
};

export default useGoogleCalendar;
