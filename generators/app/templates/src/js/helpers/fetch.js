import {createFetch, auth, parse} from 'http-client';

export default fetch = ...args => createFetch(
  <% if(jwt) { %>auth(`Bearer ${token}`),<% } %>
  accept('application/json'),
  parse('json'),
  ...args
);
