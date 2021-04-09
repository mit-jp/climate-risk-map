import React from 'react';
import { useSelector } from 'react-redux';
import { getSelections, toggleDatasetDescription } from './appSlice';
import dataDefinitions, { DataIdParams, datasetDefinitions } from './DataDefinitions';
import { useThunkDispatch } from './Home';
import { RootState } from './store';

const DatasetDescription = () => {
    const dispatch = useThunkDispatch();
    const {datasets, shouldShow} = useSelector((state: RootState) => ({
        shouldShow: state.app.showDatasetDescription,
        datasets: getSelections(state.app).map(getDataset)
    }));
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

const getDataset = (selection: DataIdParams) => {
    // get the selected dataset, or the first one, if there's none selected
    return selection.dataset ?? dataDefinitions.get(selection.dataGroup)!.datasets[0];
}

export default DatasetDescription;