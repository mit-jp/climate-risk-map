import React, { useEffect, useState, ChangeEvent } from 'react';
import Map from './Map';
import DataSelector from './DataSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { DataName } from './DataTypes';
import { json } from 'd3-fetch';

const App = () => {
  const [data, setData] = useState<Topology<Objects<GeoJsonProperties>> | undefined>(undefined);
  const [selection, setSelection] = useState<DataName>(DataName.GDP2018);
  useEffect(() => {
    json<Topology<Objects<GeoJsonProperties>>>(process.env.PUBLIC_URL + "/usa-topo.json").then(setData);
  }, []);

  const onSelectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelection(DataName[event.target.value as keyof typeof DataName]);
  }

  return (
    <React.Fragment>
      <h1>Climate Risk Map</h1>
      <DataSelector onSelectionChange={onSelectionChange} selection={selection} />
      <Map data={data} selection={selection}/>
    </React.Fragment>
  );
}

export default App;
