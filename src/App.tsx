import React, { useEffect, useState } from 'react';
import Map from './Map';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { json } from 'd3-fetch';

function App() {
  const [data, setData] = useState<Topology<Objects<GeoJsonProperties>>>();
  useEffect(() => {
    json<Topology<Objects<GeoJsonProperties>>>(process.env.PUBLIC_URL + "/usa-topo.json").then(setData);
  }, []);
  return (
    <React.Fragment>
      <h1>Climate Risk Map</h1>
      <Map data={data}/>
    </React.Fragment>
  );
}

export default App;
