import React from 'react';
import Home from './Home';
import {
    BrowserRouter as Router,
    useLocation
  } from "react-router-dom";
import DownloadData from './DownloadData';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function DownloadOrHome() {
  const page = useQuery().get("page");
  if (page === "download") {
    return <DownloadData />;
  } else {
    return <Home />;
  }
}

const App = () => {
  return (<Router basename={process.env.PUBLIC_URL}>
    <DownloadOrHome />
  </Router>);
}

export default App;
