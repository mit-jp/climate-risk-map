import React, { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import Navigation from './Navigation';
import DataSelector from './DataSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { Map } from 'immutable';
import { json, csv } from 'd3-fetch';
import { ScaleSequential, ScaleThreshold, ScaleDiverging, autoType, DSVParsedArray } from 'd3';
import { useDispatch } from 'react-redux';
import { store } from './store';
import MapWrapper from './MapWrapper';
import { Data, DataRow, OverlayName, setData, setMap, setOverlay } from './appSlice';
import SiteOverview from './SiteOverview';

export type TopoJson = Topology<Objects<GeoJsonProperties>>;

const csvFiles = [
  "climate.csv",
  "demographics.csv",
  "census_employment_acs5_2019.csv",
  "energy_employment.csv",
  "mortality.csv",
  "energy.csv",
  "homelessness.csv",
];
type TopoJsonFile = "usa.json" |
  "roads-topo.json" |
  "railroads-topo.json" |
  "waterways-topo.json" |
  "transmission-lines-topo.json" |
  "critical-habitats-topo.json";
const overlayToFile: { [key in OverlayName]: TopoJsonFile } = {
  "Highways": "roads-topo.json",
  "Major railroads": "railroads-topo.json",
  "Transmission lines": "transmission-lines-topo.json",
  "Marine highways": "waterways-topo.json",
  "Critical water habitats": "critical-habitats-topo.json",
}
const mapFile: TopoJsonFile = "usa.json";

const mergeFIPSCodes = (csv: DSVParsedArray<DataRow>): [string, DataRow][] =>
  csv.map(row => {
    let stateFIPS = row["STATEFP"]!.toString();
    let countyFIPS = row["COUNTYFP"]!.toString();
    delete row["STATEFP"];
    delete row["COUNTYFP"];
    stateFIPS = "0".repeat(2 - stateFIPS.length) + stateFIPS;
    countyFIPS = "0".repeat(3 - countyFIPS.length) + countyFIPS;
    return [stateFIPS + countyFIPS, row];
  });

export type ColorScheme = ScaleSequential<string, never> | ScaleThreshold<number, string, never> | ScaleDiverging<string, never>;

export const useThunkDispatch = () => useDispatch<typeof store.dispatch>();

const Home = () => {
  const dispatch = useThunkDispatch();

  useEffect(() => {
    const loadingCsvs = csvFiles.map(csvFile => csv<DataRow>(csvFile, autoType));
    Promise.all(loadingCsvs).then(loadedCsvs => {
      const dataMaps = loadedCsvs.map(mergeFIPSCodes).map(pair => Map<string, DataRow>(pair));
      const allData = Map<string, DataRow>().mergeDeep(...dataMaps)
      dispatch(setData(allData.toJS() as Data));
    });

    json<TopoJson>(mapFile).then(topoJson => {
      dispatch(setMap(topoJson));
    });

    for (const [name, file] of Object.entries(overlayToFile) as [OverlayName, TopoJsonFile][]) {
      json<TopoJson>(file).then(topoJson =>
        dispatch(setOverlay({ name, topoJson }))
      );
    }
  }, [dispatch]);

  return (
    <React.Fragment>
      <Header />
      <Navigation />
      <SiteOverview />
      <div id="content">
        <DataSelector />
        <MapWrapper />
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Home;
