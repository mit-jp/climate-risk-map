import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    FormControlLabel,
} from '@mui/material'
import Slider from '@mui/material/Slider'
import { Map } from 'immutable'
import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MapSelection } from './DataSelector'
import css from './DataSelector.module.css'
import { useGetSubcategoriesQuery } from './MapApi'
import { MapVisualization, MapVisualizationId } from './MapVisualization'
import { changeWeight, selectSelections, setMapSelections } from './appSlice'
import { RootState, store } from './store'

const multipleChecked = (selections: MapSelection[]) => {
    return selections.length > 1
}

const marks = [
    { value: 0.1, label: 'min' },
    { value: 1, label: 'max' },
]

const checkBox = (
    map: MapVisualization,
    shouldBeChecked: (mapId: MapVisualizationId) => boolean,
    onSelectionToggled: (event: ChangeEvent<HTMLInputElement>) => void,
    selections: MapSelection[],
    dataWeights: Record<MapVisualizationId, number>,
    dispatch: typeof store.dispatch
) => {
    return (
        <div
            key={map.id}
            className={shouldBeChecked(map.id) ? `${css.selectedGroup} ${css.padded}` : css.padded}
        >
            <FormControlLabel
                id={map.id.toString()}
                control={
                    <Checkbox
                        checked={shouldBeChecked(map.id)}
                        value={map.id}
                        onChange={onSelectionToggled}
                        name="mapId"
                        color="primary"
                    />
                }
                label={map.displayName}
            />
            {shouldBeChecked(map.id) && multipleChecked(selections) && (
                <div className={css.weight}>
                    <div className={css.weightLabel}>Weight</div>
                    <Slider
                        size="small"
                        className={css.weightSlider}
                        min={0.1}
                        max={1}
                        step={0.1}
                        marks={marks}
                        valueLabelDisplay="auto"
                        onChange={(_, weight) =>
                            dispatch(
                                changeWeight({
                                    mapVisualizationId: map.id,
                                    weight: weight as number,
                                })
                            )
                        }
                        value={dataWeights[map.id] ?? 1}
                    />
                </div>
            )}
        </div>
    )
}

function MultiDataSelector({ maps }: { maps: Record<MapVisualizationId, MapVisualization> }) {
    const dispatch = useDispatch()
    const dataWeights = useSelector((state: RootState) => state.app.dataWeights)
    const selections = useSelector(selectSelections)
    const { data: subcategories } = useGetSubcategoriesQuery(undefined)
    const selectionMap = Map(selections.map((selection) => [selection.mapVisualization, selection]))

    const onSelectionToggled = (event: ChangeEvent<HTMLInputElement>) => {
        const map = maps[parseInt(event.target.value, 10)]
        const { checked } = event.target
        let changedSelections
        if (checked) {
            const source =
                map.default_source ?? map.sources[parseInt(Object.keys(map.sources)[0], 10)].id
            const dateRange = map.default_date_range ?? map.date_ranges_by_source[source][0]
            changedSelections = selectionMap.set(map.id, {
                mapVisualization: map.id,
                dataSource: source,
                dateRange,
            })
        } else {
            changedSelections = selectionMap.delete(map.id)
        }
        dispatch(setMapSelections(Array.from(changedSelections.values())))
    }

    const shouldBeChecked = (mapId: MapVisualizationId) => {
        return selectionMap.has(mapId)
    }

    const getDataList = (dataFilter: (map: MapVisualization) => boolean) =>
        Object.values(maps)
            .sort((a, b) => a.order - b.order)
            .filter((map) => dataFilter(map))
            .map((map) =>
                checkBox(
                    map,
                    shouldBeChecked,
                    onSelectionToggled,
                    selections,
                    dataWeights,
                    dispatch
                )
            )

    const isEmpty = (subcategoryId: number) =>
        Object.values(maps).filter((map) => map.subcategory === subcategoryId).length === 0

    return (
        <form id={css.dataSelector}>
            {subcategories &&
                subcategories
                    .filter((subcategory) => !isEmpty(subcategory.id))
                    .map((subcategory) => (
                        <Accordion key={subcategory.id} defaultExpanded>
                            <AccordionSummary
                                aria-controls="panel1a-content"
                                id="panel1a-header"
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
        </form>
    )
}

export default MultiDataSelector
