import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { GeoJsonProperties, Feature, Geometry } from 'geojson'
import type { GeometryCollection } from 'topojson-specification'
import { geoPath } from 'd3'
import { feature } from 'topojson-client'
import { Interval } from 'luxon'
import { TopoJson } from './TopoJson'
import { State } from './States'
import { WaterwayValue } from './WaterwayType'
import { RootState } from './store'
import { MapSelection } from './DataSelector'
import {
    getDefaultSelection,
    MapType,
    MapVisualization,
    MapVisualizationId,
} from './MapVisualization'
import { mapApi, Tab, TabId } from './MapApi'

export type TransmissionLineType =
    | 'Level 2 (230kV-344kV)'
    | 'Level 3 (>= 345kV)'
    | 'Level 2 & 3 (>= 230kV)'
export type OverlayName =
    | 'Highways'
    | 'Major railroads'
    | 'Transmission lines'
    | 'Marine highways'
    | 'Critical water habitats'
    | 'Endangered species'
export type Overlay = { topoJson?: TopoJson; shouldShow: boolean }
export type Region = 'USA' | 'World'
interface AppState {
    readonly region: Region
    readonly map?: TopoJson
    readonly mapTransform?: string
    readonly overlays: Record<OverlayName, Overlay>
    readonly mapSelections: Record<Region, Record<TabId, MapSelection[]>>
    readonly dataWeights: Record<MapVisualizationId, number>
    readonly tab: Tab | undefined
    readonly state: State | undefined
    readonly county: string | undefined
    readonly detailedView: boolean
    readonly showRiskMetrics: boolean
    readonly showDemographics: boolean
    readonly waterwayValue: WaterwayValue
    readonly transmissionLineType: TransmissionLineType
}

const initialState: AppState = {
    region: 'USA',
    overlays: {
        Highways: { shouldShow: false },
        'Major railroads': { shouldShow: false },
        'Transmission lines': { shouldShow: false },
        'Marine highways': { shouldShow: false },
        'Critical water habitats': { shouldShow: false },
        'Endangered species': { shouldShow: false },
    },
    tab: undefined,
    mapSelections: { USA: {}, World: {} },
    dataWeights: {},
    state: undefined,
    detailedView: true,
    showRiskMetrics: true,
    showDemographics: true,
    waterwayValue: 'total',
    transmissionLineType: 'Level 3 (>= 345kV)',
    county: undefined,
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setMap: (state, action: PayloadAction<TopoJson | undefined>) => {
            state.map = action.payload
        },
        setOverlay: (
            state,
            { payload }: PayloadAction<{ name: OverlayName; topoJson?: TopoJson }>
        ) => {
            state.overlays[payload.name].topoJson = payload.topoJson
        },
        setShowOverlay: (
            state,
            { payload }: PayloadAction<{ name: OverlayName; shouldShow: boolean }>
        ) => {
            state.overlays[payload.name].shouldShow = payload.shouldShow
        },
        setShowRiskMetrics: (state, action: PayloadAction<boolean>) => {
            state.showRiskMetrics = action.payload
        },
        setShowDemographics: (state, action: PayloadAction<boolean>) => {
            state.showDemographics = action.payload
        },
        setDetailedView: (state, action: PayloadAction<boolean>) => {
            state.detailedView = action.payload
        },
        setTab: (state, action: PayloadAction<Tab>) => {
            state.tab = action.payload
        },
        changeWeight: (
            state,
            action: PayloadAction<{ mapVisualizationId: MapVisualizationId; weight: number }>
        ) => {
            const { mapVisualizationId, weight } = action.payload
            state.dataWeights[mapVisualizationId] = weight
        },
        changeDateRange: (state, action: PayloadAction<Interval>) => {
            if (state.tab === undefined) {
                return
            }
            state.mapSelections[state.region][state.tab.id][0].dateRange = action.payload
        },
        changeDataSource: (state, action: PayloadAction<number>) => {
            if (state.tab === undefined) {
                return
            }
            state.mapSelections[state.region][state.tab.id][0].dataSource = action.payload
        },
        changeMapSelection: (state, action: PayloadAction<MapVisualization>) => {
            if (state.tab === undefined) {
                return
            }
            const selection = state.mapSelections[state.region][state.tab.id][0]
            const mapVisualization = action.payload
            selection.mapVisualization = mapVisualization.id
            const possibleDataSources = Object.values(mapVisualization.sources).map((s) => s.id)
            if (!possibleDataSources.includes(selection.dataSource)) {
                selection.dataSource = mapVisualization?.default_source ?? possibleDataSources[0]
            }
            const possibleDates = mapVisualization.date_ranges_by_source[selection.dataSource] ?? []
            if (selection.dateRange && !possibleDates.includes(selection.dateRange)) {
                if (mapVisualization.default_date_range) {
                    selection.dateRange = mapVisualization.default_date_range
                } else {
                    selection.dateRange =
                        possibleDates.length > 1 ? possibleDates[1] : possibleDates[0]
                }
            }

            if (mapVisualization?.map_type === MapType.Bubble) {
                // don't zoom in to state on bubble map. it's unsupported right now
                state.state = undefined
                state.county = undefined
            }
        },
        setMapSelections: (state, action: PayloadAction<MapSelection[]>) => {
            if (state.tab === undefined) {
                return
            }
            state.mapSelections[state.region][state.tab.id] = action.payload
        },
        setWaterwayValue(state, action: PayloadAction<WaterwayValue>) {
            state.waterwayValue = action.payload
        },
        setTransmissionLineType(state, action: PayloadAction<TransmissionLineType>) {
            state.transmissionLineType = action.payload
        },
        clickCounty: (state, { payload }: PayloadAction<string>) => {
            if (state.state) {
                state.state = undefined
                state.county = undefined
            } else {
                state.state = payload.slice(0, 2) as State
                state.county = payload
            }
        },
        selectRegion: (state, { payload }: PayloadAction<Region>) => {
            state.region = payload
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(mapApi.endpoints.getTabs.matchFulfilled, (state, actions) => {
            const firstTab = actions.payload[0]
            state.tab = firstTab
        })
        builder.addMatcher(
            mapApi.endpoints.getMapVisualizations.matchFulfilled,
            (state, actions) => {
                Object.entries(actions.payload).forEach(([tabId, mapVisualizations]) => {
                    const firstMap = Object.values(mapVisualizations).reduce((a, b) =>
                        a.order < b.order ? a : b
                    )
                    state.mapSelections[state.region][Number(tabId)] = [
                        getDefaultSelection(firstMap),
                    ]
                })
            }
        )
    },
})

