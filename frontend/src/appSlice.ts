import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { geoPath } from 'd3'
import type { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { Interval } from 'luxon'
import { feature } from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
import { MapSelection } from './DataSelector'
import { mapApi, Tab, TabId } from './MapApi'
import { getDefaultSelection, MapSpec, MapSpecId, MapType } from './MapVisualization'
import { State } from './States'
import { RootState } from './store'
import { TopoJson } from './TopoJson'
import usa from './usa.json'
import { WaterwayValue } from './WaterwayType'
import world from './world.json'

const World = world as unknown as TopoJson
const Usa = usa as unknown as TopoJson

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
export type GeoId = number

/**
 * The state id is the most significant two-digits of a 5-digit county id.
 *
 * Example: 12345 -> 12, 123 -> 0
 * See https://en.wikipedia.org/wiki/List_of_United_States_FIPS_codes_by_county
 *
 * @param countyId the county id (or FIPS code)
 * @returns the state id
 */
export const stateId = (countyId: number): State => Math.floor(countyId / 1000) as State

interface AppState {
    readonly region: Region
    readonly mapTransform?: string
    readonly overlays: Record<OverlayName, Overlay>
    readonly mapSelections: Record<Region, Record<TabId, MapSelection[]>>
    readonly dataWeights: Record<MapSpecId, number>
    readonly tab: Tab | undefined
    readonly zoomTo: number | undefined
    readonly county: number | undefined
    readonly detailedView: boolean
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
    zoomTo: undefined,
    detailedView: true,
    waterwayValue: 'total',
    transmissionLineType: 'Level 3 (>= 345kV)',
    county: undefined,
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
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
        setDetailedView: (state, action: PayloadAction<boolean>) => {
            state.detailedView = action.payload
        },
        setTab: (state, action: PayloadAction<Tab>) => {
            state.tab = action.payload
        },
        changeWeight: (
            state,
            action: PayloadAction<{ mapVisualizationId: MapSpecId; weight: number }>
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
        changeMapSelection: (state, action: PayloadAction<MapSpec>) => {
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
                    selection.dateRange = possibleDates.at(-1)!
                }
            }

            if (mapVisualization?.map_type === MapType.Bubble) {
                // don't zoom in to state on bubble map. it's unsupported right now
                state.zoomTo = undefined
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
        clickMap: (state, { payload }: PayloadAction<number>) => {
            if (state.region === 'USA') {
                if (state.zoomTo) {
                    state.zoomTo = undefined
                    state.county = undefined
                } else {
                    state.zoomTo = stateId(payload)
                    state.county = payload
                }
            } else {
                state.zoomTo = state.zoomTo === undefined ? payload : undefined
            }
        },
        selectRegion: (state, { payload }: PayloadAction<Region>) => {
            state.region = payload
            state.zoomTo = undefined
            state.county = undefined
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(mapApi.endpoints.getTabs.matchFulfilled, (state, actions) => {
            const firstTab = actions.payload[0]
            state.tab = firstTab
        })
        builder.addMatcher(mapApi.endpoints.getMapSpecs.matchFulfilled, (state, actions) => {
            Object.entries(actions.payload).forEach(([tabId, mapVisualizations]) => {
                const firstMap = Object.values(mapVisualizations).reduce((a, b) =>
                    a.order < b.order ? a : b
                )
                state.mapSelections[state.region][Number(tabId)] = [getDefaultSelection(firstMap)]
            })
        })
    },
})

export const {
    setShowOverlay,
    setOverlay,
    setDetailedView,
    changeWeight,
    changeDateRange,
    setTab,
    changeDataSource,
    changeMapSelection,
    setMapSelections,
    setWaterwayValue,
    setTransmissionLineType,
    clickMap,
    selectRegion,
} = appSlice.actions

// Accessors that return a new object every time, or run for a long time.
// Do not use these as they will always force a re-render, or take too long to re-render.
// Instead use the selectors that use them.
const generateMapTransform = (zoomTo: number | undefined, region: Region) => {
    if (zoomTo === undefined) {
        return undefined
    }
    const map = region === 'USA' ? Usa : World
    const objects = region === 'USA' ? map.objects.states : map.objects.countries
    const features = feature(map, objects as GeometryCollection<GeoJsonProperties>).features.reduce(
        (accumulator, currentValue) => {
            accumulator[currentValue.id as string] = currentValue
            return accumulator
        },
        {} as Record<string, Feature<Geometry, GeoJsonProperties>>
    )
    const width = 900
    const height = 610
    // pad number id by 0s to match topojson
    // topoJson country id: "012", country id: 12
    // topoJson state id: "01", state id: 1
    const idLength = region === 'USA' ? 2 : 3
    const zoomToId = String(zoomTo).padStart(idLength, '0')

    const bounds = geoPath().bounds(features[zoomToId])
    const dx = bounds[1][0] - bounds[0][0]
    const dy = bounds[1][1] - bounds[0][1]
    const x = (bounds[0][0] + bounds[1][0]) / 2
    const y = (bounds[0][1] + bounds[1][1]) / 2
    const scale = 0.9 / Math.max(dx / width, dy / height)
    const translate: [number, number] = [width / 2 - scale * x, height / 2 - scale * y]
    return { scale, translate }
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
    (state: RootState) => state.app.zoomTo,
    (state: RootState) => state.app.region,
    generateMapTransform
)

export default appSlice.reducer
