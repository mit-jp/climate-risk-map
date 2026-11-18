import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import css from './DataSelector.module.css'
import DataSourceSelector from './DatasetSelector'
import {
    GeographyType,
    MapVisualization,
    MapVisualizationId,
    resolveSelection,
} from './MapVisualization'
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

    const selectedMap = selection && maps[selection.mapVisualization]
    const resolved = selectedMap && resolveSelection(selectedMap, selection)

    const onDataSourceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const source = selectedMap?.data?.sources[parseInt(event.target.value, 10)]
        if (source !== undefined) {
            dispatch(changeDataSource(source))
        }
    }
    const onMapSelectionChange = (event: ChangeEvent<HTMLInputElement>) => {
        const map = maps[parseInt(event.target.value, 10)]
        if (map !== undefined) {
            dispatch(changeMapSelection(map))
        }
    }

    const isEmpty = (subcategoryId: number) =>
        Object.values(maps).filter((map) => map.subcategory === subcategoryId).length === 0

    // only show subcategory grouping when there is at least one map and all maps are GeographyType.World
    const shouldShowSubcategories =
        Object.values(maps).length > 0 &&
        Object.values(maps).every((m) => m.geography_type === GeographyType.World)

    const renderMapEntry = (map: MapVisualization) => {
        // only the selected map shows its source and date range
        const data = resolved?.mapVisualization.id === map.id ? resolved.data : undefined
        return (
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
                    {data && data.source.dateRanges.length === 1 && (
                        <div className={css.year}>{readable(data.dateRange)}</div>
                    )}
                </label>
                {data && data.source.dateRanges.length > 1 && (
                    <YearSelector
                        id={map.id.toString()}
                        years={data.source.dateRanges}
                        selectedYear={data.dateRange}
                        onChange={(dateRange) => dispatch(changeDateRange(dateRange))}
                    />
                )}
                {data && map.data && Object.keys(map.data.sources).length > 1 && (
                    <DataSourceSelector
                        id={map.id.toString()}
                        dataSources={Object.values(map.data.sources)}
                        selectedDataSource={data.source.id}
                        onSelectionChange={onDataSourceChange}
                    />
                )}
            </div>
        )
    }

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
                        <Accordion key={subcategory.id} defaultExpanded={false}>
                            <AccordionSummary
                                aria-controls={`subcategory-${subcategory.id}-content`}
                                id={`subcategory-${subcategory.id}-header`}
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <div className={css.subcategoryTitle}>{subcategory.name}</div>
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
