import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import css from './DataSelector.module.css'
import DataSourceSelector from './DatasetSelector'
import { MapVisualization, MapVisualizationId, GeographyType } from './MapVisualization'
import YearSelector, { readable } from './YearSelector'
import { changeDataSource, changeDateRange, changeMapSelection, selectSelections } from './appSlice'
import { RootState } from './store'
import { useGetSubcategoriesQuery } from './MapApi'

function SingleDataSelector({ maps }: { maps: Record<MapVisualizationId, MapVisualization> }) {
    const selection = useSelector((state: RootState) =>
        selectSelections(state).length > 0 ? selectSelections(state)[0] : undefined
    )

    const dispatch = useDispatch()
    const { data: subcategories } = useGetSubcategoriesQuery(undefined)

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

    const isEmpty = (subcategoryId: number) =>
        Object.values(maps).filter((map) => map.subcategory === subcategoryId).length === 0

    // only show subcategory grouping when there is at least one map and all maps are GeographyType.World
    const shouldShowSubcategories =
        Object.values(maps).length > 0 &&
        Object.values(maps).every((m) => m.geography_type === GeographyType.World)

    const renderMapEntry = (map: MapVisualization) => (
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
    )

    const getDataList = (filterFn: (map: MapVisualization) => boolean) =>
        Object.values(maps)
            .sort((a, b) => a.order - b.order)
            .filter((map) => filterFn(map))
            .map((map) => renderMapEntry(map))

    return (
        <form id={css.dataSelector}>
            {shouldShowSubcategories &&
                subcategories &&
                subcategories
                    .filter((subcategory) => !isEmpty(subcategory.id))
                    .map((subcategory) => (
                        <Accordion key={subcategory.id} defaultExpanded>
                            <AccordionSummary
                                aria-controls={`subcategory-${subcategory.id}-content`}
                                id={`subcategory-${subcategory.id}-header`}
                                expandIcon={<ExpandMoreIcon />}
                            >
                                {subcategory.name}
                            </AccordionSummary>
                            <AccordionDetails style={{ padding: 0 }}>
                                {getDataList((map) => map.subcategory === subcategory.id)}
                            </AccordionDetails>
                        </Accordion>
                    ))}
            {getDataList((map) => map.subcategory == null)}
            {!shouldShowSubcategories && getDataList((map) => map.subcategory != null)}
        </form>
    )
}

export default SingleDataSelector
