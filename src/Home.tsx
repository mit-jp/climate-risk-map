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
import { DSVRowString, ScaleSequential, ScaleThreshold, ScaleDiverging } from 'd3';

export type TopoJson = Topology<Objects<GeoJsonProperties>>;

const csvFiles: CsvFile[] = [
  "climate.csv",
  "demographics.csv",
];

const defaultSelectionMap = Map<DataTab, DataIdParams[]>([
  [DataTab.RiskMetrics, [{
    dataGroup: DataGroup.IrrigationDeficit,
    year: Year._2000_2019,
    dataset: Dataset.ERA5,
    normalization: Normalization.Percentile
  }]],
  [DataTab.Water, [{
    dataGroup: DataGroup.WaterStress,
    year: Year._2015,
    normalization: Normalization.Raw,
  }]],
  [DataTab.Climate, [{
    dataGroup: DataGroup.MaxTemperature,
    year: Year._2000_2019,
    dataset: Dataset.ERA5,
    normalization: Normalization.Raw
  }]],
  [DataTab.Economic, [{dataGroup: DataGroup.AllIndustries, normalization: Normalization.Raw}]],
  [DataTab.Demographics, [{dataGroup: DataGroup.PercentPopulationUnder18, normalization: Normalization.Raw}]],
  [DataTab.ClimateOpinions, [{dataGroup: DataGroup.discuss, normalization: Normalization.Raw}]],
]);
const defaultData = Map<CsvFile, undefined>(csvFiles.map(csv_file => [csv_file, undefined]));

const convertCsv = (csv: {[key: string]: string | number | undefined}[]) =>
   Map(csv.map(row => {
    let stateFIPS = (row["STATEFP"] as string)!;
    let countyFIPS = (row["COUNTYFP"] as string)!;
    stateFIPS = "0".repeat(2 - stateFIPS.length) + stateFIPS;
    countyFIPS = "0".repeat(3 - countyFIPS.length) + countyFIPS;

    return [stateFIPS + countyFIPS, row];
  }));

const convertToNumbers = (rawRow: DSVRowString) => {
  const newRows: {[key: string]: string | number | undefined} = {};
  for (let [key, value] of Object.entries(rawRow)) {
    if (key === "STATEFP" || key === "COUNTYFP") {
      newRows[key] = value;
    } else {
      newRows[key] = value ? +value : undefined;
    }
  }
  return newRows;
}
export type CsvFile =
| "climate.csv"
| "demographics.csv";
type CountyToDataMap = Map<string, {[key: string]: string | number | undefined}>;
export type Data = Map<CsvFile, CountyToDataMap | undefined>;
export type ColorScheme = ScaleSequential<string, never> | ScaleThreshold<number, string, never> | ScaleDiverging<string, never>;

const Home = () => {
  const [map, setMap] = useState<TopoJson | undefined>(undefined);
  const [roadMap, setRoadMap] = useState<TopoJson | undefined>(undefined);
  const [railroadMap, setRailroadMap] = useState<TopoJson | undefined>(undefined);
  const [waterwayMap, setWaterwayMap] = useState<TopoJson | undefined>(undefined);
  const [data, setData] = useState<Data>(defaultData);
  const [dataSelections, setDataSelections] = useState(defaultSelectionMap);
  const [dataWeights, setDataWeights] = useState(Map<DataGroup, number>());
  const [dataTab, setDataTab] = useState(DataTab.RiskMetrics);
  const [showDatasetDescription, setShowDatasetDescription] = useState(false);
  const [showDataDescription, setShowDataDescription] = useState(false);
  const [state, setState] = useState<State | undefined>(undefined);
  const [showRoads, setShowRoads] = useState<boolean>(false);
  const [showRailroads, setShowRailroads] = useState<boolean>(false);
  const [showWaterways, setShowWaterways] = useState<boolean>(false);
  const [continuous, setContinuous] = useState<boolean>(true);

  useEffect(() => {
    json<TopoJson>(process.env.PUBLIC_URL + "/usa.json").then(setMap);
    const loadingCsvs = csvFiles.map(csvFile => csv(process.env.PUBLIC_URL + "/" + csvFile, convertToNumbers));
    Promise.all(loadingCsvs).then(loadedCsvs => {
      console.log("loadedCsvs");
      const convertedCsvs = loadedCsvs.map(convertCsv);
      const filenameToData: [CsvFile, CountyToDataMap][] = [];
      for (let i = 0; i < csvFiles.length; i++) {
        filenameToData[i] = [csvFiles[i], convertedCsvs[i]];
      }
      const loadedData = Map(filenameToData);
      setData(loadedData);
    });
  }, []);

  useEffect(() => {
    json<TopoJson>(process.env.PUBLIC_URL + "/roads-topo.json").then(setRoadMap);
  }, []);

  useEffect(() => {
    json<TopoJson>(process.env.PUBLIC_URL + "/railroads-topo.json").then(setRailroadMap);
  }, []);

  useEffect(() => {
    json<TopoJson>(process.env.PUBLIC_URL + "/waterways-topo.json").then(setWaterwayMap);
  }, []);

  const onSelectionChange = (dataIds: DataIdParams[], dataTab: DataTab) => {
    const newDataSelections = dataSelections.set(dataTab, dataIds);
    setDataSelections(newDataSelections);
  }

  const onWeightChange = (dataGroup: DataGroup, weight: number) => {
    const newDataWeight = dataWeights.set(dataGroup, weight);
    setDataWeights(newDataWeight);
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
      />
      <MapUI
        roadMap={roadMap}
        showRoads={showRoads}
        railroadMap={railroadMap}
        showRailroads={showRailroads}
        waterwayMap={waterwayMap}
        showWaterways={showWaterways}
        aggregation={Aggregation.County}
        map={map}
        data={data}
        dataWeights={dataWeights}
        selections={dataSelections.get(dataTab)!}
        state={state}
        showDatasetDescription={showDatasetDescription}
        onDatasetDescriptionClicked={onDatasetDescriptionToggled}
        showDataDescription={showDataDescription}
        onDataDescriptionClicked={onDataDescriptionToggled}
        continuous={continuous}
        onContinuousChanged={setContinuous}
        onStateChange={setState}
        onShowRoadsChange={setShowRoads}
        onShowRailroadsChange={setShowRailroads}
        onShowWaterwaysChange={setShowWaterways}
      />
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Home;
