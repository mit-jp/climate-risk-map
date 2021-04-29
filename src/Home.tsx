import React, { useEffect } from 'react';
import MapUI from './MapUI';
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
import { Data, DataRow, setData, setMap, setRailroadMap, setRoadMap, setWaterwayMap } from './appSlice';

export type TopoJson = Topology<Objects<GeoJsonProperties>>;

const csvFiles = [
  "climate.csv",
  "demographics.csv",
  "census_employment_acs5_2019.csv",
  "energy_employment.csv",
];

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
    json<TopoJson>(process.env.PUBLIC_URL + "/usa.json").then(map => dispatch(setMap(map)));
  }, [dispatch]);

  useEffect(() => {
    json<TopoJson>(process.env.PUBLIC_URL + "/roads-topo.json").then(map => dispatch(setRoadMap(map)));
  }, [dispatch]);

  useEffect(() => {
    json<TopoJson>(process.env.PUBLIC_URL + "/railroads-topo.json").then(map => dispatch(setRailroadMap(map)));
  }, [dispatch]);

  useEffect(() => {
    json<TopoJson>(process.env.PUBLIC_URL + "/waterways-topo.json").then(map => dispatch(setWaterwayMap(map)));
  }, [dispatch]);

  useEffect(() => {
    const loadingCsvs = csvFiles.map(csvFile => csv<DataRow>(process.env.PUBLIC_URL + "/" + csvFile, autoType));
    Promise.all(loadingCsvs).then(loadedCsvs => {
      const dataMaps = loadedCsvs.map(mergeFIPSCodes).map(Map);
      const allData = Map<string, DataRow>().mergeDeep(...dataMaps)
      dispatch(setData(allData.toJS() as Data));
    })
  }, [dispatch]);

  return (
    <React.Fragment>
      <Header />
      <Navigation />
      <div id="content">
        <DataSelector />
        <MapUI />
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Home;
