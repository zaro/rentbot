import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';


function startApp() {
  return ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}

injectTapEventPlugin();
startApp();
