import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { theme } from './App.style';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import './store/database.js';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline/>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);

if ("serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    console.log("[PWA Builder] active service worker found, no need to register");
  } else {
    // Register the service worker
    navigator.serviceWorker
      .register("sw.js", {
        scope: "./"
      })
      .then(function (reg) {
        console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
      });
  }
}