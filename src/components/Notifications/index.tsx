import React, { FC, useEffect } from 'react';
import ReactNotification, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

interface NotificationsProps {
  lastNotification: Notification;
}

interface Notification {
  message: string;
}

export const Notifications: FC<NotificationsProps> = ({ lastNotification }) => {
  useEffect(() => {
    if (lastNotification) {
      store.addNotification({
        message: lastNotification.message,
        type: 'success',
        insert: 'top',
        container: 'top-center',
        animationIn: ['animated', 'fadeIn'],
        animationOut: ['animated', 'fadeOut'],
        dismiss: { duration: 1500 },
      });
    }
  }, [lastNotification]);

  return (
    <ReactNotification isMobile={true}/>
  );
};

export default Notifications;
