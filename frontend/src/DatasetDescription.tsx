import React from 'react';
import { useSelector } from 'react-redux';
import { selectDatasets, toggleDatasetDescription } from './appSlice';
import { datasetDefinitions } from './DataDefinitions';
import { useThunkDispatch } from './Home';
import { RootState } from './store';

const DatasetDescription = () => {
    const dispatch = useThunkDispatch();
    const shouldShow = useSelector((state: RootState) => state.app.showDatasetDescription);
    const datasets = useSelector(selectDatasets);

    if (datasets.length !== 1) {
        return null;
    }
    const datasetDefinition = datasetDefinitions(datasets[0])!;
    return <div id="dataset-description">
        <button
            onClick={() => dispatch(toggleDatasetDescription())}
            className={shouldShow ? "shown" : undefined}>
            About the {datasetDefinition.name} dataset
        </button>
        {shouldShow && <p>{datasetDefinition.description}</p>}
        {shouldShow && <p><a href={datasetDefinition.link}>{datasetDefinition.name} website</a></p>}

    </div>
}

export default DatasetDescription;