import React from 'react';
import dataDefinitions, { DataName } from './DataDefinitions';

const DataDescription = ({selection}: {selection: DataName}) => <p id="description">{dataDefinitions.get(selection)?.description ?? ""}</p>

export default DataDescription;