import { Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch } from '@material-ui/core';
import React, { } from 'react';
import { useSelector } from 'react-redux';
import { Overlay, OverlayName, selectIsNormalized, selectSelectedMapVisualizations, setDetailedView, setShowOverlay, setTransmissionLineType, setWaterwayValue, TransmissionLineType } from './appSlice';
import { useThunkDispatch } from './Home';
import { RootState } from './store';
import { Map } from 'immutable';
import counties from './Counties';
import states, { State } from './States';
import { csvFormat } from 'd3';
import waterwayTypes, { WaterwayValue } from './WaterwayType';
import { saveAs } from 'file-saver';
import { getLegendTitle, MapVisualization } from './FullMap';

const getFilename = (selectedMaps: MapVisualization[], isNormalized: boolean) => {
    const unitString = getLegendTitle(selectedMaps, isNormalized);
    if (unitString === "Mean of selected data") {
        return unitString;
    } else {
        return selectedMaps[0].name + unitString;
    }
}

type Props = {
    processedData: Map<string, number> | undefined,
};

const MapControls = ({ processedData }: Props) => {
    const dispatch = useThunkDispatch();
    const isNormalized = useSelector(selectIsNormalized);
    const selectedMapVisualizations = useSelector(selectSelectedMapVisualizations);
    const overlays = useSelector((state: RootState) => state.app.overlays);
    const detailedView = useSelector((state: RootState) => state.app.detailedView);
    const waterwayValue = useSelector((state: RootState) => state.app.waterwayValue);
    const transmissionLineType = useSelector((state: RootState) => state.app.transmissionLineType);
    const transmissionLinesTypes: TransmissionLineType[] = ["Level 2 (230kV-344kV)", "Level 3 (>= 345kV)", "Level 2 & 3 (>= 230kV)"];

    const subControl = (overlayName: OverlayName) => {
        if (overlayName === "Transmission lines") {
            return <FormControl>
                <InputLabel shrink id="transmission-lines-type">
                    Type
                </InputLabel>
                <Select
                    labelId="transmission-lines-type"
                    value={transmissionLineType}
                    onChange={event => dispatch(setTransmissionLineType(event.target.value as TransmissionLineType))}
                >
                    {transmissionLinesTypes.map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
                </Select>
            </FormControl>;
        } else if (overlayName === "Marine highways") {
            return <FormControl>
                <InputLabel shrink id="waterway-type">
                    Tonnage
                </InputLabel>
                <Select
                    labelId="waterway-type"
                    value={waterwayValue}
                    onChange={event => dispatch(setWaterwayValue(event.target.value as WaterwayValue))}
                >
                    {waterwayTypes.map(({ name, value }) => <MenuItem key={value} value={value}>{name}</MenuItem>)}
                </Select>
            </FormControl>;
        } else {
            return null;
        }
    }

    const mapToggleUI = () => {
        return (Object.entries(overlays) as [OverlayName, Overlay][])
            .map(([overlayName, overlay]) => {
                return <React.Fragment key={overlayName}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={(_, value) => dispatch(setShowOverlay({ name: overlayName, shouldShow: value }))}
                                title={overlayName}
                                color="primary" />
                        }
                        label={overlayName}
                    />
                    {overlay.shouldShow && subControl(overlayName)}
                </React.Fragment>

            });
    };

    const downloadData = () => {
        const objectData = processedData
            ?.sortBy((_, fipsCode) => fipsCode)
            .map((value, fipsCode) => {
                const county = counties.get(fipsCode);
                const state = states.get(fipsCode.slice(0, 2) as State);
                return { fipsCode, state, county, value };
            })
            .valueSeq()
            .toArray();
        if (objectData) {
            const csv = csvFormat(objectData, ["fipsCode", "state", "county", "value"]);
            const blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
            saveAs(blob, getFilename(selectedMapVisualizations, isNormalized) + ".csv");
        }
    }

    return <div id="map-controls">
        {mapToggleUI()}
        {isNormalized && processedData &&
            <FormControlLabel
                control={
                    <Switch
                        checked={detailedView}
                        onChange={(_, value) => dispatch(setDetailedView(value))}
                        name="detailed-view"
                        color="primary"
                    />
                }
                label="Detailed View"
            />
        }
        {processedData && <Button variant="outlined" onClick={downloadData}>Download data</Button>}
    </div>
}

export default MapControls;