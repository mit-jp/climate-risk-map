import React, { useEffect, useState, MouseEvent } from 'react';
import MapUI, { Aggregation } from './MapUI';
import Footer from './Footer';
import Header from './Header';
import Navigation, { DataTab } from './Navigation';
import DataSelector from './DataSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { Map } from 'immutable';
import { DataGroup, DataIdParams, Dataset, Normalization, Year } from './DataDefinitions';
import { json, csv } from 'd3-fetch';
import { State } from './States';
import { DSVRowString } from 'd3';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/core';

const csvFiles: CsvFile[] = [
  "climate_normalized_by_nation_stdv.csv",
  "climate_normalized_by_state_stdv.csv",
  "climate_normalized_by_nation.csv",
  "climate_normalized_by_state.csv",
  "climate.csv",
  "demographics_normalized_by_nation_stdv.csv",
  "demographics_normalized_by_state_stdv.csv",
  "demographics_normalized_by_nation.csv",
  "demographics_normalized_by_state.csv",
  "demographics.csv"
];

const defaultSelectionMap = Map<DataTab, DataIdParams[]>([
  [DataTab.Climate, [{
    dataGroup: DataGroup.IrregationDeficit,
    year: Year._2000_2019,
    dataset: Dataset.ERA5,
    normalization: Normalization.Raw
  }]],
  [DataTab.Economic, [{dataGroup: DataGroup.AllIndustries, normalization: Normalization.Raw}]],
  [DataTab.Demographic, [{dataGroup: DataGroup.PercentPopulationUnder18, normalization: Normalization.Raw}]],
  [DataTab.Normalized, [{dataGroup: DataGroup.PercentPopulationUnder18, normalization: Normalization.StandardDeviations}]],
  [DataTab.ClimateSurvey, [{dataGroup: DataGroup.discuss, normalization: Normalization.Raw}]],
]);
const defaultData = Map<CsvFile, undefined>(csvFiles.map(csv_file => [csv_file, undefined]));

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
export type CsvFile =
  "climate_normalized_by_nation_stdv.csv"
| "climate_normalized_by_state_stdv.csv"
| "climate_normalized_by_nation.csv"
| "climate_normalized_by_state.csv"
| "climate.csv"
| "demographics_normalized_by_nation_stdv.csv"
| "demographics_normalized_by_state_stdv.csv"
| "demographics_normalized_by_nation.csv"
| "demographics_normalized_by_state.csv"
| "demographics.csv";
type CountyToDataMap = Map<string, {[key: string]: string | number | undefined}>;
export type Data = Map<CsvFile, CountyToDataMap | undefined>;

const Home = () => {
  const [map, setMap] = useState<Topology<Objects<GeoJsonProperties>> | undefined>(undefined);
  const [data, setData] = useState<Data>(defaultData);
  const [dataSelections, setDataSelections] = useState(defaultSelectionMap);
  const [dataWeights, setDataWeights] = useState(Map<DataGroup, number>());
  const [dataTab, setDataTab] = useState(DataTab.Climate);
  const [showDatasetDescription, setShowDatasetDescription] = useState(false);
  const [showDataDescription, setShowDataDescription] = useState(false);
  const [aggregation, setAggregation] = useState(Aggregation.County);
  const [normalization, setNormalization] = useState(Normalization.StandardDeviations);
  const [state, setState] = useState<State | undefined>(undefined);

  useEffect(() => {
    json<Topology<Objects<GeoJsonProperties>>>(process.env.PUBLIC_URL + "/usa.json").then(setMap);
    const loadingCsvs = csvFiles.map(csvFile => csv(process.env.PUBLIC_URL + "/" + csvFile, convertToNumbers));
    Promise.all(loadingCsvs).then(loadedCsvs => {
      const convertedCsvs = loadedCsvs.map(convertCsv);
      const filenameToData: [CsvFile, CountyToDataMap][] = [];
      for (let i = 0; i < csvFiles.length; i++) {
        filenameToData[i] = [csvFiles[i], convertedCsvs[i]];
      }
      setData(Map(filenameToData));
    });
  }, []);

  const onSelectionChange = (dataIds: DataIdParams[], dataTab: DataTab) => {
    setDataSelections(dataSelections.set(dataTab, dataIds));
  }

  const onWeightChange = (dataGroup: DataGroup, weight: number) => {
    setDataWeights(dataWeights.set(dataGroup, weight));
  }

  const onDataTabChanged = (event: MouseEvent<HTMLLIElement>) => {
    const newDataTab = event.currentTarget.textContent as DataTab;
    setDataTab(newDataTab);
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
      <Navigation selection={dataTab} onDataTabChanged={onDataTabChanged} />
      <div id="content">
      <DataSelector
        onSelectionChange={onSelectionChange}
        dataTab={dataTab}
        selection={dataSelections.get(dataTab)!}
        onWeightChange={onWeightChange}
        dataWeights={dataWeights}
        normalization={normalization}
        onNormalizationChange={setNormalization}
      />
      <MapUI
        aggregation={aggregation}
        map={map}
        data={data}
        selections={dataSelections.get(dataTab)!}
        state={state}
        dataWeights={dataWeights}
        normalization={normalization}
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