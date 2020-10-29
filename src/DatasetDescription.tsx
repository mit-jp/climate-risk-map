import React from 'react';
import { Dataset, datasetDefinitions } from './DataDefinitions';

type Props = {dataset: Dataset, shouldShow: boolean, showClicked: () => void};

const DatasetDescription = ({dataset, shouldShow, showClicked}: Props) => {
    const datasetDefinition = datasetDefinitions.get(dataset)!;
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