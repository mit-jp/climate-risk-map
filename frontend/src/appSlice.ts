import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TopoJson } from './TopoJson';
import { State } from './States';
import { WaterwayValue } from './WaterwayType';
import { GeoJsonProperties, Feature, Geometry } from 'geojson';
import { GeometryCollection } from 'topojson-specification';
import { RootState } from './store';
import { geoPath } from 'd3';
import { feature } from 'topojson-client';
import { MapSelection } from './DataSelector';
import { Interval } from 'luxon';
import { DataSource, defaultMapVisualizations, MapType, MapVisualization, MapVisualizationByTabId, MapVisualizationId, TabToId } from "./MapVisualization";
import DataTab from './DataTab';

export type TransmissionLineType = "Level 2 (230kV-344kV)" | "Level 3 (>= 345kV)" | "Level 2 & 3 (>= 230kV)";
export type OverlayName = "Highways" | "Major railroads" | "Transmission lines" | "Marine highways" | "Critical water habitats";
export type Overlay = { topoJson?: TopoJson, shouldShow: boolean };
export type TabAndMapVisualizations = {
    dataTab: DataTab,
    mapVisualizations: MapVisualization[],
}

interface AppState {
    readonly map?: TopoJson;
    readonly mapTransform?: string;
    readonly overlays: { [key in OverlayName]: Overlay };
    readonly mapSelections: { [key in DataTab]: MapSelection[] },
    readonly dataWeights: { [key in MapVisualizationId]?: number },
    readonly mapVisualizations: MapVisualizationByTabId,
    readonly dataTab: DataTab,
    readonly showDatasetDescription: boolean,
    readonly showDataDescription: boolean,
    readonly state: State | undefined,
    readonly detailedView: boolean,
    readonly showRiskMetrics: boolean,
    readonly showDemographics: boolean,
    readonly waterwayValue: WaterwayValue,
    readonly transmissionLineType: TransmissionLineType,
}

const defaultSelections: { [key in DataTab]: MapSelection[] } = {
    [DataTab.RiskMetrics]: [{
        mapVisualization: 1,
        dateRange: Interval.fromISO("2010-01-01/2015-12-31"),
        dataSource: 2,
    }],
    [DataTab.Water]: [{
        mapVisualization: 1,
        dateRange: Interval.fromISO("2015-01-01/2015-12-31"),
        dataSource: 2,
    }],
    [DataTab.Land]: [{
        mapVisualization: 15,
        dateRange: Interval.fromISO("2017-01-01/2017-01-01"),
        dataSource: 7,
    }],
    [DataTab.Climate]: [{
        mapVisualization: 22,
        dateRange: Interval.fromISO("2000-01-01/2019-01-01"),
        dataSource: 2,
    }],
    [DataTab.Economy]: [{
        mapVisualization: 12,
        dateRange: Interval.fromISO("2019-01-01/2019-01-01"),
        dataSource: 6,
    }],
    [DataTab.Demographics]: [{
        mapVisualization: 28,
        dateRange: Interval.fromISO("2012-01-01/2016-12-31"),
        dataSource: 6,
    }],
    [DataTab.ClimateOpinions]: [{
        mapVisualization: 35,
        dateRange: Interval.fromISO("2008-01-01/2020-12-31"),
        dataSource: 4,
    }],
    [DataTab.Energy]: [{
        mapVisualization: 64,
        dateRange: Interval.fromISO("2020-01-01/2020-12-31"),
        dataSource: 11,
    }],
};

const initialState: AppState = {
    overlays: {
        "Highways": { shouldShow: false },
        "Major railroads": { shouldShow: false },
        "Transmission lines": { shouldShow: false },
        "Marine highways": { shouldShow: false },
        "Critical water habitats": { shouldShow: false },
    },
    mapSelections: defaultSelections,
    mapVisualizations: defaultMapVisualizations,
    dataWeights: {},
    dataTab: DataTab.RiskMetrics,
    showDatasetDescription: false,
    showDataDescription: false,
    state: undefined,
    detailedView: true,
    showRiskMetrics: true,
    showDemographics: true,
    waterwayValue: "total",
    transmissionLineType: "Level 3 (>= 345kV)",
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setMap: (state, action: PayloadAction<TopoJson | undefined>) => {
            state.map = action.payload;
        },
        setOverlay: (state, { payload }: PayloadAction<{ name: OverlayName, topoJson?: TopoJson }>) => {
            state.overlays[payload.name].topoJson = payload.topoJson;
        },
        setShowOverlay: (state, { payload }: PayloadAction<{ name: OverlayName, shouldShow: boolean }>) => {
            state.overlays[payload.name].shouldShow = payload.shouldShow;
        },
        setShowRiskMetrics: (state, action: PayloadAction<boolean>) => {
            state.showRiskMetrics = action.payload;
        },
        setShowDemographics: (state, action: PayloadAction<boolean>) => {
            state.showDemographics = action.payload;
        },
        setDetailedView: (state, action: PayloadAction<boolean>) => {
            state.detailedView = action.payload;
        },
        toggleDatasetDescription: state => {
            state.showDatasetDescription = !state.showDatasetDescription;
        },
        toggleDataDescription: state => {
            state.showDataDescription = !state.showDataDescription;
        },
        setDataTab: (state, action: PayloadAction<DataTab>) => {
            state.dataTab = action.payload;
        },
        changeWeight: (state, action: PayloadAction<{ mapVisualizationId: MapVisualizationId, weight: number }>) => {
            const { mapVisualizationId, weight } = action.payload;
            state.dataWeights[mapVisualizationId] = weight;
        },
        changeDateRange: (state, action: PayloadAction<Interval>) => {
            state.mapSelections[state.dataTab][0].dateRange = action.payload;
        },
        changeDataSource: (state, action: PayloadAction<number>) => {
            state.mapSelections[state.dataTab][0].dataSource = action.payload;
        },
        changeMapSelection: (state, action: PayloadAction<MapVisualizationId>) => {
            const selection = state.mapSelections[state.dataTab][0];
            selection.mapVisualization = action.payload;
            const mapVisualization = state.mapVisualizations[TabToId[state.dataTab]][selection.mapVisualization];
            const possibleDataSources = getPossibleDataSources(state, selection);
            if (!possibleDataSources.includes(selection.dataSource)) {
                selection.dataSource = mapVisualization?.default_source ?? possibleDataSources[0];
            }
            const possibleDates = getPossibleDates(state, selection);
            if (selection.dateRange && !possibleDates.includes(selection.dateRange)) {
                possibleDates.length > 1 ?
                    selection.dateRange = possibleDates[1] :
                    selection.dateRange = possibleDates[0];
            }

            if (mapVisualization?.map_type === MapType.Bubble) {
                // don't zoom in to state on bubble map. it's unsupported right now
                state.state = undefined;
            }
        },
        setMapSelections: (state, action: PayloadAction<MapSelection[]>) => {
            state.mapSelections[state.dataTab] = action.payload;
        },
        setWaterwayValue(state, action: PayloadAction<WaterwayValue>) {
            state.waterwayValue = action.payload;
        },
        setTransmissionLineType(state, action: PayloadAction<TransmissionLineType>) {
            state.transmissionLineType = action.payload;
        },
        clickCounty: (state, { payload }: PayloadAction<string>) => {
            if (state.state) {
                state.state = undefined;
            } else {
                state.state = payload.slice(0, 2) as State;
            }
        },
        setMapVisualizations: (state, { payload }: PayloadAction<MapVisualizationByTabId>) => {
            state.mapVisualizations = payload;
        }
    },
});

