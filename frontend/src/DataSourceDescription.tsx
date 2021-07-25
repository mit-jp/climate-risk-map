import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedDataSource, toggleDatasetDescription } from './appSlice';
import { useThunkDispatch } from './Home';
import { RootState } from './store';

const DataSourceDescription = () => {
    const dispatch = useThunkDispatch();
    const shouldShow = useSelector((state: RootState) => state.app.showDatasetDescription);
    const dataSource = useSelector(selectSelectedDataSource);

    if (!dataSource) {
        return null;
    }

    return <div id="dataset-description">
        <button
            onClick={() => dispatch(toggleDatasetDescription())}
            className={shouldShow ? "shown" : undefined}>
            About the {dataSource.name} dataset
        </button>
        {shouldShow && <p>{dataSource.description}</p>}
        {shouldShow && <p><a href={dataSource.link}>{dataSource.name} website</a></p>}

    </div>
}

export default DataSourceDescription;