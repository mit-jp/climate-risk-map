import React, { useEffect, useState, ChangeEvent } from 'react';
import Map from './Map';
import DataSelector from './DataSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { DataName } from './DataTypes';
import { json } from 'd3-fetch';
import { useHistory, useLocation } from "react-router-dom";

type AppState = {
  data: Topology<Objects<GeoJsonProperties>> | undefined,
  selection: DataName,
  showNormalized: boolean
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const history = useHistory();
  const id = useQuery().get("id");


  let idEnum: DataName | undefined = DataName[id as keyof typeof DataName]

  const [data, setData] = useState<Topology<Objects<GeoJsonProperties>> | undefined>(undefined);
  const [selection, setSelection] = useState<DataName>(idEnum ? idEnum : DataName.cmi10_80_1);
  const [showNormalized, setNormalized] = useState<boolean>(false);

  useEffect(() => {
    json<Topology<Objects<GeoJsonProperties>>>(process.env.PUBLIC_URL + "/usa-topo.json").then(setData);
  }, []);

  useEffect(() => {
    console.log("id changed")
    let idEnum: DataName | undefined = DataName[id as keyof typeof DataName]
    if (idEnum !== undefined) {
      console.log("setting selection")
      setSelection(idEnum);
    }
  }, [id])

  const onSelectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    history.push("?id=" + event.target.value);
  }

  const onNormalizeChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setNormalized(event.target.value === "normalized")
  }

  return (
    <React.Fragment>
      <h1>Climate Risk Map</h1>
      <div>
        <input type="radio" id="raw" name="data-type" value="raw" checked={!showNormalized} onChange={onNormalizeChanged} />
        <label htmlFor="raw">Raw Data</label>
      </div>

      <div>
        <input type="radio" id="normalized" name="data-type" value="normalized"  checked={showNormalized} onChange={onNormalizeChanged} />
        <label htmlFor="normalized">Normalized Data</label>
      </div>
      <DataSelector onSelectionChange={onSelectionChange} selection={selection} />
      <Map data={data} selection={selection}/>
    </React.Fragment>
  );
};

export default Home;
