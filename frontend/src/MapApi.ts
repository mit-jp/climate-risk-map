import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { autoType, csv as loadCsv, DSVParsedArray } from 'd3'
import { Dataset } from './Dataset'
import {
    applyPatch,
    ColorPalette,
    fetchMapVisualization,
    fetchMapVisualizations,
    MapVisualization,
    MapVisualizationByTabId,
    MapVisualizationPatch,
    ScaleType,
} from './MapVisualization'

export type CountyId = string
export type DatasetId = number
export type DataRow = { [key in DatasetId]: number | null }
export type Data = { [key in CountyId]: number | null }
export type DataByDataset = { [key in DatasetId]: Data }
export type DataQueryParams = {
    dataset: number
    source: number
    startDate: string
    endDate: string
}
export type Tab = { id: number; name: string }
export type County = { id: number; name: string; state: number }
export type State = { id: number; name: string }
export type CountySummaryQueryParams = {
    stateId: number
    countyId: number
    category: number
}

export type CountySummaryRow = {
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

type CountySummary = {
    [key in DatasetId]: CountySummaryRow
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

type CsvRow = {
    state_id: number
    county_id: number
    value: number
}

const mergeFIPSCodes = (row: CsvRow): [CountyId, number | null] => {
    let stateId = row.state_id.toString()
    let countyId = row.county_id.toString()
    const { value } = row

    stateId = '0'.repeat(2 - stateId.length) + stateId
    countyId = '0'.repeat(3 - countyId.length) + countyId
    return [stateId + countyId, value]
}

const transformCountySummary = (csv: DSVParsedArray<CountyCsvRow>): CountySummary => {
    const countySummary: CountySummary = {}
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

const transformData = (
    loadedCsvs: [dataset: number, csv: DSVParsedArray<CsvRow>][]
): DataByDataset => {
    const allData: DataByDataset = {}
    loadedCsvs.forEach(([dataset, csv]) => {
        const dataByCountyId = csv.reduce((accumulator, row) => {
            const [fips, value] = mergeFIPSCodes(row)
            accumulator[fips] = value
            return accumulator
        }, {} as Data)
        allData[dataset] = dataByCountyId
    })
    return allData
}

export const mapApi = createApi({
    reducerPath: 'mapApi',
    keepUnusedDataFor: 5 * 60, // 5 minutes
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['MapVisualization', 'Dataset'],
    endpoints: (builder) => ({
        getCounties: builder.query<Record<string, County>, undefined>({
            query: () => 'county',
        }),
        getStates: builder.query<Record<number, State>, undefined>({
            query: () => 'state',
        }),
        getCountySummary: builder.query<CountySummary, CountySummaryQueryParams>({
            queryFn: ({ stateId, countyId, category }) => {
                const loadingCsv = loadCsv<CountyCsvRow>(
                    `/api/data?state_id=${stateId}&county_id=${countyId}&category=${category}`,
                    autoType
                )
                return loadingCsv.then(transformCountySummary).then(
                    (data) => ({ data }),
                    (failure) => ({ error: failure })
                )
            },
        }),
        getData: builder.query<DataByDataset, DataQueryParams[]>({
            queryFn: (queryParams) => {
                const loadingCsvs = queryParams.map(
                    async ({ dataset, source, startDate, endDate }) => {
                        const csvRow = await loadCsv<CsvRow>(
                            `/api/data/${dataset}?source=${source}&start_date=${startDate}&end_date=${endDate}`,
                            autoType
                        )
                        return [dataset, csvRow] as [number, DSVParsedArray<CsvRow>]
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
        getMapVisualizations: builder.query<MapVisualizationByTabId, boolean>({
            queryFn: (includeDrafts) =>
                fetchMapVisualizations(includeDrafts).then(
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
    useGetCountySummaryQuery,
} = mapApi
