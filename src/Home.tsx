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

  let urlSelection = infoFromUrl.selection !== undefined ? infoFromUrl.selection : DataName.def_80_19_;
  let urlNormalizedSelection = infoFromUrl.normalizedSelection !== undefined ? infoFromUrl.normalizedSelection : DataName.cmi10_80_1;
  let urlNormalized = infoFromUrl.normalized;

  const [data, setData] = useState<Topology<Objects<GeoJsonProperties>> | undefined>(undefined);
  const [selection, setSelection] = useState<DataName>(urlSelection);
  const [normalizedSelection, setNormalizedSelection] = useState<DataName>(urlNormalizedSelection);
  const [showNormalized, setNormalized] = useState<boolean>(urlNormalized);

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
  }

  useEffect(() => {
    if (urlSelection !== undefined) {
      setSelection(urlSelection);
    }
  }, [urlSelection])

  useEffect(() => {
    if (urlNormalizedSelection !== undefined) {
      setNormalizedSelection(urlNormalizedSelection);
    }
  }, [urlNormalizedSelection]);

  useEffect(() => {
    setNormalized(urlNormalized);
  }, [urlNormalized])

  const onNormalizeChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const normalized = event.target.value === "normalized";
    setNormalized(normalized);
    const newSelection = normalized ? normalizedSelection : selection;
    history.push("?id=" + DataName[newSelection]);
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
