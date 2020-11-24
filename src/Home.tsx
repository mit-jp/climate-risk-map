import React, { useEffect, useState, MouseEvent } from 'react';
import MapUI, { Aggregation } from './MapUI';
import Footer from './Footer';
import Header from './Header';
import Navigation from './Navigation';
import DataSelector from './DataSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { Map } from 'immutable';
import { DataGroup, DataIdParams, Dataset, DataType, Year } from './DataDefinitions';
import { json, csv } from 'd3-fetch';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import { State } from './States';
import { DSVRowString } from 'd3';

const defaultSelectionMap = Map<DataType, DataIdParams[]>([
  [DataType.Climate, [{
    dataGroup: DataGroup.IrregationDeficit,
    year: Year._2000_2019,
    dataset: Dataset.ERA5
  }]],
  [DataType.Economic, [{dataGroup: DataGroup.AllIndustries}]],
  [DataType.Demographic, [{dataGroup: DataGroup.PercentPop}]],
  [DataType.Normalized, [{dataGroup: DataGroup.PercentP_2}]],
]);

const convertCsv = (csv: {[key: string]: string | number | undefined}[]) =>
   Map(csv.map(row => {
    return [(row["STATEFP"] as string)! + (row["COUNTYFP"] as string)!, row];
  }));

const convertToNumbers = (rawRow: DSVRowString, index: number, columns: string[]) => {
  const newRows: {[key: string]: string | number | undefined} = {};
  for (let [key, value] of Object.entries(rawRow)) {
    if (key === "STATEFP" || key === "COUNTYFP") {
      newRows[key] = value;
    } else {
      newRows[key] = value !== undefined ? +value : undefined;
    }
  }
  return newRows;
}

const Home = () => {
  const [map, setMap] = useState<Topology<Objects<GeoJsonProperties>> | undefined>(undefined);
  const [climate, setClimate] = useState<Map<string, {[key: string]: string | number | undefined}> | undefined>(undefined);
  const [dataSelections, setDataSelections] = useState<Map<DataType, DataIdParams[]>>(defaultSelectionMap);
  const [dataWeights, setDataWeights] = useState<Map<DataGroup, number>>(Map<DataGroup, number>());
  const [dataType, setDataType] = useState<DataType>(DataType.Climate);
  const [showDatasetDescription, setShowDatasetDescription] = useState<boolean>(false);
  const [showDataDescription, setShowDataDescription] = useState<boolean>(false);
  const [aggregation, setAggregation] = useState<Aggregation>(Aggregation.County);
  const [state, setState] = useState<State | undefined>(undefined);

  useEffect(() => {
    json<Topology<Objects<GeoJsonProperties>>>(process.env.PUBLIC_URL + "/usa.json").then(setMap);
    csv(process.env.PUBLIC_URL + "/climate.csv", convertToNumbers).then(csv => {
      setClimate(convertCsv(csv));
    });
  }, []);

  const onSelectionChange = (dataIds: DataIdParams[], dataType: DataType) => {
    setDataSelections(dataSelections.set(dataType, dataIds));
  }

  const onWeightChange = (dataGroup: DataGroup, weight: number) => {
    setDataWeights(dataWeights.set(dataGroup, weight));
  }

  const onDataTypeChanged = (event: MouseEvent<HTMLLIElement>) => {
    const newDataType = event.currentTarget.textContent as DataType;
    setDataType(newDataType);
  }

  const onDatasetDescriptionToggled = () => {
    setShowDatasetDescription(!showDatasetDescription);
  }

  const onDataDescriptionToggled = () => {
    setShowDataDescription(!showDataDescription);
  }

  const onAggregationChange = (_: any, value: Aggregation) => {
    setAggregation(value);
  }

  return (
    <React.Fragment>
      <Header />
      <Navigation selection={dataType} onDataTypeChanged={onDataTypeChanged} />
      <ToggleButtonGroup size="small" value={aggregation} exclusive onChange={onAggregationChange}>
        <ToggleButton value={Aggregation.County}>
          County
        </ToggleButton>
        <ToggleButton value={Aggregation.State}>
          State
        </ToggleButton>
      </ToggleButtonGroup>
      <div id="content">
      <DataSelector
        onSelectionChange={onSelectionChange}
        dataType={dataType}
        selection={dataSelections.get(dataType)!}
        onWeightChange={onWeightChange}
        dataWeights={dataWeights}
      />
      <MapUI
        aggregation={aggregation}
        map={map}
        data={climate}
        selections={dataSelections.get(dataType)!}
        state={state}
        dataWeights={dataWeights}
        showDatasetDescription={showDatasetDescription}
        onDatasetDescriptionClicked={onDatasetDescriptionToggled}
        showDataDescription={showDataDescription}
        onDataDescriptionClicked={onDataDescriptionToggled}
        onStateChange={setState}
      />
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Home;
