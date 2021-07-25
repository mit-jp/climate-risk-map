import React, { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import Navigation from './Navigation';
import DataSelector from './DataSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { json } from 'd3-fetch';
import { useDispatch } from 'react-redux';
import { store } from './store';
import MapWrapper from './MapWrapper';
import { OverlayName, setMap, setOverlay } from './appSlice';
import SiteOverview from './SiteOverview';

export type TopoJson = Topology<Objects<GeoJsonProperties>>;

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
  "Critical habitats": "critical-habitats-topo.json",
}
const mapFile: TopoJsonFile = "usa.json";

export const useThunkDispatch = () => useDispatch<typeof store.dispatch>();

const Home = () => {
  const dispatch = useThunkDispatch();

  useEffect(() => {
    json<TopoJson>(process.env.PUBLIC_URL + "/" + mapFile).then(topoJson => {
      dispatch(setMap(topoJson));
    });

    for (const [name, file] of Object.entries(overlayToFile) as [OverlayName, TopoJsonFile][]) {
      json<TopoJson>(process.env.PUBLIC_URL + "/" + file).then(topoJson =>
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
