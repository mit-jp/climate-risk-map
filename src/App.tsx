import React, { useEffect, useState } from 'react';
import Map from './Map';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { json } from 'd3-fetch';

type AppState = {
  data: Topology<Objects<GeoJsonProperties>> | undefined,
  selection: string
};

const App = () => {
  const [{data, selection}, setData] = useState<AppState>({data: undefined, selection: "AWATER"});
  useEffect(() => {
    json<Topology<Objects<GeoJsonProperties>>>(process.env.PUBLIC_URL + "/usa-topo.json").then(d => setData({data: d, selection: selection}));
  }, []);

  return (
    <React.Fragment>
      <h1>Climate Risk Map</h1>
      <select>
        <option value="AWATER" selected>Water Area</option>
        <option value="GDP2018">GDP 2018 (USD)</option>
      </select>
      <Map data={data} selection={selection}/>
    </React.Fragment>
  );
}

export default App;
