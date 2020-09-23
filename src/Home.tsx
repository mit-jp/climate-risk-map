import React, { useEffect, useState, ChangeEvent } from 'react';
import Map from './Map';
import DataSelector from './DataSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { DataName } from './DataTypes';
import { json } from 'd3-fetch';
import { useParams } from "react-router-dom";

type AppState = {
  data: Topology<Objects<GeoJsonProperties>> | undefined,
  selection: DataName
};

const Home = () => {
  let { id } = useParams<{id: string}>();
  console.log(id + "  :::  it's working");

  const [{data, selection}, setState] = useState<AppState>({data: undefined, selection: DataName.GDP2018});
  useEffect(() => {
    json<Topology<Objects<GeoJsonProperties>>>(process.env.PUBLIC_URL + "/usa-topo.json").then(d => setState({data: d, selection: selection}));
  }, []);


  const onSelectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setState({data: data, selection: DataName[event.target.value as keyof typeof DataName]});
  }

  return (
    <React.Fragment>
      <h1>Climate Risk Map</h1>
      <DataSelector onSelectionChange={onSelectionChange} selection={selection} />
      <Map data={data} selection={selection}/>
    </React.Fragment>
  );
};

export default Home;