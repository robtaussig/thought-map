import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';
import { Portal } from './hooks/usePortal';
import store from './store';
import Themer from './lib/Themer';

(window as any).APP_VERSION = '1.1';

ReactDOM.render(
  (
    <BrowserRouter>
      <ReduxProvider store={store}>
        <Themer>          
          <CssBaseline />
          <Portal>
            <App />
          </Portal>
        </Themer>
      </ReduxProvider>
    </BrowserRouter>
  ),
  document.getElementById('root')
);

if ("serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    console.log("[PWA Builder] active service worker found, no need to register");
  } else {
    // Register the service worker
    navigator.serviceWorker
      .register("public/sw.js", {
        scope: "./"
      })
      .then(function (reg) {
        console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
        reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BIwXEvPsInlDsg5cwhrCmrSc_SMl-VWizfB-BL2h8vuMKWkvYCH6_J29Z-SUcJ3Dx2hnOz9LImtKIyYklIjN5VE'
        }).then(
          function (pushSubscription) {
            console.log(pushSubscription.endpoint);
            // The push subscription details needed by the application
            // server are now available, and can be sent to it using,
            // for example, an XMLHttpRequest.
          }, function (error) {
            // During development it often helps to log errors to the
            // console. In a production environment it might make sense to
            // also report information about errors back to the
            // application server.
            console.log(error);
          }
        );
      });
  }
}