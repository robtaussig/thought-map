declare module "react-notifications-component" {
  import { Component, Ref } from 'react';

  interface ReactNotificationProps {
    ref: Ref<HTMLElement>;
    isMobile: boolean;
  }

  export default class ReactNotification extends Component<ReactNotificationProps> {

  }
}
