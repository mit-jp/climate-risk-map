import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import dataDefinitions, { DataGroup, DataIdParams, Dataset, MapType, Normalization, Year } from './DataDefinitions';
import { TopoJson } from './Home';
import DataTab from './DataTab';
import { State } from './States';
import { getDatasets, getYears } from './SingleDataSelector';
import { WaterwayValue } from './WaterwayType';
import DataProcessor from './DataProcessor';
import { GeoJsonProperties, Feature, Geometry } from 'geojson';
import { GeometryCollection } from 'topojson-specification';
import { RootState } from './store';
import { geoPath } from 'd3';
import { feature } from 'topojson-client';

export type DataRow = { [key: string]: number | null };
export type Data = { [key: string]: DataRow };
export type TransmissionLineType = "Level 2 (230kV-344kV)" | "Level 3 (>= 345kV)" | "Level 2 & 3 (>= 230kV)";
export type OverlayName = "Highways" | "Major railroads" | "Transmission lines" | "Marine highways" | "Critical habitats";
export type Overlay = { topoJson?: TopoJson, shouldShow: boolean };
export type CountyHover = {
    position: { x: number, y: number },
    countyId: string,
}

interface AppState {
    readonly map?: TopoJson;
    readonly mapTransform?: string;
    readonly overlays: { [key in OverlayName]: Overlay };
    readonly data: Data,
    readonly dataSelections: { [key in DataTab]: DataIdParams[] },
    readonly dataWeights: { [key in DataGroup]?: number },
    readonly dataTab: DataTab,
    readonly showDatasetDescription: boolean,
    readonly showDataDescription: boolean,
    readonly state: State | undefined,
    readonly detailedView: boolean,
    readonly showRiskMetrics: boolean,
    readonly showDemographics: boolean,
    readonly waterwayValue: WaterwayValue,
    readonly transmissionLineType: TransmissionLineType,
    readonly hoverCountyId?: string,
    readonly hoverPosition?: { x: number, y: number },
}

const defaultSelections: { [key in DataTab]: DataIdParams[] } = {
    [DataTab.RiskMetrics]: [{
        dataGroup: DataGroup.WaterStress,
        year: Year.Average,
        dataset: Dataset.ERA5,
        normalization: Normalization.Percentile
    }],
    [DataTab.Water]: [{
        dataGroup: DataGroup.WaterStress,
        year: Year._2015,
        normalization: Normalization.Raw,
    }],
    [DataTab.Land]: [{
        dataGroup: DataGroup.ErodibleCropland,
        year: Year._2017,
        normalization: Normalization.Raw,
    }],
    [DataTab.Climate]: [{
        dataGroup: DataGroup.MaxTemperature,
        year: Year._2000_2019,
        dataset: Dataset.ERA5,
        normalization: Normalization.Raw
    }],
    [DataTab.Economy]: [{ dataGroup: DataGroup.AllIndustries, normalization: Normalization.Raw }],
    [DataTab.Demographics]: [{ dataGroup: DataGroup.PercentPopulationUnder18, normalization: Normalization.Raw }],
    [DataTab.ClimateOpinions]: [{ dataGroup: DataGroup.discuss, normalization: Normalization.Raw }],
    [DataTab.Energy]: [{ dataGroup: DataGroup.FossilFuelsEmployment, normalization: Normalization.Raw }],
    [DataTab.Health]: [{ dataGroup: DataGroup.PM2_5, normalization: Normalization.Raw }],
};

