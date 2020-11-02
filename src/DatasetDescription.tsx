import React from 'react';
import { Dataset, datasetDefinitions } from './DataDefinitions';

type Props = {datasets: Dataset[], shouldShow: boolean, showClicked: () => void};

const DatasetDescription = ({datasets, shouldShow, showClicked}: Props) => {
    if (datasets.length !== 1) {
        return null;
    }
    const datasetDefinition = datasetDefinitions.get(datasets[0])!;
    return <div id="dataset-description">
        <button
            onClick={showClicked}
            className={shouldShow ? "shown" : undefined}>
            About the {datasetDefinition.name} dataset
        </button>
        {shouldShow && <p>{datasetDefinition.description}</p>}
        {shouldShow && <p><a href={datasetDefinition.link}>{datasetDefinition.name} website</a></p>}

    </div>
}

export default DatasetDescription;