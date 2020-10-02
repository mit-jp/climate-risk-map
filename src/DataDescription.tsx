import React from 'react';
import dataDefinitions, { DataIdParams } from './DataDefinitions';

const DataDescription = ({selection}: {selection: DataIdParams}) => <p id="description">{dataDefinitions.get(selection.dataGroup)?.description ?? ""}</p>

export default DataDescription;