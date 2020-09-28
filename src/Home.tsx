import React, { useEffect, useState, ChangeEvent } from 'react';
import Map from './Map';
import DataSelector from './DataSelector';
import NormalizeSelector from './NormalizeSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import DataDefinitions, { DataName } from './DataDefinitions';
import { json } from 'd3-fetch';
import { useHistory, useLocation } from "react-router-dom";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function getDataSelectionFromString(urlString: string | null): DataName | undefined {
  return DataName[urlString as keyof typeof DataName];
}

function getInfoFromSelection(dataSelectionFromUrl: DataName | undefined): { selection: DataName | undefined, normalizedSelection: DataName | undefined, normalized: boolean } {
  let normalizedSelection;
  let selection;
  let normalized = false;

  if (dataSelectionFromUrl !== undefined) {
    const dataDefinition = DataDefinitions.get(dataSelectionFromUrl);
    normalized = dataDefinition!.normalized;
    if (normalized) {
      normalizedSelection = dataSelectionFromUrl;
    } else {
      selection = dataSelectionFromUrl;
    }
  }

  return {
    selection,
    normalizedSelection,
    normalized
  }
}

const Home = () => {
  const history = useHistory();
  const urlString = useQuery().get("id")
  const dataSelectionFromUrl = getDataSelectionFromString(urlString);
  const infoFromUrl = getInfoFromSelection(dataSelectionFromUrl);

  let initialSelection = infoFromUrl.selection !== undefined ? infoFromUrl.selection : DataName.def_80_19;
  let initialNormalizedSelection = infoFromUrl.normalizedSelection !== undefined ? infoFromUrl.normalizedSelection : DataName.cmi10_80_1;
  let initialNormalized = infoFromUrl.normalized;

  const [data, setData] = useState<Topology<Objects<GeoJsonProperties>> | undefined>(undefined);
  const [selection, setSelection] = useState<DataName>(initialSelection);
  const [normalizedSelection, setNormalizedSelection] = useState<DataName>(initialNormalizedSelection);
  const [showNormalized, setNormalized] = useState<boolean>(initialNormalized);

  useEffect(() => {
    json<Topology<Objects<GeoJsonProperties>>>(process.env.PUBLIC_URL + "/usa-topo.json").then(setData);
  }, []);

  const onSelectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    history.push("?id=" + event.target.value);
    const selection = getDataSelectionFromString(event.target.value);
    const selectionInfo = getInfoFromSelection(selection);

    if (selectionInfo.selection !== undefined) {
      setSelection(selectionInfo.selection);
    }

    if (selectionInfo.normalizedSelection !== undefined) {
      setNormalizedSelection(selectionInfo.normalizedSelection);
    }

    console.log("testing loops: seetting selection");
  }

  const onNormalizeChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setNormalized(event.target.value === "normalized")
  }

  return (
    <React.Fragment>
      <h1>Climate Risk Map</h1>
      <NormalizeSelector onSelectionChange={onNormalizeChanged} showNormalized={showNormalized} />
      <DataSelector onSelectionChange={onSelectionChange} selection={showNormalized ? normalizedSelection : selection} showNormalized={showNormalized} />
      <Map data={data} selection={showNormalized ? normalizedSelection : selection} />
    </React.Fragment>
  );
};

export default Home;
