import React, { useEffect, useState, MouseEvent } from 'react';
import Map from './Map';
import Navigation from './Navigation';
import DataSelector from './DataSelector';
import NormalizeSelector from './NormalizeSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import logo from './logo.jpg';
import icon_facebook  from './icon_facebook.png';
import icon_twitter  from './icon_twitter.png';
import icon_rss  from './icon_rss.png';
import icon_mail  from './icon_mail.png';
import DataDescription from './DataDescription';
import dataDefinitions, { DataGroup, DataIdParams, Dataset, DataType, Year } from './DataDefinitions';
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
  dataGroup: DataGroup.PercentP_2,
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

  const onDataTypeChanged = (event: MouseEvent<HTMLLIElement>) => {
    console.log(event);
    setNormalized(event.currentTarget.textContent === DataType.Normalized);
  }

  return (
    <React.Fragment>
      <header>
        <a href="https://globalchange.mit.edu/"><img src={logo} alt="MIT Joint Program on The Science and Policy of Global Change" /></a>
        <h1>MIT Climate Risk Map</h1>
      </header>
      <Navigation selection={showNormalized ? DataType.Normalized : DataType.Raw} onDataTypeChanged={onDataTypeChanged} />
      <div id="content">
      <DataSelector onSelectionChange={onSelectionChange} selection={showNormalized ? normalizedSelection : selection} showNormalized={showNormalized} />
      <Map data={data} selection={showNormalized ? normalizedSelection : selection} />
      </div>
      <footer>
        <div id="address">
          <p>MIT Joint Program on the Science and Policy of Global Change</p>
          <p>Massachusetts Institute of Technology • Cambridge, MA 02139</p>
        </div>
        <ul id="social">
          <li><a href="https://www.facebook.com/MITGlobalChange/" target="_blank"><img alt="Facebook icon" src={icon_facebook} width="34" height="34" /></a></li>
          <li><a href="https://twitter.com/mitglobalchange" target="_blank"><img alt="Twitter icon" src={icon_twitter} width="34" height="34" /></a></li>
          <li><a href="https://globalchange.mit.edu/rss-feeds"><img alt="RSS Icon" src={icon_rss} width="34" height="34" /></a></li>
          <li><a href="http://eepurl.com/uV5Ur"><img alt="Mail Icon" src={icon_mail} width="38" height="26" /></a></li>
        </ul>
        <ul id="navigation">
          <li><a href="https://globalchange.mit.edu/about-us/our-purpose/contact-us">Contact Us</a></li>
          <li><a href="https://wikis.mit.edu/confluence/display/globalchange/Home">JP Staff &amp; Students</a></li>
          <li><a href="https://accessibility.mit.edu/">Accessibility</a></li>
        </ul>
      </footer>
    </React.Fragment>
  );
};

export default Home;
