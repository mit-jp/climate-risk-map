import React from 'react';
import Home from './Home';
import {
    BrowserRouter as Router,
    Switch,
    Route  } from "react-router-dom";

const App = () => {
  return (
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
            <Route path="/:id">
                <Home />
            </Route>
            <Route path="/">
                <Home />
            </Route>
        </Switch> 
      </Router>
  );
}

export default App;
