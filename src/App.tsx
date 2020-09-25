import React, { useEffect, useState, ChangeEvent } from 'react';
import Home from './Home';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";

const App = () => {
  return (
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
            <Route path="/:id">
                <Home />
            </Route>
        </Switch> 
      </Router>
  );
}

export default App;
