import React from 'react';
import dataDefinitions, { DataIdParams } from './DataDefinitions';

type Props = {selection: DataIdParams, shouldShow: boolean, showClicked: () => void};

const DataDescription = ({selection, shouldShow, showClicked}: Props) => {
    const dataDefinition = dataDefinitions.get(selection.dataGroup);
    const description = dataDefinition!.description;
    const name = dataDefinition!.name;

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