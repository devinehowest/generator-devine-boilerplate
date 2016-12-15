<% if(react) { %>import React from 'react';
import {render} from 'react-dom';
import App from './containers/App';

<% } %>const init = () => {

  <% if (react) { %>render(
    <App />,
    document.querySelector(`.react-mount`)
  );<% } else { %>console.log('Hello Boilerplate')<% } %>

};

init();
