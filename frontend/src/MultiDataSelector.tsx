import React, { ChangeEvent } from 'react';
import { Map } from 'immutable';
import Slider from '@material-ui/core/Slider';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useThunkDispatch } from './Home';
import { useSelector } from 'react-redux';
import { changeWeight, selectSelections, setMapSelections, setShowRiskMetrics, setShowDemographics, selectMapVisualizations } from './appSlice';
import { RootState, store } from './store';
import { MapSelection, MapVisualizationId } from './DataSelector';
import { MapVisualization } from './FullMap';

const multipleChecked = (selections: MapSelection[]) => {
    return selections.length > 1;
}

const checkBox = (
    map: MapVisualization,
    shouldBeChecked: (mapId: MapVisualizationId) => boolean,
    onSelectionToggled: (event: ChangeEvent<HTMLInputElement>) => void,
    selections: MapSelection[],
    dataWeights: { [key in MapVisualizationId]?: number },
    dispatch: typeof store.dispatch
) => {
    return <div key={map.id} className={shouldBeChecked(map.id) ? "selected-group" : undefined}>

        <input
            className="data-group"
            id={map.id.toString()}
            checked={shouldBeChecked(map.id)}
            type="checkbox"
            value={map.id}
            onChange={onSelectionToggled}
            name="mapId" />
        <label className="data-group" htmlFor={map.id.toString()}>{map.name}</label>
        {shouldBeChecked(map.id) && multipleChecked(selections) &&
            <div className="weight">
                <div className="weight-label">Weight</div>
                <Slider
                    className="weight-slider"
                    min={0.1}
                    max={1}
                    step={0.1}
                    marks={marks}
                    valueLabelDisplay="auto"
                    onChange={(_, weight) => dispatch(changeWeight({ mapVisualizationId: map.id, weight: weight as number }))}
                    value={dataWeights[map.id] ?? 1} />
            </div>}
    </div>;
}


const marks = [{ value: 0.1, label: "min" }, { value: 1, label: "max" }]

const MultiDataSelector = () => {
    const dispatch = useThunkDispatch();
    const dataWeights = useSelector((state: RootState) => state.app.dataWeights);
    const showRiskMetrics = useSelector((state: RootState) => state.app.showRiskMetrics);
    const showDemographics = useSelector((state: RootState) => state.app.showDemographics);
    const maps = useSelector(selectMapVisualizations);
    const selections = useSelector(selectSelections);

    const selectionMap = Map(selections.map(selection => [selection.mapVisualization, selection]));

    const onSelectionToggled = (event: ChangeEvent<HTMLInputElement>) => {
        const map = maps[parseInt(event.target.value)];
        const checked = event.target.checked;
        var changedSelections;
        if (checked) {
            const source = map.defaultDataSource ?? map.sources[0].id;
            const dateRange = map.defaultDateRange ?? map.dateRangesBySource[source][0];
            changedSelections = selectionMap.set(map.id, {
                mapVisualization: map.id,
                dataSource: source,
                dateRange,
            });
        } else {
            changedSelections = selectionMap.delete(map.id);
        }
        dispatch(setMapSelections(Array.from(changedSelections.values())));
    }

    const onRiskMetricsToggled = (_: ChangeEvent<{}>, expanded: boolean) => {
        dispatch(setShowRiskMetrics(expanded));
    }

    const onDemographicsToggled = (_: ChangeEvent<{}>, expanded: boolean) => {
        dispatch(setShowDemographics(expanded));
    }

    const shouldBeChecked = (mapId: MapVisualizationId) => {
        return selectionMap.has(mapId);
    }

    const getDataList = (dataFilter: (map: MapVisualization) => boolean) =>
        Object.values(maps)
            .filter(map => dataFilter(map))
            .map(map =>
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
        <form id="data-selector">
            <Accordion expanded={showRiskMetrics} onChange={onRiskMetricsToggled}>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    expandIcon={<ExpandMoreIcon />}
                >
                    Risk Metrics
                </AccordionSummary>
                <AccordionDetails>
                    {getDataList(map => map.subcategory === 1)}
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={showDemographics} onChange={onDemographicsToggled}>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    expandIcon={<ExpandMoreIcon />}
                >
                    Environmental Justice
                </AccordionSummary>
                <AccordionDetails>
                    {getDataList(map => map.subcategory === 2)}
                </AccordionDetails>
            </Accordion>
        </form>
    )
}

export default MultiDataSelector;
