import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import css from './DataSelector.module.css'
import DataSourceSelector from './DatasetSelector'
import { MapVisualization, MapVisualizationId } from './MapVisualization'
import YearSelector, { readable } from './YearSelector'
import { changeDataSource, changeDateRange, changeMapSelection, selectSelections } from './appSlice'
import { RootState } from './store'

function SingleDataSelector({ maps }: { maps: Record<MapVisualizationId, MapVisualization> }) {
    const selection = useSelector((state: RootState) =>
        selectSelections(state).length > 0 ? selectSelections(state)[0] : undefined
    )

    const dispatch = useDispatch()

    const onDataSourceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const dataset = parseInt(event.target.value, 10)
        dispatch(changeDataSource(dataset))
    }
    const onMapSelectionChange = (event: ChangeEvent<HTMLInputElement>) => {
        const mapVisualizationId = parseInt(event.target.value, 10)
        dispatch(changeMapSelection(maps[mapVisualizationId]))
    }

    const shouldShowYearSelector = (map: MapVisualization) =>
        selection !== undefined &&
        selection.mapVisualization === map.id &&
        map.date_ranges_by_source[selection.dataSource].length > 1

    const shouldShowYearLabel = (map: MapVisualization) =>
        selection !== undefined &&
        selection.mapVisualization === map.id &&
        map.date_ranges_by_source[selection.dataSource].length === 1

    const shouldShowDatasets = (map: MapVisualization) =>
        selection !== undefined &&
        selection.mapVisualization === map.id &&
        Object.keys(map.sources).length > 1

    return (
        <form id={css.dataSelector}>
            {Object.values(maps)
                .sort((a, b) => a.order - b.order)
                .map((map) => (
                    <div key={map.id}>
                        <input
                            className={css.input}
                            id={map.id.toString()}
                            checked={selection?.mapVisualization === map.id}
                            type="radio"
                            value={map.id}
                            onChange={onMapSelectionChange}
                            name="dataGroup"
                        />
                        <label className={css.label} htmlFor={map.id.toString()}>
                            <div className={css.name}>{map.displayName}</div>
                            {selection !== undefined && shouldShowYearLabel(map) && (
                                <div className={css.year}>{readable(selection.dateRange)}</div>
                            )}
                        </label>
                        {selection !== undefined && shouldShowYearSelector(map) && (
                            <YearSelector
                                id={map.id.toString()}
                                years={map.date_ranges_by_source[selection.dataSource]}
                                selectedYear={selection.dateRange}
                                onChange={(dateRange) => dispatch(changeDateRange(dateRange))}
                            />
                        )}
                        {selection !== undefined && shouldShowDatasets(map) && (
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
