import { useState, useEffect, useRef, useMemo } from 'react';
import DefaultConfig from "../../apiGoogleconfig.json";

interface Config {
  clientId: string;
  apiKey: string;
  scope: string;
  discoveryDocs: string[];
}

interface Actions {
  createEvent: (event: any, calendarId?: string) => any;
}

const loadScript = async (): Promise<[any, () => void]> => {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    document.body.appendChild(script);

    const cleanup = () => {
      script.remove();
    };

    script.onload = (): void => {
      (window as any).gapi.load('client:auth2', () => resolve([(window as any).gapi, cleanup]));
    };
  });
};

export const useGoogleCalendar = (config: Config = DefaultConfig): [boolean, Actions, any] => {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const gapiRef = useRef<any>(null);
  const cleanupRef = useRef<() => void>(null);

  useEffect(() => {
    const init = async () => {
      const [gapi, cleanup] = await loadScript();
      cleanupRef.current = cleanup;
      gapiRef.current = gapi;
      await gapiRef.current.client.init(config).catch(setError);
      gapiRef.current.auth2.getAuthInstance().isSignedIn.listen(setSignedIn);
      const isSignedIn = gapiRef.current.auth2.getAuthInstance().isSignedIn.get();
      if (!isSignedIn) {
        gapiRef.current.auth2.getAuthInstance().signIn();
      }
      setSignedIn(isSignedIn);
    };

    try {
      init();
    } catch(e) {
      setError(e);
    }

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  const actions: Actions = useMemo(() => {

    const createEvent = (event: any, calendarId?: string): any => {
      return gapiRef.current.client.calendar.events.insert({
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
