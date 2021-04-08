import React from 'react';
import dataDefinitions, { DataIdParams } from './DataDefinitions';

type Props = {selections: DataIdParams[], shouldShow: boolean, showClicked: () => void};

const DataDescription = ({selections, shouldShow, showClicked}: Props) => {
    if (selections.length !== 1) {
        return null;
    }
    const dataDefinition = dataDefinitions.get(selections[0].dataGroup);
    const description = dataDefinition!.description(selections[0].normalization);
    const name = dataDefinition!.name(selections[0].normalization);

    if (!description) {
        return null;
    }

    return <div id="description">
    <button
        onClick={showClicked}
        className={shouldShow ? "shown" : undefined}>
        About the {name} data
    </button>
    {shouldShow && <p>{description}</p>}
    </div>
}

export default DataDescription;