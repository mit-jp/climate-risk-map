import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Interval } from 'luxon'
import YearSelector from './YearSelector'
import DataSourceSelector from './DatasetSelector'
import {
    changeMapSelection,
    changeDataSource,
    changeDateRange,
    selectSelections,
    selectMapVisualizations,
} from './appSlice'
import { RootState } from './store'
import { MapVisualization } from './MapVisualization'
import css from './DataSelector.module.css'

function SingleDataSelector() {
    const selection = useSelector((state: RootState) => selectSelections(state)[0])
    const mapVisualizations = useSelector(selectMapVisualizations)

    const dispatch = useDispatch()

    const onDateRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const dateRange = Interval.fromISO(event.target.value)
        dispatch(changeDateRange(dateRange))
    }
    const onDataSourceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const dataset = parseInt(event.target.value, 10)
        dispatch(changeDataSource(dataset))
    }
    const onMapSelectionChange = (event: ChangeEvent<HTMLInputElement>) => {
        const mapVisualizationId = parseInt(event.target.value, 10)
        dispatch(changeMapSelection(mapVisualizationId))
    }

    const shouldShowYears = (map: MapVisualization) =>
        selection.mapVisualization === map.id &&
        map.date_ranges_by_source[selection.dataSource].length > 1

    const shouldShowDatasets = (map: MapVisualization) =>
        selection.mapVisualization === map.id && Object.keys(map.sources).length > 1

    return (
        <form id={css.dataSelector}>
            {Object.values(mapVisualizations)
                .sort((a, b) => a.order - b.order)
                .map((map) => (
                    <div key={map.id}>
                        <input
                            className={css.dataGroup}
                            id={map.id.toString()}
                            checked={selection.mapVisualization === map.id}
                            type="radio"
                            value={map.id}
                            onChange={onMapSelectionChange}
                            name="dataGroup"
                        />
                        <label className={css.dataGroup} htmlFor={map.id.toString()}>
                            {map.displayName}
                        </label>
                        {shouldShowYears(map) && (
                            <YearSelector
                                id={map.id.toString()}
                                years={map.date_ranges_by_source[selection.dataSource]}
                                selectedYear={selection.dateRange}
                                onSelectionChange={onDateRangeChange}
                            />
                        )}
                        {shouldShowDatasets(map) && (
                            <DataSourceSelector
                                id={map.id.toString()}
                                dataSources={Object.values(map.sources)}
                                selectedDataSource={selection.dataSource}
                                onSelectionChange={onDataSourceChange}
                            />
                        )}
                    </div>
                ))}
        </form>
    )
}

export default SingleDataSelector