export const {
    setMap, setShowOverlay, setOverlay, setDetailedView,
    toggleDatasetDescription, changeWeight, changeDateRange, setDataTab,
    changeDataSource, changeMapSelection, setMapSelections, toggleDataDescription,
    setShowDemographics, setShowRiskMetrics, setWaterwayValue, setTransmissionLineType,
    clickCounty, setMapVisualizations,
} = appSlice.actions;

// Convenience accessors
const getMapVisualizations = (state: AppState) => state.mapVisualizations[TabToId[state.dataTab]];
const getPossibleDataSources = (state: AppState, selection: MapSelection): number[] => {
    const mapVisualization = getMapVisualizations(state)[selection.mapVisualization];
    return Object.keys(mapVisualization!.date_ranges_by_source).map(key => parseInt(key));
}
const getPossibleDates = (state: AppState, selection: MapSelection) => {
    const mapVisualization = getMapVisualizations(state)[selection.mapVisualization];
    return mapVisualization!.date_ranges_by_source[selection.dataSource];
}

// Accessors that return a new object every time, or run for a long time.
// Do not use these as they will always force a re-render, or take too long to re-render.
// Instead use the selectors that use them.
const generateMapTransform = (state: State | undefined, map: TopoJson | undefined) => {
    if (state === undefined || map === undefined) {
        return undefined;
    }
    const stateFeatures = feature(
        map,
        map.objects.states as GeometryCollection<GeoJsonProperties>
    ).features.reduce((accumulator, currentValue) => {
        accumulator[currentValue.id as State] = currentValue;
        return accumulator;
    }, {} as { [key in State]: Feature<Geometry, GeoJsonProperties> });
    const width = 900;
    const bounds = geoPath().bounds(stateFeatures[state]),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / width, dy / 610),
        translate = [width / 2 - scale * x, 610 / 2 - scale * y],
        transform = `translate(${translate})scale(${scale})`;
    return transform;
}

// Selectors
export const selectIsNormalized = (state: RootState) => state.app.dataTab === DataTab.RiskMetrics;
export const selectSelections = (state: RootState) => state.app.mapSelections[state.app.dataTab];
export const selectMapVisualizations = (state: RootState) => getMapVisualizations(state.app);
export const selectSelectedMapVisualizations = createSelector(
    selectSelections,
    selectMapVisualizations,
    (selections, mapVisualizations): MapVisualization[] => {
        return Object.keys(mapVisualizations).length === 0 ?
            [] :
            selections.map(selection => mapVisualizations[selection.mapVisualization]);
    }
)
export const selectMapTransform = createSelector(
    (state: RootState) => state.app.state,
    (state: RootState) => state.app.map,
    generateMapTransform
);
export const selectDataQueryParams = createSelector(
    selectMapVisualizations,
    selectSelections,
    (mapVisualizations, selections) =>
        Object.entries(mapVisualizations).length > 0 && selections.length > 0 ?
            selections.map(selection => ({
                dataset: mapVisualizations[selection.mapVisualization].dataset,
                source: selection.dataSource,
                startDate: selection.dateRange.start.toISODate(),
                endDate: selection.dateRange.end.toISODate(),
            })) :
            undefined
);
export const selectSelectedDataSource = (state: RootState): DataSource | undefined => {
    const selections = selectSelections(state);
    const selectedMaps = selectSelectedMapVisualizations(state);
    if (selections.length !== 1 || selectedMaps.length !== 1) {
        return undefined;
    }
    const selection = selections[0];
    const selectedMap = selectedMaps[0];

    return selectedMap.sources[selection.dataSource];
};

export default appSlice.reducer;