export const {
    setMap,
    setShowOverlay,
    setOverlay,
    setDetailedView,
    changeWeight,
    changeDateRange,
    setTab,
    changeDataSource,
    changeMapSelection,
    setMapSelections,
    setShowDemographics,
    setShowRiskMetrics,
    setWaterwayValue,
    setTransmissionLineType,
    clickCounty,
    selectRegion,
} = appSlice.actions

// Accessors that return a new object every time, or run for a long time.
// Do not use these as they will always force a re-render, or take too long to re-render.
// Instead use the selectors that use them.
const generateMapTransform = (state: State | undefined, map: TopoJson | undefined) => {
    if (state === undefined || map === undefined) {
        return undefined
    }
    const stateFeatures = feature(
        map,
        map.objects.states as GeometryCollection<GeoJsonProperties>
    ).features.reduce((accumulator, currentValue) => {
        accumulator[currentValue.id as State] = currentValue
        return accumulator
    }, {} as Record<State, Feature<Geometry, GeoJsonProperties>>)
    const width = 900
    const bounds = geoPath().bounds(stateFeatures[state])
    const dx = bounds[1][0] - bounds[0][0]
    const dy = bounds[1][1] - bounds[0][1]
    const x = (bounds[0][0] + bounds[1][0]) / 2
    const y = (bounds[0][1] + bounds[1][1]) / 2
    const scale = 0.9 / Math.max(dx / width, dy / 610)
    const translate = [width / 2 - scale * x, 610 / 2 - scale * y]
    const transform = `translate(${translate})scale(${scale})`
    return transform
}

// Selectors
export const selectSelectedTab = (state: RootState) => state.app.tab
export const selectSelections = (state: RootState) => {
    if (state.app.tab === undefined) {
        return []
    }
    const mapSelections = state.app.mapSelections[state.app.region][state.app.tab.id]
    if (mapSelections === undefined) {
        return []
    }

    return mapSelections
}

export const selectMapTransform = createSelector(
    (state: RootState) => state.app.state,
    (state: RootState) => state.app.map,
    generateMapTransform
)

export default appSlice.reducer
