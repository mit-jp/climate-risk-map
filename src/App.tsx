import React from 'react';
import Home from './Home';
import {
    BrowserRouter as Router,
    Switch,
    Route  } from "react-router-dom";
import DownloadData from './DownloadData';

const App = () => {
  return (
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
            <Route path="/download">
                <DownloadData />
            </Route>
            <Route path="/">
                <Home />
            </Route>
        </Switch> 
      </Router>
  );
}

export default App;
