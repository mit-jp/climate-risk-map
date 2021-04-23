import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dataDefinitions, { DataGroup, DataIdParams, Dataset, MapType, Normalization, Year } from './DataDefinitions';
import { TopoJson } from './Home';
import DataTab from './DataTab';
import { State } from './States';
import { getDatasets, getYears } from './SingleDataSelector';
import { WaterwayValue } from './WaterwayType';

export type DataRow = { [key: string]: number | null };
export type Data = { [key: string]: DataRow };
export type TransmissionLineType = "Level 2 (230kV-344kV)" | "Level 3 (>= 345kV)" | "Level 2 & 3 (>= 230kV)";
export type OverlayName = "Highways" | "Major railroads" | "Transmission lines" | "Marine highways" | "Critical habitats";
export type Overlay = { topoJson?: TopoJson, shouldShow: boolean };

interface AppState {
    readonly map?: TopoJson;
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
        setState: (state, action: PayloadAction<State | undefined>) => {
            state.state = action.payload;
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
        }
    },
});

export const {
    setMap, setData, setState, setShowOverlay, setOverlay, setDetailedView,
    toggleDatasetDescription, clickTab, changeWeight, changeYear,
    changeDataset, changeDataGroup, setSelections, toggleDataDescription,
    setShowDemographics, setShowRiskMetrics, setWaterwayValue, setTransmissionLineType,
} = appSlice.actions;

export const getSelections = (state: AppState) => state.dataSelections[state.dataTab];

export default appSlice.reducer;
