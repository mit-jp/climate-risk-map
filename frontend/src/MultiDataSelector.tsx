import { ChangeEvent } from 'react'
import { Map } from 'immutable'
import Slider from '@mui/material/Slider'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    FormControlLabel,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useSelector } from 'react-redux'
import { useThunkDispatch } from './Home'
import {
    changeWeight,
    selectSelections,
    setMapSelections,
    setShowRiskMetrics,
    setShowDemographics,
    selectMapVisualizations,
} from './appSlice'
import { RootState, store } from './store'
import { MapSelection } from './DataSelector'
import { MapVisualization, MapVisualizationId } from './MapVisualization'
import css from './DataSelector.module.css'

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
    dataWeights: { [key in MapVisualizationId]?: number },
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
                label={map.name}
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

function MultiDataSelector() {
    const dispatch = useThunkDispatch()
    const dataWeights = useSelector((state: RootState) => state.app.dataWeights)
    const showRiskMetrics = useSelector((state: RootState) => state.app.showRiskMetrics)
    const showDemographics = useSelector((state: RootState) => state.app.showDemographics)
    const maps = useSelector(selectMapVisualizations)
    const selections = useSelector(selectSelections)

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

    const onRiskMetricsToggled = (_: ChangeEvent<{}>, expanded: boolean) => {
        dispatch(setShowRiskMetrics(expanded))
    }

    const onDemographicsToggled = (_: ChangeEvent<{}>, expanded: boolean) => {
        dispatch(setShowDemographics(expanded))
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

    return (
        <form id={css.dataSelector}>
            <Accordion expanded={showRiskMetrics} onChange={onRiskMetricsToggled}>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    expandIcon={<ExpandMoreIcon />}
                >
                    Risk Metrics
                </AccordionSummary>
                <AccordionDetails style={{ padding: 0 }}>
                    {getDataList((map) => map.subcategory === 1)}
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={showDemographics} onChange={onDemographicsToggled}>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    expandIcon={<ExpandMoreIcon />}
                >
                    Environmental Equity
                </AccordionSummary>
                <AccordionDetails style={{ padding: 0 }}>
                    {getDataList((map) => map.subcategory === 2)}
                </AccordionDetails>
            </Accordion>
        </form>
    )
}

export default MultiDataSelector
