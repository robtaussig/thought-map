import React, { useRef, useEffect } from 'react';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

export const Notifications = React.memo(({ lastNotification }) => {
  const notificationRef = useRef(null);

  useEffect(() => {
    if (lastNotification) {
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
  }, [lastNotification]);

  return (
    <ReactNotification ref={notificationRef} isMobile={true}/>
  );
});

export default Notifications;
