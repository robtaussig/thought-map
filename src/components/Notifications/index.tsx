import React, { useRef, useEffect, FC } from 'react';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

interface NotificationsProps {
  lastNotification: Notification,
  notificationDisabled: boolean,
}

interface Notification {
  message: string,
}

export const Notifications: FC<NotificationsProps> = React.memo(({ lastNotification, notificationDisabled = false }) => {
  const notificationRef = useRef<any>(null);

  useEffect(() => {
    if (notificationDisabled !== true && lastNotification) {
      notificationRef.current.addNotification({
        message: lastNotification.message,
        type: 'success',
        insert: 'top',
        container: 'bottom-right',
        animationIn: ['animated', 'fadeIn'],
        animationOut: ['animated', 'fadeOut'],
        dismiss: { duration: 1500 },
        dismissable: { click: true },
      });
    }
  }, [lastNotification, notificationDisabled]);

  return (
    <ReactNotification ref={notificationRef} isMobile={true}/>
  );
});

export default Notifications;
