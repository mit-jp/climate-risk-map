import React, { useEffect, useState, ChangeEvent } from 'react';
import Map from './Map';
import DataSelector from './DataSelector';
import NormalizeSelector from './NormalizeSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import DataDescription from './DataDescription';
import dataDefinitions, { DataGroup, DataIdParams, Dataset, Year } from './DataDefinitions';
import { json } from 'd3-fetch';
import { useHistory, useLocation } from "react-router-dom";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function getInfoFromSelection(dataSelection: DataIdParams | undefined): { selection: DataIdParams | undefined, normalizedSelection: DataIdParams | undefined, normalized: boolean } {
  let normalizedSelection;
  let selection;
  let normalized = false;

  if (dataSelection !== undefined) {
    const dataDefinition = dataDefinitions.get(dataSelection.dataGroup);
    normalized = dataDefinition!.normalized;
    if (normalized) {
      normalizedSelection = dataSelection;
    } else {
      selection = dataSelection;
    }
  }

  return {
    selection,
    normalizedSelection,
    normalized
  }
}

const defaultSelection = {
  dataGroup: DataGroup.IrregationDeficit,
  year: Year._2000_2019,
  dataset: Dataset.ERA5
};

const defaultNormalizedSelection = {
  dataGroup: DataGroup.ClimateMoistureIndex,
  year: Year._2000_2019,
  dataset: Dataset.ERA5
}

const Home = () => {
  // const history = useHistory();
  // const urlString = useQuery().get("id")
  // const dataSelectionFromUrl = getDataSelectionFromString(urlString);
  const dataSelectionFromUrl = undefined;
  const infoFromUrl = getInfoFromSelection(dataSelectionFromUrl);

  let urlSelection = infoFromUrl.selection !== undefined ? infoFromUrl.selection : defaultSelection;
  let urlNormalizedSelection = infoFromUrl.normalizedSelection !== undefined ? infoFromUrl.normalizedSelection : defaultNormalizedSelection;
  let urlNormalized = infoFromUrl.normalized;

  const [data, setData] = useState<Topology<Objects<GeoJsonProperties>> | undefined>(undefined);
  const [selection, setSelection] = useState<DataIdParams>(urlSelection);
  const [normalizedSelection, setNormalizedSelection] = useState<DataIdParams>(urlNormalizedSelection);
  const [showNormalized, setNormalized] = useState<boolean>(urlNormalized);

  useEffect(() => {
    json<Topology<Objects<GeoJsonProperties>>>(process.env.PUBLIC_URL + "/usa-topo.json").then(setData);
  }, []);

  const onSelectionChange = (dataId: DataIdParams) => {
    // history.push("?dataGroup=" + dataId.dataGroup);
    const selection = dataId;
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
    // const newSelection = normalized ? normalizedSelection : selection;
    // history.push("?id=" + DataName[newSelection]);
  }

  return (
    <React.Fragment>
      <h1>Climate Risk Map</h1>
      <NormalizeSelector onSelectionChange={onNormalizeChanged} showNormalized={showNormalized} />
      <DataSelector onSelectionChange={onSelectionChange} selection={showNormalized ? normalizedSelection : selection} showNormalized={showNormalized} />
      <DataDescription selection={showNormalized ? normalizedSelection : selection} />
      <Map data={data} selection={showNormalized ? normalizedSelection : selection} />
    </React.Fragment>
  );
};

export default Home;
