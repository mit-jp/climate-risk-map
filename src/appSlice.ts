import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dataDefinitions, { DataGroup, DataIdParams, Dataset, MapType, Normalization, Year } from './DataDefinitions';
import { TopoJson } from './Home';
import { DataTab } from './Navigation';
import { State } from './States';
import { getDatasets, getYears } from './SingleDataSelector';

export type DataRow = { [key: string]: number | null };
export type Data = { [key: string]: DataRow };

interface AppState {
    readonly map: TopoJson | undefined,
    readonly roadMap: TopoJson | undefined,
    readonly railroadMap: TopoJson | undefined,
    readonly waterwayMap: TopoJson | undefined,
    readonly data: Data,
    readonly dataSelections: { [key in DataTab]: DataIdParams[] },
    readonly dataWeights: { [key in DataGroup]?: number },
    readonly dataTab: DataTab,
    readonly showDatasetDescription: boolean,
    readonly showDataDescription: boolean,
    readonly state: State | undefined,
    readonly showRoads: boolean,
    readonly showRailroads: boolean,
    readonly showWaterways: boolean,
    readonly detailedView: boolean,
    readonly showRiskMetrics: boolean,
    readonly showDemographics: boolean,
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
};

const initialState: AppState = {
    map: undefined,
    roadMap: undefined,
    railroadMap: undefined,
    waterwayMap: undefined,
    data: {},
    dataSelections: defaultSelections,
    dataWeights: {},
    dataTab: DataTab.RiskMetrics,
    showDatasetDescription: false,
    showDataDescription: false,
    state: undefined,
    showRoads: false,
    showRailroads: false,
    showWaterways: false,
    detailedView: true,
    showRiskMetrics: true,
    showDemographics: true,
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setMap: (state, action: PayloadAction<TopoJson | undefined>) => {
            state.map = action.payload;
        },
        setRoadMap: (state, action: PayloadAction<TopoJson | undefined>) => {
            state.roadMap = action.payload;
        },
        setRailroadMap: (state, action: PayloadAction<TopoJson | undefined>) => {
            state.railroadMap = action.payload;
        },
        setWaterwayMap: (state, action: PayloadAction<TopoJson | undefined>) => {
            state.waterwayMap = action.payload;
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
        setShowRoads: (state, action: PayloadAction<boolean>) => {
            state.showRoads = action.payload;
        },
        setShowRailroads: (state, action: PayloadAction<boolean>) => {
            state.showRailroads = action.payload;
        },
        setShowWaterways: (state, action: PayloadAction<boolean>) => {
            state.showWaterways = action.payload;
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
    },
});

export const {
    setMap, setRoadMap, setRailroadMap, setWaterwayMap, setData, setState,
    setShowRailroads, setShowRoads, setShowWaterways, setDetailedView,
    toggleDatasetDescription, clickTab, changeWeight, changeYear,
    changeDataset, changeDataGroup, setSelections, toggleDataDescription,
    setShowDemographics, setShowRiskMetrics,
} = appSlice.actions;

export const getSelections = (state: AppState) => state.dataSelections[state.dataTab];

export default appSlice.reducer;
