import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DSVParsedArray, autoType, csv as loadCsv } from 'd3'
import { Map } from 'immutable'
import { Dataset } from './Dataset'
import {
    ColorPalette,
    MapVisualization,
    MapVisualizationId,
    MapVisualizationPatch,
    ScaleType,
    applyPatch,
    fetchMapVisualization,
    fetchMapVisualizations,
} from './MapVisualization'
import { GeoId } from './appSlice'

export type DatasetId = number
export type TabId = number
export type Data = Record<GeoId, number | null>
export type DataByMapVisualization = Record<MapVisualizationId, Data>
export type DataQueryParams = {
    mapVisualization: number
    source: number
    startDate: string
    endDate: string
}
export type MapVisualizationQueryParams = {
    includeDrafts?: boolean
    geographyType?: number
}
export type Tab = {
    id: TabId
    name: string
    normalized: boolean
}
export type County = { id: number; name: string; state: number }
export type State = { id: number; name: string }
export type PercentileQueryParams = {
    geoId: number
    category: number
    geographyType: number
}
export type Subcategory = {
    id: number
    name: string
}

export type PercentileRow = {
    name: string
    source: number
    startDate: string
    endDate: string
    percentRank: number
    value: number
    units: string
    formatter_type: number
    decimals: number
}

type Percentiles = {
    [key in DatasetId]: PercentileRow
}

type CountyCsvRow = {
    dataset: number
    dataset_name: string
    source: number
    start_date: string
    end_date: string
    percent_rank: number
    value: number
    units: string
    formatter_type: number
    decimals: number
}

export type CsvRow = {
    id: number
    value: number
}

const transformCountySummary = (csv: DSVParsedArray<CountyCsvRow>): Percentiles => {
    const countySummary: Percentiles = {}
    csv.forEach((row) => {
        countySummary[row.dataset] = {
            name: row.dataset_name,
            source: row.source,
            startDate: row.start_date,
            endDate: row.end_date,
            percentRank: row.percent_rank,
            value: row.value,
            units: row.units,
            formatter_type: row.formatter_type,
            decimals: row.decimals,
        }
    })
    return countySummary
}

export type Data2 = [GeoId, number][]
const transformData = (dataByMapId: [number, DSVParsedArray<CsvRow>][]): Map<number, Data2> =>
    Map(dataByMapId.map(([mapId, data]) => [mapId, data.map((row) => [row.id, row.value])]))

export const mapApi = createApi({
    reducerPath: 'mapApi',
    keepUnusedDataFor: 5 * 60, // 5 minutes
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['MapVisualization', 'Dataset', 'Subcategory'],
    endpoints: (builder) => ({
        getCounties: builder.query<Record<GeoId, County>, undefined>({
            query: () => 'county',
        }),
        getStates: builder.query<Record<GeoId, State>, undefined>({
            query: () => 'state',
        }),
        getPercentiles: builder.query<Percentiles, PercentileQueryParams>({
            queryFn: ({ geoId, category, geographyType }) => {
                const loadingCsv = loadCsv<CountyCsvRow>(
                    `/api/percentile?geo_id=${geoId}&category=${category}&geography_type=${geographyType}`,
                    autoType
                )
                return loadingCsv.then(transformCountySummary).then(
                    (data) => ({ data }),
                    (failure) => ({ error: failure })
                )
            },
        }),
        getData: builder.query<Map<number, Data2>, DataQueryParams[]>({
            queryFn: (queryParams) => {
                const loadingCsvs = queryParams.map(
                    async ({ mapVisualization, source, startDate, endDate }) => {
                        const csvRow = await loadCsv<CsvRow>(
                            `/api/map-visualization/${mapVisualization}/data?source=${source}&start_date=${startDate}&end_date=${endDate}`,
                            autoType
                        )
                        return [mapVisualization, csvRow] as [number, DSVParsedArray<CsvRow>]
                    }
                )
                return Promise.all(loadingCsvs)
                    .then(transformData)
                    .then(
                        (data) => ({ data }),
                        (failure) => ({ error: failure })
                    )
            },
        }),
        getMapVisualization: builder.query<MapVisualization, number>({
            queryFn: (id) =>
                fetchMapVisualization(id).then(
                    (data) => ({ data }),
                    (error) => ({ error })
                ),
            providesTags: (_result, _error, id) => [{ type: 'MapVisualization', id }],
        }),
        getMapVisualizations: builder.query<
            Record<TabId, Record<MapVisualizationId, MapVisualization>>,
            MapVisualizationQueryParams
        >({
            queryFn: (params) =>
                fetchMapVisualizations(params).then(
                    (data) => ({ data }),
                    (error) => ({ error })
                ),
            providesTags: (data) =>
                data
                    ? [
                          ...Object.values(data)
                              .map((mapsById) => Object.keys(mapsById))
                              .flat()
                              .map((id) => ({ type: 'MapVisualization', id } as const)),
                          { type: 'MapVisualization', id: 'ALL' },
                      ]
                    : [{ type: 'MapVisualization', id: 'ALL' }],
        }),
        getTabs: builder.query<Tab[], boolean>({
            query: (includeDrafts) => `data-category?include_drafts=${includeDrafts}`,
        }),
        getColorPalettes: builder.query<ColorPalette[], undefined>({
            query: () => 'color-palette',
        }),
        getScaleTypes: builder.query<ScaleType[], undefined>({
            query: () => 'scale-type',
        }),
        updateMapVisualization: builder.mutation<MapVisualization, MapVisualizationPatch>({
            query: (patch) => ({
                url: 'editor/map-visualization',
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'MapVisualization', id }],
            async onQueryStarted(patch, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    mapApi.util.updateQueryData('getMapVisualization', patch.id, (draft) =>
                        applyPatch(draft, patch)
                    )
                )
                queryFulfilled.catch(() => patchResult.undo())
            },
        }),
        createMapVisualization: builder.mutation<MapVisualization, MapVisualizationPatch>({
            query: (map) => ({
                url: 'editor/map-visualization',
                method: 'POST',
                body: map,
            }),
            invalidatesTags: [{ type: 'MapVisualization', id: 'ALL' }],
        }),
        getDatasets: builder.query<Dataset[], undefined>({
            query: () => 'dataset',
            providesTags: ['Dataset'],
        }),
        getSubcategories: builder.query<Subcategory[], undefined>({
            query: () => 'subcategory',
            providesTags: ['Subcategory'],
        }),
    }),
})

export const {
    useLazyGetDataQuery,
    useGetDataQuery,
    useGetMapVisualizationsQuery,
    useGetTabsQuery,
    useGetColorPalettesQuery,
    useGetScaleTypesQuery,
    useGetMapVisualizationQuery,
    useUpdateMapVisualizationMutation,
    useCreateMapVisualizationMutation,
    useGetDatasetsQuery,
    useGetCountiesQuery,
    useGetStatesQuery,
    useGetPercentilesQuery,
    useGetSubcategoriesQuery,
} = mapApi
