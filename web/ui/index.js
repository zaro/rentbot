import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';


function startApp() {
  return ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}

startApp();