const initialState: AppState = {
    overlays: {
        "Highways": { shouldShow: false },
        "Major railroads": { shouldShow: false },
        "Transmission lines": { shouldShow: false },
        "Marine highways": { shouldShow: false },
        "Critical habitats": { shouldShow: false },
    },
    data: {},
    dataSelections: defaultSelections,
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
        setData: (state, action: PayloadAction<Data>) => {
            state.data = action.payload;
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
        clickTab: (state, action: PayloadAction<DataTab>) => {
            state.dataTab = action.payload;
            const selection = getSelections(state)[0];
            if (dataDefinitions.get(selection?.dataGroup)?.mapType === MapType.Bubble) {
                // don't zoom in to state on bubble map. it's unsupported right now
                state.state = undefined;
            }
        },
        changeWeight: (state, action: PayloadAction<{ dataGroup: DataGroup, weight: number }>) => {
            const { dataGroup, weight } = action.payload;
            state.dataWeights[dataGroup] = weight;
        },
        changeYear: (state, action: PayloadAction<Year>) => {
            getSelections(state)[0].year = action.payload;
        },
        changeDataset: (state, action: PayloadAction<Dataset>) => {
            getSelections(state)[0].dataset = action.payload;
        },
        changeDataGroup: (state, action: PayloadAction<DataGroup>) => {
            const selection = getSelections(state)[0];
            selection.dataGroup = action.payload;
            const possibleYears = getYears(selection);

            if (selection.year && !possibleYears.includes(selection.year)) {
                selection.year = undefined;
            }
            if (getYears(selection).length > 1 && selection.year === undefined) {
                selection.year = getYears(selection)[1];
            }
            if (getDatasets(selection).length > 1 && selection.dataset === undefined) {
                selection.dataset = getDatasets(selection)[0];
            }
            if (dataDefinitions.get(selection.dataGroup)?.mapType === MapType.Bubble) {
                // don't zoom in to state on bubble map. it's unsupported right now
                state.state = undefined;
            }
        },
        setSelections: (state, action: PayloadAction<DataIdParams[]>) => {
            state.dataSelections[state.dataTab] = action.payload;
        },
        setWaterwayValue(state, action: PayloadAction<WaterwayValue>) {
            state.waterwayValue = action.payload;
        },
        setTransmissionLineType(state, action: PayloadAction<TransmissionLineType>) {
            state.transmissionLineType = action.payload;
        },
        hoverCounty: (state, { payload }: PayloadAction<string | undefined>) => {
            state.hoverCountyId = payload;
        },
        hoverPosition: (state, { payload }: PayloadAction<{ x: number, y: number } | undefined>) => {
            state.hoverPosition = payload;
        },
        clickCounty: (state, { payload }: PayloadAction<string>) => {
            if (state.state) {
                state.state = undefined;
            } else {
                state.state = payload.slice(0, 2) as State;
            }
        },
    },
});

export const {
    setMap, setData, setShowOverlay, setOverlay, setDetailedView,
    toggleDatasetDescription, clickTab, changeWeight, changeYear,
    changeDataset, changeDataGroup, setSelections, toggleDataDescription,
    setShowDemographics, setShowRiskMetrics, setWaterwayValue, setTransmissionLineType,
    hoverCounty, hoverPosition, clickCounty,
} = appSlice.actions;

const getSelections = (state: AppState) => state.dataSelections[state.dataTab];

const getSelectedDataset = (selection: DataIdParams) => {
    // get the selected dataset, or the first one, if there's none selected
    return selection.dataset ?? dataDefinitions.get(selection.dataGroup)!.datasets[0];
}
const generateSelectedDatasets = (selections: DataIdParams[]) => selections.map(getSelectedDataset);
export const generateSelectedDataDefinitions = (selections: DataIdParams[]) =>
    selections.map(selection => dataDefinitions.get(selection.dataGroup)!);

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
export const selectSelections = (state: RootState) => state.app.dataSelections[state.app.dataTab];
export const selectDataDefinitions = createSelector(selectSelections, generateSelectedDataDefinitions)
export const selectDatasets = createSelector(selectSelections, generateSelectedDatasets);
export const selectProcessedData = createSelector(
    (state: RootState) => state.app.data,
    selectSelections,
    state => state.app.dataWeights,
    state => state.app.state,
    DataProcessor
);
export const selectMapTransform = createSelector(
    (state: RootState) => state.app.state,
    state => state.app.map,
    generateMapTransform
)
export default appSlice.reducer;
