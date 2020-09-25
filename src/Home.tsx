import React, { useEffect, useState, ChangeEvent } from 'react';
import Map from './Map';
import DataSelector from './DataSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { DataName } from './DataTypes';
import { json } from 'd3-fetch';
import { useHistory, useParams } from "react-router-dom";

type AppState = {
  data: Topology<Objects<GeoJsonProperties>> | undefined,
  selection: DataName
};

const Home = () => {
  const history = useHistory();
  const { id } = useParams<{id: string}>();

  let idEnum: DataName | undefined = DataName[id as keyof typeof DataName]

  const [data, setData] = useState<Topology<Objects<GeoJsonProperties>> | undefined>(undefined);
  const [selection, setSelection] = useState<DataName>(idEnum ? idEnum : DataName.cmi10_80_1);

  useEffect(() => {
    json<Topology<Objects<GeoJsonProperties>>>(process.env.PUBLIC_URL + "/usa-topo.json").then(setData);
  }, []);

  useEffect(() => {
    console.log("id changed")
    let idEnum: DataName | undefined = DataName[id as keyof typeof DataName]
    if (idEnum) {
      console.log("setting selection")
      setSelection(idEnum);
    }
  }, [id])

  const onSelectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    history.push(event.target.value);
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
