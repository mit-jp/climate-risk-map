import React, { useEffect, useState, MouseEvent } from 'react';
import MapUI from './MapUI';
import Footer from './Footer';
import Header from './Header';
import Navigation from './Navigation';
import DataSelector from './DataSelector';
import { Objects, Topology } from 'topojson-specification';
import { GeoJsonProperties } from 'geojson';
import './App.css';
import { Map } from 'immutable';
import { DataGroup, DataIdParams, Dataset, DataType, Year } from './DataDefinitions';
import { json } from 'd3-fetch';

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
const Home = () => {
  const [data, setData] = useState<Topology<Objects<GeoJsonProperties>> | undefined>(undefined);
  const [dataSelections, setDataSelections] = useState<Map<DataType, DataIdParams[]>>(defaultSelectionMap);
  const [dataWeights, setDataWeights] = useState<Map<DataGroup, number>>(Map<DataGroup, number>());
  const [dataType, setDataType] = useState<DataType>(DataType.Climate);
  const [showDatasetDescription, setShowDatasetDescription] = useState<boolean>(false);
  const [showDataDescription, setShowDataDescription] = useState<boolean>(false);

  useEffect(() => {
    json<Topology<Objects<GeoJsonProperties>>>(process.env.PUBLIC_URL + "/usa-topo.json").then(setData);
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

  return (
    <React.Fragment>
      <Header />
      <Navigation selection={dataType} onDataTypeChanged={onDataTypeChanged} />
      <div id="content">
      <DataSelector
        onSelectionChange={onSelectionChange}
        dataType={dataType}
        selection={dataSelections.get(dataType)!}
        onWeightChange={onWeightChange}
        dataWeights={dataWeights}
      />
      <MapUI
        data={data}
        selections={dataSelections.get(dataType)!}
        dataWeights={dataWeights}
        showDatasetDescription={showDatasetDescription}
        onDatasetDescriptionClicked={onDatasetDescriptionToggled}
        showDataDescription={showDataDescription}
        onDataDescriptionClicked={onDataDescriptionToggled}
      />
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Home;
