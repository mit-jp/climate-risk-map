import React, { useEffect, useState, MouseEvent } from 'react';
import MapUI from './MapUI';
import Navigation from './Navigation';
import DataSelector from './DataSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { Map } from 'immutable';
import logo from './logo.jpg';
import icon_facebook  from './icon_facebook.png';
import icon_twitter  from './icon_twitter.png';
import icon_rss  from './icon_rss.png';
import icon_mail  from './icon_mail.png';
import dataDefinitions, { DataGroup, DataIdParams, Dataset, DataType, Year } from './DataDefinitions';
import { json } from 'd3-fetch';

function getInfoFromSelection(dataSelection: DataIdParams | undefined): { selection: DataIdParams | undefined, dataType: DataType } {
  let selection;
  let dataType = DataType.Climate;

  if (dataSelection !== undefined) {
    const dataDefinition = dataDefinitions.get(dataSelection.dataGroup);
    dataType = dataDefinition!.type;
    selection = dataSelection;
  }

  return {
    selection,
    dataType
  }
}

const defaultSelections = Map<DataType, DataIdParams>([
  [DataType.Climate, {
    dataGroup: DataGroup.IrregationDeficit,
    year: Year._2000_2019,
    dataset: Dataset.ERA5
  }],
  [DataType.Economic, {dataGroup: DataGroup.AllIndustries}],
  [DataType.Demographic, {dataGroup: DataGroup.PercentPop}],
  [DataType.Normalized, {dataGroup: DataGroup.PercentP_2}],
]);
const Home = () => {
  const [data, setData] = useState<Topology<Objects<GeoJsonProperties>> | undefined>(undefined);
  const [selections, setSelections] = useState<Map<DataType, DataIdParams>>(defaultSelections);
  const [dataType, setDataType] = useState<DataType>(DataType.Climate);

  useEffect(() => {
    json<Topology<Objects<GeoJsonProperties>>>(process.env.PUBLIC_URL + "/usa-topo.json").then(setData);
  }, []);

  const onSelectionChange = (dataId: DataIdParams) => {
    const {dataType, selection} = getInfoFromSelection(dataId);

    if (selection !== undefined) {
      const newSelections = selections.set(dataType, selection)
      setSelections(newSelections);
    }
  }

  const onDataTypeChanged = (event: MouseEvent<HTMLLIElement>) => {
    const newDataType = event.currentTarget.textContent as DataType;
    setDataType(newDataType);
  }

  return (
    <React.Fragment>
      <header>
        <a href="https://globalchange.mit.edu/"><img src={logo} alt="MIT Joint Program on The Science and Policy of Global Change" /></a>
        <h1>MIT Climate Risk Map</h1>
      </header>
      <Navigation selection={dataType} onDataTypeChanged={onDataTypeChanged} />
      <div id="content">
      <DataSelector onSelectionChange={onSelectionChange} dataType={dataType} selection={selections.get(dataType)!} />
      <MapUI data={data} selection={selections.get(dataType)!} />
      </div>
      <footer>
        <div id="address">
          <p>MIT Joint Program on the Science and Policy of Global Change</p>
          <p>Massachusetts Institute of Technology • Cambridge, MA 02139</p>
        </div>
        <ul id="social">
          <li><a href="https://www.facebook.com/MITGlobalChange/" target="_blank" rel="noopener noreferrer"><img alt="Facebook icon" src={icon_facebook} width="34" height="34" /></a></li>
          <li><a href="https://twitter.com/mitglobalchange" target="_blank" rel="noopener noreferrer"><img alt="Twitter icon" src={icon_twitter} width="34" height="34" /></a></li>
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
