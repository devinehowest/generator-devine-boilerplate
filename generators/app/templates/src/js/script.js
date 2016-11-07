<% if(react) { %>import React from 'react';
import {render} from 'react-dom';
import {App} from './containers/';

<% } %>const init = () => {

  <% if (react) { %>render(
    <App />,
    document.querySelector(`.container`)
  );<% } else { %>console.log('Hello Boilerplate')<% } %>

};

init();
