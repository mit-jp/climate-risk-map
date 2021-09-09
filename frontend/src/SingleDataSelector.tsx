import React, { ChangeEvent } from 'react';
import YearSelector from './YearSelector';
import DataSourceSelector from './DatasetSelector';
import { useSelector } from 'react-redux';
import { changeMapSelection, changeDataSource, changeDateRange, selectSelections, selectMapVisualizations } from './appSlice';
import { RootState } from './store';
import { useThunkDispatch } from './Home';
import { Interval } from 'luxon';
import { MapVisualization } from './FullMap';

const SingleDataSelector = () => {
    const selection = useSelector((state: RootState) => selectSelections(state)[0]);
    const mapVisualizations = useSelector(selectMapVisualizations);

    const dispatch = useThunkDispatch();

    const onDateRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const dateRange = Interval.fromISO(event.target.value);
        dispatch(changeDateRange(dateRange));
    };
    const onDataSourceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const dataset = parseInt(event.target.value);
        dispatch(changeDataSource(dataset));
    };
    const onMapSelectionChange = (event: ChangeEvent<HTMLInputElement>) => {
        const mapVisualizationId = parseInt(event.target.value);
        dispatch(changeMapSelection(mapVisualizationId));
    }

    const shouldShowYears = (map: MapVisualization) =>
        selection.mapVisualization === map.id &&
        map.date_ranges_by_source[selection.dataSource].length > 1;

    const shouldShowDatasets = (map: MapVisualization) =>
        selection.mapVisualization === map.id &&
        Object.keys(map.sources).length > 1;

    const mapList = () =>
        Object
            .values(mapVisualizations)
            .sort((a, b) => a.order - b.order)
            .map(map =>
                <div key={map.id}>
                    <input
                        className="data-group"
                        id={map.id.toString()}
                        checked={selection.mapVisualization === map.id}
                        type="radio"
                        value={map.id}
                        onChange={onMapSelectionChange}
                        name="dataGroup" />
                    <label className="data-group" htmlFor={map.id.toString()}>
                        {map.name}
                    </label>
                    {shouldShowYears(map) &&
                        <YearSelector
                            id={map.id.toString()}
                            years={map.date_ranges_by_source[selection.dataSource]}
                            selectedYear={selection.dateRange}
                            onSelectionChange={onDateRangeChange}
                        />
                    }
                    {shouldShowDatasets(map) &&
                        <DataSourceSelector
                            id={map.id.toString()}
                            dataSources={Object.values(map.sources)}
                            selectedDataSource={selection.dataSource}
                            onSelectionChange={onDataSourceChange}
                        />
                    }
                </div>
            )

    return (
        <form id="data-selector">
            {mapList()}
        </form>
    )
}

export default SingleDataSelector;
