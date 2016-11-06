import React from 'react';<% if(reactRouter) { %>
import {Match, BrowserRouter as Router} from 'react-router';

import {Home} from '../pages/';<% } %>

const App = () => {
  return (
    <% if(!reactRouter) { %><header>
      <h1>Hello Boilerplate</h1>
    </header><% } else { %><Router>
      <main>
        <Match
          exactly pattern='/'
          render={Home}
        />
      </main>
    </Router><% } %>
  );
};

export default App;
